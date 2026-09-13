import Papa from "papaparse";
import type { Parser, ParseResult, RawResultRow } from "../types";

/**
 * Handles the two shapes vendor PC software actually exports:
 *
 *  long  — one row per result:   SampleID, TestCode, Value, Unit
 *  wide  — one row per sample:   SampleID, HGB, RBC, HCT, ...
 *
 * Column names are configurable per analyzer because no two vendors agree on
 * them. Anything we cannot interpret becomes a warning rather than a silent drop.
 */
export interface CsvConfig {
  layout?: "long" | "wide";
  delimiter?: string;
  sampleIdColumn?: string;
  testCodeColumn?: string;
  valueColumn?: string;
  unitColumn?: string;
  flagColumn?: string;
  /** wide layout: columns to ignore (dates, operator names, comments) */
  ignoreColumns?: string[];
}

const norm = (s: string) => s.trim().toLowerCase().replace(/[\s_-]+/g, "");

function findColumn(fields: string[], wanted: string | undefined, fallbacks: string[]): string | null {
  const candidates = wanted ? [wanted, ...fallbacks] : fallbacks;
  for (const c of candidates) {
    const hit = fields.find((f) => norm(f) === norm(c));
    if (hit) return hit;
  }
  return null;
}

export const genericCsvParser: Parser = {
  key: "generic-csv",
  label: "CSV / delimited export",
  description:
    "Reads a CSV, TSV or semicolon file exported by analyzer PC software, in either long (one row per test) or wide (one row per sample) layout.",

  parse(input: string, rawConfig: Record<string, unknown> = {}): ParseResult {
    const config = rawConfig as CsvConfig;
    const warnings: string[] = [];
    const parsed = Papa.parse<Record<string, string>>(input.trim(), {
      header: true,
      skipEmptyLines: true,
      delimiter: config.delimiter ?? "",
      transformHeader: (h) => h.trim(),
    });

    if (parsed.errors.length) {
      for (const e of parsed.errors.slice(0, 5)) {
        warnings.push(`Row ${e.row ?? "?"}: ${e.message}`);
      }
    }

    const fields = parsed.meta.fields ?? [];
    if (fields.length === 0) return { rows: [], warnings: ["No header row found in file."] };

    const sampleCol = findColumn(fields, config.sampleIdColumn, [
      "SampleID", "Sample No", "SampleNo", "Barcode", "Sample", "SID", "Accession", "LabNo", "PatientID",
    ]);
    if (!sampleCol) {
      return { rows: [], warnings: [`Could not find a sample-id column. Columns seen: ${fields.join(", ")}`] };
    }

    const layout =
      config.layout ??
      (findColumn(fields, config.testCodeColumn, ["TestCode", "Test", "Item", "Parameter", "Analyte"])
        ? "long"
        : "wide");

    const rows: RawResultRow[] = [];

    if (layout === "long") {
      const testCol = findColumn(fields, config.testCodeColumn, ["TestCode", "Test", "Item", "Parameter", "Analyte", "Code"]);
      const valueCol = findColumn(fields, config.valueColumn, ["Value", "Result", "Res", "Conc"]);
      const unitCol = findColumn(fields, config.unitColumn, ["Unit", "Units", "UOM"]);
      const flagCol = findColumn(fields, config.flagColumn, ["Flag", "Abnormal", "Remark"]);

      if (!testCol || !valueCol) {
        return { rows: [], warnings: [`Long layout needs a test-code and a value column. Columns seen: ${fields.join(", ")}`] };
      }

      parsed.data.forEach((r, i) => {
        const sampleId = (r[sampleCol] ?? "").trim();
        const machineCode = (r[testCol] ?? "").trim();
        const rawValue = (r[valueCol] ?? "").trim();
        if (!sampleId || !machineCode || rawValue === "") return;
        rows.push({
          sampleId,
          machineCode,
          rawValue,
          unit: unitCol ? (r[unitCol] ?? "").trim() || undefined : undefined,
          flag: flagCol ? (r[flagCol] ?? "").trim() || undefined : undefined,
          sequence: i,
        });
      });
    } else {
      const ignore = new Set(
        [sampleCol, ...(config.ignoreColumns ?? ["Date", "Time", "Name", "Age", "Sex", "Operator", "Comment", "Remarks"])].map(norm),
      );
      parsed.data.forEach((r, i) => {
        const sampleId = (r[sampleCol] ?? "").trim();
        if (!sampleId) return;
        for (const col of fields) {
          if (ignore.has(norm(col))) continue;
          const rawValue = (r[col] ?? "").trim();
          if (rawValue === "") continue;
          rows.push({ sampleId, machineCode: col.trim(), rawValue, sequence: i });
        }
      });
    }

    if (rows.length === 0) warnings.push("File parsed but produced no usable result rows.");

    return {
      rows,
      warnings,
      detected: { format: `csv-${layout}`, sampleCount: new Set(rows.map((r) => r.sampleId)).size },
    };
  },
};
