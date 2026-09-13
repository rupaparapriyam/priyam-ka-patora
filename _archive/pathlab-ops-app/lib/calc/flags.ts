export type Flag = "N" | "H" | "L" | "HH" | "LL" | "A";

export interface RangeLike {
  sex: string; // "A" | "M" | "F"
  ageMinDays: number;
  ageMaxDays: number;
  low: number | null;
  high: number | null;
  criticalLow: number | null;
  criticalHigh: number | null;
  textRange: string | null;
  note: string | null;
}

/**
 * Picks the most specific reference range for this patient: a sex-specific range
 * beats an "any sex" range, and among equals the narrowest age window wins. If
 * nothing matches we return null rather than guessing — an unflagged result is
 * safer than a wrongly flagged one.
 */
export function pickRange<T extends RangeLike>(
  ranges: T[],
  sex: string,
  ageDays: number,
): T | null {
  const matches = ranges.filter(
    (r) =>
      (r.sex === "A" || r.sex === sex) &&
      ageDays >= r.ageMinDays &&
      ageDays <= r.ageMaxDays,
  );
  if (matches.length === 0) return null;

  matches.sort((a, b) => {
    const specA = a.sex === "A" ? 0 : 1;
    const specB = b.sex === "A" ? 0 : 1;
    if (specA !== specB) return specB - specA;
    return (
      a.ageMaxDays - a.ageMinDays - (b.ageMaxDays - b.ageMinDays)
    );
  });
  return matches[0];
}

export function flagFor(value: number, range: RangeLike | null): Flag {
  if (!range) return "N";
  if (range.criticalHigh != null && value >= range.criticalHigh) return "HH";
  if (range.criticalLow != null && value <= range.criticalLow) return "LL";
  if (range.high != null && value > range.high) return "H";
  if (range.low != null && value < range.low) return "L";
  return "N";
}

export function flagText(value: string, range: RangeLike | null): Flag {
  if (!range?.textRange) return "N";
  return value.trim().toLowerCase() === range.textRange.trim().toLowerCase() ? "N" : "A";
}

export function isCritical(flag: Flag): boolean {
  return flag === "HH" || flag === "LL";
}

export function formatRange(range: RangeLike | null): string {
  if (!range) return "—";
  if (range.textRange) return range.textRange;
  if (range.low != null && range.high != null) return `${range.low} – ${range.high}`;
  if (range.high != null) return `< ${range.high}`;
  if (range.low != null) return `> ${range.low}`;
  return "—";
}

export const FLAG_LABEL: Record<Flag, string> = {
  N: "",
  H: "High",
  L: "Low",
  HH: "Critical High",
  LL: "Critical Low",
  A: "Abnormal",
};
