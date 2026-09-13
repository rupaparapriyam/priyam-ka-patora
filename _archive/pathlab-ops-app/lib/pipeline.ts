import { prisma, audit } from "./db";
import { deriveResults } from "./calc/engine";
import { pickRange, flagFor, flagText, type RangeLike } from "./calc/flags";
import { ageInDays, ageInYears, type Sex } from "./age";
import { getParser, type RawResultRow } from "./ingest";

/**
 * The pipeline has exactly two entry points:
 *
 *   applyImport()      machine file  -> raw results stored against an order
 *   recomputeOrder()   raw results   -> derived values, reference ranges, flags
 *
 * recomputeOrder is idempotent and is re-run after every change, so a corrected
 * value immediately re-drives everything that depended on it. Raw machine values
 * are never modified — corrections are stored as the interpreted value while
 * rawValue keeps what the analyzer actually said.
 */

// ------------------------------------------------------------------ recompute

export interface RecomputeSummary {
  orderId: string;
  measured: number;
  derived: number;
  suppressed: { code: string; reason: string }[];
  flagged: { code: string; name: string; value: number | null; flag: string }[];
  critical: { code: string; name: string; value: number | null; flag: string }[];
}

export async function recomputeOrder(orderId: string): Promise<RecomputeSummary> {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { patient: true, results: { include: { analyte: true } } },
  });

  const sex = (order.patient.sex as Sex) ?? "O";
  const ctx = { sex, ageYears: ageInYears(order.patient) };
  const ageDays = ageInDays(order.patient);

  // 1. measured values only — derived ones get rebuilt from scratch every time
  const measured: Record<string, number> = {};
  for (const r of order.results) {
    if (r.source === "DERIVED") continue;
    if (r.value != null && Number.isFinite(r.value)) measured[r.analyte.code] = r.value;
  }

  const { derived, suppressed } = deriveResults(measured, ctx);

  // 2. write derived values
  const derivedCodes = new Set(derived.map((d) => d.code));
  const analytes = await prisma.analyte.findMany({
    where: { code: { in: [...derivedCodes] } },
  });
  const analyteByCode = new Map(analytes.map((a) => [a.code, a]));

  for (const d of derived) {
    const analyte = analyteByCode.get(d.code);
    if (!analyte) continue; // formula output not in this lab's catalog — skip silently
    await prisma.result.upsert({
      where: { orderId_analyteId: { orderId, analyteId: analyte.id } },
      create: {
        orderId,
        analyteId: analyte.id,
        value: d.value,
        unit: d.unit || analyte.unit,
        source: "DERIVED",
        status: "DERIVED",
        comment: d.note,
      },
      update: {
        value: d.value,
        unit: d.unit || analyte.unit,
        source: "DERIVED",
        status: "DERIVED",
        comment: d.note,
      },
    });
  }

  // 3. drop derived rows that are no longer derivable (an input was cleared)
  await prisma.result.deleteMany({
    where: {
      orderId,
      source: "DERIVED",
      analyte: { code: { notIn: [...derivedCodes] } },
    },
  });

  // 4. reference ranges + flags for everything on the order
  const fresh = await prisma.result.findMany({
    where: { orderId },
    include: { analyte: { include: { ranges: true } } },
  });

  const flagged: RecomputeSummary["flagged"] = [];
  const critical: RecomputeSummary["critical"] = [];

  for (const r of fresh) {
    const range = pickRange(r.analyte.ranges as unknown as RangeLike[], sex, ageDays);
    let flag = "N";
    if (r.analyte.valueType === "TEXT") {
      flag = r.textValue ? flagText(r.textValue, range) : "N";
    } else if (r.value != null) {
      flag = flagFor(r.value, range);
    }

    await prisma.result.update({
      where: { id: r.id },
      data: {
        flag,
        refLow: range?.low ?? null,
        refHigh: range?.high ?? null,
        refText: range?.textRange ?? null,
        unit: r.unit ?? r.analyte.unit,
      },
    });

    if (flag !== "N") {
      const entry = { code: r.analyte.code, name: r.analyte.name, value: r.value, flag };
      flagged.push(entry);
      if (flag === "HH" || flag === "LL") critical.push(entry);
    }
  }

  await audit({
    action: "UPDATE",
    entity: "Order",
    entityId: orderId,
    detail: `recompute: ${Object.keys(measured).length} measured, ${derived.length} derived, ${suppressed.length} suppressed, ${critical.length} critical`,
  });

  return {
    orderId,
    measured: Object.keys(measured).length,
    derived: derived.length,
    suppressed: suppressed.map((s) => ({ code: s.code, reason: s.reason })),
    flagged,
    critical,
  };
}

// --------------------------------------------------------------------- import

export interface ImportSummary {
  batchId: string;
  rowCount: number;
  matched: number;
  unmatchedSamples: string[];
  unmappedCodes: string[];
  unparsableValues: { machineCode: string; rawValue: string }[];
  ordersTouched: string[];
  warnings: string[];
}

export async function applyImport(args: {
  analyzerId: string;
  content: string;
  filename?: string;
  actor?: string;
}): Promise<ImportSummary> {
  const analyzer = await prisma.analyzer.findUniqueOrThrow({
    where: { id: args.analyzerId },
    include: { mappings: { include: { analyte: true } } },
  });

  const parser = getParser(analyzer.parserKey);
  const config = analyzer.configJson ? JSON.parse(analyzer.configJson) : {};
  const parsed = parser.parse(args.content, config);

  const batch = await prisma.importBatch.create({
    data: {
      analyzerId: analyzer.id,
      filename: args.filename,
      rowCount: parsed.rows.length,
      status: "PARSED",
      rawSample: args.content.slice(0, 1200),
    },
  });

  const mapByCode = new Map(
    analyzer.mappings.map((m) => [m.machineCode.trim().toLowerCase(), m]),
  );

  const unmatchedSamples = new Set<string>();
  const unmappedCodes = new Set<string>();
  const unparsableValues: ImportSummary["unparsableValues"] = [];
  const ordersTouched = new Set<string>();
  let matched = 0;

  // resolve sample barcodes once
  const sampleIds = [...new Set(parsed.rows.map((r) => r.sampleId))];
  const samples = await prisma.sample.findMany({
    where: { barcode: { in: sampleIds } },
  });
  const sampleByBarcode = new Map(samples.map((s) => [s.barcode, s]));

  for (const row of parsed.rows as RawResultRow[]) {
    const sample = sampleByBarcode.get(row.sampleId);
    if (!sample) {
      unmatchedSamples.add(row.sampleId);
      continue;
    }
    const mapping = mapByCode.get(row.machineCode.trim().toLowerCase());
    if (!mapping) {
      unmappedCodes.add(row.machineCode);
      continue;
    }

    const analyte = mapping.analyte;
    const numeric = Number.parseFloat(row.rawValue.replace(/[^0-9eE+\-.]/g, ""));
    const isNumeric = analyte.valueType === "NUMERIC" && Number.isFinite(numeric);

    if (analyte.valueType === "NUMERIC" && !isNumeric) {
      unparsableValues.push({ machineCode: row.machineCode, rawValue: row.rawValue });
      continue;
    }

    await prisma.result.upsert({
      where: { orderId_analyteId: { orderId: sample.orderId, analyteId: analyte.id } },
      create: {
        orderId: sample.orderId,
        analyteId: analyte.id,
        sampleId: sample.id,
        rawValue: row.rawValue,
        value: isNumeric ? numeric * mapping.factor + mapping.offset : null,
        textValue: isNumeric ? null : row.rawValue,
        unit: row.unit || analyte.unit,
        source: "IMPORT",
        status: "ENTERED",
        analyzerId: analyzer.id,
        importBatchId: batch.id,
      },
      update: {
        rawValue: row.rawValue,
        value: isNumeric ? numeric * mapping.factor + mapping.offset : null,
        textValue: isNumeric ? null : row.rawValue,
        unit: row.unit || analyte.unit,
        source: "IMPORT",
        status: "ENTERED",
        analyzerId: analyzer.id,
        importBatchId: batch.id,
        sampleId: sample.id,
      },
    });

    matched++;
    ordersTouched.add(sample.orderId);
  }

  for (const orderId of ordersTouched) {
    await recomputeOrder(orderId);
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "IN_PROCESS" },
    });
  }

  await prisma.importBatch.update({
    where: { id: batch.id },
    data: {
      matchedCount: matched,
      unmatchedCount: parsed.rows.length - matched,
      status: matched > 0 ? "APPLIED" : "FAILED",
      notes: [
        unmatchedSamples.size ? `Unknown sample ids: ${[...unmatchedSamples].join(", ")}` : "",
        unmappedCodes.size ? `Unmapped machine codes: ${[...unmappedCodes].join(", ")}` : "",
        ...parsed.warnings,
      ]
        .filter(Boolean)
        .join(" | ") || null,
    },
  });

  await audit({
    actor: args.actor,
    action: "IMPORT",
    entity: "ImportBatch",
    entityId: batch.id,
    detail: `${analyzer.name}: ${matched}/${parsed.rows.length} rows applied to ${ordersTouched.size} order(s)`,
  });

  return {
    batchId: batch.id,
    rowCount: parsed.rows.length,
    matched,
    unmatchedSamples: [...unmatchedSamples],
    unmappedCodes: [...unmappedCodes],
    unparsableValues,
    ordersTouched: [...ordersTouched],
    warnings: parsed.warnings,
  };
}
