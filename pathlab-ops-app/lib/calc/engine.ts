import { FORMULAS, type Formula, type FormulaContext, round } from "./formulas";

export interface DerivedValue {
  code: string;
  value: number;
  unit: string;
  decimals: number;
  formulaKey: string;
  note?: string;
}

export interface SuppressedValue {
  code: string;
  formulaKey: string;
  reason: string;
}

export interface DeriveOutput {
  derived: DerivedValue[];
  suppressed: SuppressedValue[];
}

/**
 * Runs the formula registry over a set of measured values.
 *
 * Chained derivations are handled by repeating passes until nothing new appears
 * (Urea -> BUN -> osmolality; LDL -> LDL/HDL ratio; differential % -> absolute
 * counts -> NLR). A measured value always wins over a calculated one — if the
 * analyzer reported LDL directly, we do not overwrite it with Friedewald.
 */
export function deriveResults(
  measured: Record<string, number>,
  ctx: FormulaContext,
  opts: { maxPasses?: number } = {},
): DeriveOutput {
  const maxPasses = opts.maxPasses ?? 5;
  const values: Record<string, number> = { ...measured };
  const measuredCodes = new Set(Object.keys(measured));
  const derived = new Map<string, DerivedValue>();
  const suppressed = new Map<string, SuppressedValue>();

  for (let pass = 0; pass < maxPasses; pass++) {
    let changed = false;

    for (const f of FORMULAS) {
      if (measuredCodes.has(f.output)) continue; // never overwrite a measured value
      if (derived.has(f.output)) continue;

      const ready = f.inputs.every(
        (code) => typeof values[code] === "number" && Number.isFinite(values[code]),
      );
      if (!ready) continue;

      const reason = f.guard?.(values, ctx) ?? null;
      if (reason) {
        suppressed.set(f.output, { code: f.output, formulaKey: f.key, reason });
        continue;
      }

      const raw = f.compute(values, ctx);
      if (!Number.isFinite(raw)) {
        suppressed.set(f.output, {
          code: f.output,
          formulaKey: f.key,
          reason: "Calculation produced a non-finite value",
        });
        continue;
      }

      const value = round(raw, f.decimals);
      values[f.output] = value;
      derived.set(f.output, {
        code: f.output,
        value,
        unit: f.unit,
        decimals: f.decimals,
        formulaKey: f.key,
        note: f.note,
      });
      suppressed.delete(f.output);
      changed = true;
    }

    if (!changed) break;
  }

  return { derived: [...derived.values()], suppressed: [...suppressed.values()] };
}

/** Which formulas could run if the listed analytes were also filled in. */
export function missingInputsFor(
  formula: Formula,
  available: Record<string, number>,
): string[] {
  return formula.inputs.filter((c) => typeof available[c] !== "number");
}
