import type { Parser, ParseResult, RawResultRow } from "../types";

/**
 * ASTM E1394 / LIS2-A2 — the protocol most Indian analyzers speak over their
 * RS232 or ethernet "LIS port".
 *
 * This parses a captured ASTM message (records separated by CR, fields by "|",
 * components by "^"). The transport layer — serial/TCP framing with STX/ETX,
 * checksums and ENQ/ACK handshaking — is deliberately NOT here; that belongs in
 * a small always-on listener process. Parsing the payload is the part that is
 * identical either way, so it is written and testable now, and the same function
 * serves both a pasted capture file and a live socket later.
 *
 * Record types used:  O = order (carries the specimen id), R = result.
 */
export const astmParser: Parser = {
  key: "astm-e1394",
  label: "ASTM E1394 / LIS2-A2 capture",
  description:
    "Parses an ASTM message captured from an analyzer's LIS port. Transport framing is handled separately by the listener.",

  parse(input: string): ParseResult {
    const warnings: string[] = [];
    const rows: RawResultRow[] = [];

    const records = input
      .replace(/\x02|\x03|\x04|\x05/g, "")
      .split(/\r\n|\r|\n/)
      .map((r) => r.trim())
      .filter(Boolean);

    let currentSample = "";

    for (const rec of records) {
      const fields = rec.split("|");
      const type = (fields[0] ?? "").replace(/^\d+/, "").toUpperCase().charAt(0);

      if (type === "O") {
        // O|1|SpecimenID|InstrumentSpecimenID|^^^TestCode|...
        const specimen = (fields[2] ?? "").split("^")[0].trim();
        const instrumentSpecimen = (fields[3] ?? "").split("^")[0].trim();
        currentSample = specimen || instrumentSpecimen;
        if (!currentSample) warnings.push(`Order record without a specimen id: ${rec.slice(0, 60)}`);
      }

      if (type === "R") {
        // R|1|^^^TestCode^DilutionFactor|Value|Unit|RefRange|AbnormalFlag|...|DateTime
        // Universal Test ID is ^^^TestCode^DilutionFactor — the code lives in the
        // 4th component. Falling back to the first non-empty component covers the
        // analyzers that only send a bare code.
        const parts = (fields[2] ?? "").split("^").map((c) => c.trim());
        const machineCode = parts[3] || parts.find((c) => c !== "") || "";
        const rawValue = (fields[3] ?? "").trim();
        const unit = (fields[4] ?? "").trim();
        const flag = (fields[6] ?? "").trim();
        const measuredAt = (fields[12] ?? "").trim();

        if (!machineCode || rawValue === "") continue;
        if (!currentSample) {
          warnings.push(`Result for "${machineCode}" appeared before any order record — skipped.`);
          continue;
        }
        rows.push({
          sampleId: currentSample,
          machineCode,
          rawValue,
          unit: unit || undefined,
          flag: flag || undefined,
          measuredAt: measuredAt || undefined,
          sequence: rows.length,
        });
      }
    }

    if (rows.length === 0) warnings.push("No R (result) records found in this message.");

    return {
      rows,
      warnings,
      detected: { format: "astm-e1394", sampleCount: new Set(rows.map((r) => r.sampleId)).size },
    };
  },
};
