import type { Flag } from "@/lib/calc/flags";

const FLAG_STYLE: Record<string, string> = {
  N: "",
  H: "bg-amber-100 text-amber-800",
  L: "bg-sky-100 text-sky-800",
  HH: "bg-red-600 text-white",
  LL: "bg-red-600 text-white",
  A: "bg-amber-100 text-amber-800",
};

const FLAG_TEXT: Record<string, string> = {
  N: "", H: "High", L: "Low", HH: "CRITICAL HIGH", LL: "CRITICAL LOW", A: "Abnormal",
};

export function FlagBadge({ flag }: { flag: string }) {
  if (!flag || flag === "N") return null;
  return <span className={`badge ${FLAG_STYLE[flag] ?? ""}`}>{FLAG_TEXT[flag] ?? flag}</span>;
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    REGISTERED: "bg-slate-100 text-slate-700",
    COLLECTED: "bg-slate-100 text-slate-700",
    IN_PROCESS: "bg-sky-100 text-sky-800",
    VERIFIED: "bg-emerald-100 text-emerald-800",
    REPORTED: "bg-emerald-100 text-emerald-800",
  };
  return <span className={`badge ${map[status] ?? "bg-slate-100 text-slate-700"}`}>{status.replace("_", " ")}</span>;
}

export function fmt(value: number | null, decimals: number): string {
  if (value == null) return "";
  return value.toFixed(decimals);
}
