/**
 * Derived-result formula registry.
 *
 * Every derived analyte in the catalog carries a `formulaKey` that points at one
 * entry here. Rules that make this safe rather than clever:
 *   - a formula runs only when every input it needs is present and numeric
 *   - `guard` can veto a calculation on clinical grounds (e.g. Friedewald LDL is
 *     not valid at triglycerides > 400 mg/dL) and the reason is surfaced, not hidden
 *   - units are fixed and stated; nothing here silently converts SI <-> conventional
 *
 * Units used throughout are the conventional Indian lab units (mg/dL, g/dL,
 * mEq/L), because that is what the analyzers in these labs report.
 */

import type { Sex } from "../age";

export interface FormulaContext {
  sex: Sex;
  ageYears: number;
}

export interface Formula {
  key: string;
  output: string; // canonical analyte code produced
  label: string;
  unit: string;
  decimals: number;
  inputs: string[]; // canonical analyte codes required
  /** Optional clinical validity gate. Return a reason string to suppress. */
  guard?: (v: Record<string, number>, ctx: FormulaContext) => string | null;
  compute: (v: Record<string, number>, ctx: FormulaContext) => number;
  note?: string;
}

const round = (n: number, d: number) => {
  const f = Math.pow(10, d);
  return Math.round((n + Number.EPSILON) * f) / f;
};

export const FORMULAS: Formula[] = [
  // ---------------------------------------------------------- haematology
  {
    key: "mcv",
    output: "MCV",
    label: "MCV",
    unit: "fL",
    decimals: 1,
    inputs: ["HCT", "RBC"],
    guard: (v) => (v.RBC <= 0 ? "RBC count is zero" : null),
    compute: (v) => (v.HCT / v.RBC) * 10,
    note: "MCV = (HCT ÷ RBC) × 10",
  },
  {
    key: "mch",
    output: "MCH",
    label: "MCH",
    unit: "pg",
    decimals: 1,
    inputs: ["HB", "RBC"],
    guard: (v) => (v.RBC <= 0 ? "RBC count is zero" : null),
    compute: (v) => (v.HB / v.RBC) * 10,
    note: "MCH = (Hb ÷ RBC) × 10",
  },
  {
    key: "mchc",
    output: "MCHC",
    label: "MCHC",
    unit: "g/dL",
    decimals: 1,
    inputs: ["HB", "HCT"],
    guard: (v) => (v.HCT <= 0 ? "Haematocrit is zero" : null),
    compute: (v) => (v.HB / v.HCT) * 100,
    note: "MCHC = (Hb ÷ HCT) × 100",
  },
  ...(
    [
      ["NEUT", "Neutrophils"],
      ["LYMPH", "Lymphocytes"],
      ["MONO", "Monocytes"],
      ["EOS", "Eosinophils"],
      ["BASO", "Basophils"],
    ] as const
  ).map<Formula>(([code, name]) => ({
    key: `abs_${code.toLowerCase()}`,
    output: `${code}_ABS`,
    label: `Absolute ${name}`,
    unit: "10³/µL",
    decimals: 2,
    inputs: ["TLC", `${code}_PCT`],
    compute: (v) => (v.TLC * v[`${code}_PCT`]) / 100,
    note: `Absolute ${name.toLowerCase()} = TLC × ${name.toLowerCase()} % ÷ 100`,
  })),
  {
    key: "nlr",
    output: "NLR",
    label: "Neutrophil–Lymphocyte Ratio",
    unit: "ratio",
    decimals: 2,
    inputs: ["NEUT_ABS", "LYMPH_ABS"],
    guard: (v) => (v.LYMPH_ABS <= 0 ? "Absolute lymphocyte count is zero" : null),
    compute: (v) => v.NEUT_ABS / v.LYMPH_ABS,
  },

  // ---------------------------------------------------------- liver / protein
  {
    key: "bili_indirect",
    output: "BIL_I",
    label: "Bilirubin, Indirect",
    unit: "mg/dL",
    decimals: 2,
    inputs: ["BIL_T", "BIL_D"],
    compute: (v) => v.BIL_T - v.BIL_D,
    note: "Indirect = Total − Direct",
  },
  {
    key: "globulin",
    output: "GLOB",
    label: "Globulin",
    unit: "g/dL",
    decimals: 2,
    inputs: ["TP", "ALB"],
    compute: (v) => v.TP - v.ALB,
    note: "Globulin = Total Protein − Albumin",
  },
  {
    key: "ag_ratio",
    output: "AG_RATIO",
    label: "A/G Ratio",
    unit: "ratio",
    decimals: 2,
    inputs: ["ALB", "GLOB"],
    guard: (v) => (v.GLOB <= 0 ? "Globulin is zero or negative" : null),
    compute: (v) => v.ALB / v.GLOB,
  },

  // ---------------------------------------------------------- lipids
  {
    key: "vldl",
    output: "VLDL",
    label: "VLDL Cholesterol",
    unit: "mg/dL",
    decimals: 0,
    inputs: ["TG"],
    guard: (v) => (v.TG > 400 ? "Triglycerides > 400 mg/dL — TG/5 estimate not valid" : null),
    compute: (v) => v.TG / 5,
    note: "VLDL ≈ Triglycerides ÷ 5",
  },
  {
    key: "ldl_friedewald",
    output: "LDL",
    label: "LDL Cholesterol (calculated)",
    unit: "mg/dL",
    decimals: 0,
    inputs: ["CHOL", "HDL", "TG"],
    guard: (v) =>
      v.TG > 400
        ? "Triglycerides > 400 mg/dL — Friedewald equation not valid, direct LDL required"
        : null,
    compute: (v) => v.CHOL - v.HDL - v.TG / 5,
    note: "Friedewald: LDL = Total Cholesterol − HDL − (TG ÷ 5)",
  },
  {
    key: "non_hdl",
    output: "NONHDL",
    label: "Non-HDL Cholesterol",
    unit: "mg/dL",
    decimals: 0,
    inputs: ["CHOL", "HDL"],
    compute: (v) => v.CHOL - v.HDL,
  },
  {
    key: "chol_hdl_ratio",
    output: "CHOL_HDL",
    label: "Total Cholesterol / HDL Ratio",
    unit: "ratio",
    decimals: 2,
    inputs: ["CHOL", "HDL"],
    guard: (v) => (v.HDL <= 0 ? "HDL is zero" : null),
    compute: (v) => v.CHOL / v.HDL,
  },
  {
    key: "ldl_hdl_ratio",
    output: "LDL_HDL",
    label: "LDL / HDL Ratio",
    unit: "ratio",
    decimals: 2,
    inputs: ["LDL", "HDL"],
    guard: (v) => (v.HDL <= 0 ? "HDL is zero" : null),
    compute: (v) => v.LDL / v.HDL,
  },

  // ---------------------------------------------------------- renal
  {
    key: "bun_from_urea",
    output: "BUN",
    label: "Blood Urea Nitrogen",
    unit: "mg/dL",
    decimals: 1,
    inputs: ["UREA"],
    compute: (v) => v.UREA / 2.14,
    note: "BUN = Urea ÷ 2.14",
  },
  {
    key: "bun_creat_ratio",
    output: "BUN_CREAT",
    label: "BUN / Creatinine Ratio",
    unit: "ratio",
    decimals: 1,
    inputs: ["BUN", "CREAT"],
    guard: (v) => (v.CREAT <= 0 ? "Creatinine is zero" : null),
    compute: (v) => v.BUN / v.CREAT,
  },
  {
    key: "egfr_ckdepi_2021",
    output: "EGFR",
    label: "eGFR (CKD-EPI 2021)",
    unit: "mL/min/1.73m²",
    decimals: 0,
    inputs: ["CREAT"],
    guard: (v, ctx) => {
      if (v.CREAT <= 0) return "Creatinine is zero";
      if (ctx.ageYears < 18) return "CKD-EPI is not validated under 18 years";
      if (ctx.sex === "O") return "Equation requires sex-specific coefficients";
      return null;
    },
    compute: (v, ctx) => {
      const female = ctx.sex === "F";
      const k = female ? 0.7 : 0.9;
      const a = female ? -0.241 : -0.302;
      const scr = v.CREAT / k;
      return (
        142 *
        Math.pow(Math.min(scr, 1), a) *
        Math.pow(Math.max(scr, 1), -1.2) *
        Math.pow(0.9938, ctx.ageYears) *
        (female ? 1.012 : 1)
      );
    },
    note: "CKD-EPI 2021 creatinine equation (race-free)",
  },
  {
    key: "anion_gap",
    output: "ANION_GAP",
    label: "Anion Gap",
    unit: "mEq/L",
    decimals: 1,
    inputs: ["NA", "CL", "HCO3"],
    compute: (v) => v.NA - (v.CL + v.HCO3),
    note: "Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻)",
  },
  {
    key: "osmolality_calc",
    output: "OSMO_CALC",
    label: "Calculated Osmolality",
    unit: "mOsm/kg",
    decimals: 0,
    inputs: ["NA", "GLU_F", "BUN"],
    compute: (v) => 2 * v.NA + v.GLU_F / 18 + v.BUN / 2.8,
    note: "2 × Na⁺ + glucose/18 + BUN/2.8",
  },
  {
    key: "corrected_calcium",
    output: "CA_CORR",
    label: "Corrected Calcium",
    unit: "mg/dL",
    decimals: 2,
    inputs: ["CA", "ALB"],
    compute: (v) => v.CA + 0.8 * (4.0 - v.ALB),
    note: "Corrected Ca = measured Ca + 0.8 × (4.0 − albumin)",
  },

  // ---------------------------------------------------------- glycaemic
  {
    key: "eag_from_hba1c",
    output: "EAG",
    label: "Estimated Average Glucose",
    unit: "mg/dL",
    decimals: 0,
    inputs: ["HBA1C"],
    compute: (v) => 28.7 * v.HBA1C - 46.7,
    note: "eAG = 28.7 × HbA1c − 46.7 (ADAG study)",
  },
];

export const FORMULA_BY_KEY: Record<string, Formula> = Object.fromEntries(
  FORMULAS.map((f) => [f.key, f]),
);

export const FORMULA_BY_OUTPUT: Record<string, Formula> = Object.fromEntries(
  FORMULAS.map((f) => [f.output, f]),
);

export { round };
