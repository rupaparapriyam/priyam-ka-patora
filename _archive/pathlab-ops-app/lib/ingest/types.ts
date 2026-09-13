/** One result as it came off a machine, before any mapping or calculation. */
export interface RawResultRow {
  sampleId: string; // barcode / sample no. as the machine reported it
  machineCode: string; // the machine's own test code, e.g. "HGB", "18"
  rawValue: string;
  unit?: string;
  flag?: string; // machine's own flag, kept for reference only — we recompute ours
  measuredAt?: string;
  sequence?: number;
}

export interface ParseResult {
  rows: RawResultRow[];
  warnings: string[];
  detected?: { format: string; sampleCount: number };
}

export interface Parser {
  key: string;
  label: string;
  description: string;
  parse(input: string, config?: Record<string, unknown>): ParseResult;
}
