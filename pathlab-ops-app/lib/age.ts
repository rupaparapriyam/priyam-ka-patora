export type Sex = "M" | "F" | "O";

export interface PatientAgeInput {
  dob?: Date | null;
  ageYears?: number | null;
  ageMonths?: number | null;
  ageDays?: number | null;
}

/**
 * Reference ranges are stored in days so one comparison spans neonate -> adult.
 * DOB wins when present; otherwise we fall back to the recorded age, which is
 * how most Indian labs actually register a patient.
 */
export function ageInDays(p: PatientAgeInput, on: Date = new Date()): number {
  if (p.dob) {
    const ms = on.getTime() - new Date(p.dob).getTime();
    return Math.max(0, Math.floor(ms / 86_400_000));
  }
  const y = p.ageYears ?? 0;
  const m = p.ageMonths ?? 0;
  const d = p.ageDays ?? 0;
  return Math.round(y * 365.25 + m * 30.44 + d);
}

export function ageInYears(p: PatientAgeInput, on: Date = new Date()): number {
  return ageInDays(p, on) / 365.25;
}

export function formatAge(p: PatientAgeInput, on: Date = new Date()): string {
  const days = ageInDays(p, on);
  if (days < 31) return `${days} D`;
  if (days < 366) return `${Math.floor(days / 30.44)} M`;
  return `${Math.floor(days / 365.25)} Y`;
}
