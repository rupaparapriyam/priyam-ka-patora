/**
 * Starter analyte catalog + reference ranges.
 *
 * IMPORTANT: these ranges are conventional textbook adult values in Indian lab
 * units. They are a starting point, NOT the lab's ranges. Every lab must verify
 * or replace them against its own method/instrument — NABL/ISO 15189 requires
 * the lab to define and periodically review its own biological reference
 * intervals. The app stores ranges in the database precisely so they can be
 * edited per lab without touching code.
 */

export type AnalyteSeed = {
  code: string;
  name: string;
  unit?: string;
  category: "HEMATOLOGY" | "BIOCHEMISTRY" | "IMMUNOASSAY" | "URINE" | "COAGULATION" | "OTHER";
  decimals?: number;
  valueType?: "NUMERIC" | "TEXT";
  isDerived?: boolean;
  formulaKey?: string;
  sortOrder?: number;
  method?: string;
};

// [sex, ageMinDays, ageMaxDays, low, high, criticalLow, criticalHigh]
export type RangeSeed = {
  code: string;
  sex?: "A" | "M" | "F";
  ageMinDays?: number;
  ageMaxDays?: number;
  low?: number | null;
  high?: number | null;
  criticalLow?: number | null;
  criticalHigh?: number | null;
  textRange?: string | null;
  note?: string | null;
};

const H = "HEMATOLOGY" as const;
const B = "BIOCHEMISTRY" as const;
const I = "IMMUNOASSAY" as const;
const U = "URINE" as const;
const C = "COAGULATION" as const;

export const ANALYTES: AnalyteSeed[] = [
  // ------------------------------------------------- haematology
  { code: "HB", name: "Haemoglobin", unit: "g/dL", category: H, decimals: 1, sortOrder: 10 },
  { code: "RBC", name: "RBC Count", unit: "10⁶/µL", category: H, decimals: 2, sortOrder: 20 },
  { code: "HCT", name: "Haematocrit (PCV)", unit: "%", category: H, decimals: 1, sortOrder: 30 },
  { code: "MCV", name: "MCV", unit: "fL", category: H, decimals: 1, sortOrder: 40, isDerived: true, formulaKey: "mcv" },
  { code: "MCH", name: "MCH", unit: "pg", category: H, decimals: 1, sortOrder: 50, isDerived: true, formulaKey: "mch" },
  { code: "MCHC", name: "MCHC", unit: "g/dL", category: H, decimals: 1, sortOrder: 60, isDerived: true, formulaKey: "mchc" },
  { code: "RDW", name: "RDW-CV", unit: "%", category: H, decimals: 1, sortOrder: 70 },
  { code: "PLT", name: "Platelet Count", unit: "10³/µL", category: H, decimals: 0, sortOrder: 80 },
  { code: "MPV", name: "MPV", unit: "fL", category: H, decimals: 1, sortOrder: 85 },
  { code: "TLC", name: "Total Leucocyte Count", unit: "10³/µL", category: H, decimals: 2, sortOrder: 90 },
  { code: "NEUT_PCT", name: "Neutrophils", unit: "%", category: H, decimals: 0, sortOrder: 100 },
  { code: "LYMPH_PCT", name: "Lymphocytes", unit: "%", category: H, decimals: 0, sortOrder: 110 },
  { code: "MONO_PCT", name: "Monocytes", unit: "%", category: H, decimals: 0, sortOrder: 120 },
  { code: "EOS_PCT", name: "Eosinophils", unit: "%", category: H, decimals: 0, sortOrder: 130 },
  { code: "BASO_PCT", name: "Basophils", unit: "%", category: H, decimals: 0, sortOrder: 140 },
  { code: "NEUT_ABS", name: "Absolute Neutrophil Count", unit: "10³/µL", category: H, decimals: 2, sortOrder: 150, isDerived: true, formulaKey: "abs_neut" },
  { code: "LYMPH_ABS", name: "Absolute Lymphocyte Count", unit: "10³/µL", category: H, decimals: 2, sortOrder: 160, isDerived: true, formulaKey: "abs_lymph" },
  { code: "MONO_ABS", name: "Absolute Monocyte Count", unit: "10³/µL", category: H, decimals: 2, sortOrder: 170, isDerived: true, formulaKey: "abs_mono" },
  { code: "EOS_ABS", name: "Absolute Eosinophil Count", unit: "10³/µL", category: H, decimals: 2, sortOrder: 180, isDerived: true, formulaKey: "abs_eos" },
  { code: "BASO_ABS", name: "Absolute Basophil Count", unit: "10³/µL", category: H, decimals: 2, sortOrder: 190, isDerived: true, formulaKey: "abs_baso" },
  { code: "NLR", name: "Neutrophil–Lymphocyte Ratio", unit: "ratio", category: H, decimals: 2, sortOrder: 200, isDerived: true, formulaKey: "nlr" },
  { code: "ESR", name: "ESR (Westergren)", unit: "mm/hr", category: H, decimals: 0, sortOrder: 210 },

  // ------------------------------------------------- biochemistry
  { code: "GLU_F", name: "Glucose, Fasting", unit: "mg/dL", category: B, decimals: 0, sortOrder: 300 },
  { code: "GLU_PP", name: "Glucose, Post Prandial", unit: "mg/dL", category: B, decimals: 0, sortOrder: 310 },
  { code: "GLU_R", name: "Glucose, Random", unit: "mg/dL", category: B, decimals: 0, sortOrder: 320 },
  { code: "HBA1C", name: "HbA1c", unit: "%", category: B, decimals: 1, sortOrder: 330 },
  { code: "EAG", name: "Estimated Average Glucose", unit: "mg/dL", category: B, decimals: 0, sortOrder: 340, isDerived: true, formulaKey: "eag_from_hba1c" },
  { code: "UREA", name: "Blood Urea", unit: "mg/dL", category: B, decimals: 1, sortOrder: 400 },
  { code: "BUN", name: "Blood Urea Nitrogen", unit: "mg/dL", category: B, decimals: 1, sortOrder: 410, isDerived: true, formulaKey: "bun_from_urea" },
  { code: "CREAT", name: "Serum Creatinine", unit: "mg/dL", category: B, decimals: 2, sortOrder: 420 },
  { code: "BUN_CREAT", name: "BUN / Creatinine Ratio", unit: "ratio", category: B, decimals: 1, sortOrder: 430, isDerived: true, formulaKey: "bun_creat_ratio" },
  { code: "EGFR", name: "eGFR (CKD-EPI 2021)", unit: "mL/min/1.73m²", category: B, decimals: 0, sortOrder: 440, isDerived: true, formulaKey: "egfr_ckdepi_2021" },
  { code: "UA", name: "Uric Acid", unit: "mg/dL", category: B, decimals: 1, sortOrder: 450 },
  { code: "NA", name: "Sodium", unit: "mEq/L", category: B, decimals: 0, sortOrder: 500 },
  { code: "K", name: "Potassium", unit: "mEq/L", category: B, decimals: 1, sortOrder: 510 },
  { code: "CL", name: "Chloride", unit: "mEq/L", category: B, decimals: 0, sortOrder: 520 },
  { code: "HCO3", name: "Bicarbonate", unit: "mEq/L", category: B, decimals: 0, sortOrder: 530 },
  { code: "ANION_GAP", name: "Anion Gap", unit: "mEq/L", category: B, decimals: 1, sortOrder: 540, isDerived: true, formulaKey: "anion_gap" },
  { code: "OSMO_CALC", name: "Calculated Osmolality", unit: "mOsm/kg", category: B, decimals: 0, sortOrder: 550, isDerived: true, formulaKey: "osmolality_calc" },
  { code: "CA", name: "Calcium, Total", unit: "mg/dL", category: B, decimals: 2, sortOrder: 560 },
  { code: "CA_CORR", name: "Corrected Calcium", unit: "mg/dL", category: B, decimals: 2, sortOrder: 570, isDerived: true, formulaKey: "corrected_calcium" },
  { code: "PHOS", name: "Phosphorus", unit: "mg/dL", category: B, decimals: 1, sortOrder: 580 },
  { code: "TP", name: "Total Protein", unit: "g/dL", category: B, decimals: 2, sortOrder: 600 },
  { code: "ALB", name: "Albumin", unit: "g/dL", category: B, decimals: 2, sortOrder: 610 },
  { code: "GLOB", name: "Globulin", unit: "g/dL", category: B, decimals: 2, sortOrder: 620, isDerived: true, formulaKey: "globulin" },
  { code: "AG_RATIO", name: "A/G Ratio", unit: "ratio", category: B, decimals: 2, sortOrder: 630, isDerived: true, formulaKey: "ag_ratio" },
  { code: "BIL_T", name: "Bilirubin, Total", unit: "mg/dL", category: B, decimals: 2, sortOrder: 640 },
  { code: "BIL_D", name: "Bilirubin, Direct", unit: "mg/dL", category: B, decimals: 2, sortOrder: 650 },
  { code: "BIL_I", name: "Bilirubin, Indirect", unit: "mg/dL", category: B, decimals: 2, sortOrder: 660, isDerived: true, formulaKey: "bili_indirect" },
  { code: "SGOT", name: "SGOT (AST)", unit: "U/L", category: B, decimals: 0, sortOrder: 670 },
  { code: "SGPT", name: "SGPT (ALT)", unit: "U/L", category: B, decimals: 0, sortOrder: 680 },
  { code: "ALP", name: "Alkaline Phosphatase", unit: "U/L", category: B, decimals: 0, sortOrder: 690 },
  { code: "GGT", name: "GGT", unit: "U/L", category: B, decimals: 0, sortOrder: 700 },
  { code: "CHOL", name: "Total Cholesterol", unit: "mg/dL", category: B, decimals: 0, sortOrder: 800 },
  { code: "TG", name: "Triglycerides", unit: "mg/dL", category: B, decimals: 0, sortOrder: 810 },
  { code: "HDL", name: "HDL Cholesterol", unit: "mg/dL", category: B, decimals: 0, sortOrder: 820 },
  { code: "LDL", name: "LDL Cholesterol", unit: "mg/dL", category: B, decimals: 0, sortOrder: 830, isDerived: true, formulaKey: "ldl_friedewald" },
  { code: "VLDL", name: "VLDL Cholesterol", unit: "mg/dL", category: B, decimals: 0, sortOrder: 840, isDerived: true, formulaKey: "vldl" },
  { code: "NONHDL", name: "Non-HDL Cholesterol", unit: "mg/dL", category: B, decimals: 0, sortOrder: 850, isDerived: true, formulaKey: "non_hdl" },
  { code: "CHOL_HDL", name: "Total Cholesterol / HDL Ratio", unit: "ratio", category: B, decimals: 2, sortOrder: 860, isDerived: true, formulaKey: "chol_hdl_ratio" },
  { code: "LDL_HDL", name: "LDL / HDL Ratio", unit: "ratio", category: B, decimals: 2, sortOrder: 870, isDerived: true, formulaKey: "ldl_hdl_ratio" },
  { code: "AMYLASE", name: "Amylase", unit: "U/L", category: B, decimals: 0, sortOrder: 900 },
  { code: "LIPASE", name: "Lipase", unit: "U/L", category: B, decimals: 0, sortOrder: 910 },
  { code: "CK", name: "Creatine Kinase (CK)", unit: "U/L", category: B, decimals: 0, sortOrder: 920 },
  { code: "LDH", name: "LDH", unit: "U/L", category: B, decimals: 0, sortOrder: 930 },

  // ------------------------------------------------- immunoassay
  { code: "TSH", name: "TSH", unit: "µIU/mL", category: I, decimals: 3, sortOrder: 1000 },
  { code: "FT3", name: "Free T3", unit: "pg/mL", category: I, decimals: 2, sortOrder: 1010 },
  { code: "FT4", name: "Free T4", unit: "ng/dL", category: I, decimals: 2, sortOrder: 1020 },
  { code: "T3", name: "Total T3", unit: "ng/dL", category: I, decimals: 0, sortOrder: 1030 },
  { code: "T4", name: "Total T4", unit: "µg/dL", category: I, decimals: 1, sortOrder: 1040 },
  { code: "VITD", name: "Vitamin D (25-OH)", unit: "ng/mL", category: I, decimals: 1, sortOrder: 1050 },
  { code: "VITB12", name: "Vitamin B12", unit: "pg/mL", category: I, decimals: 0, sortOrder: 1060 },
  { code: "FERRITIN", name: "Ferritin", unit: "ng/mL", category: I, decimals: 1, sortOrder: 1070 },
  { code: "PSA", name: "PSA, Total", unit: "ng/mL", category: I, decimals: 2, sortOrder: 1080 },
  { code: "CRP", name: "CRP", unit: "mg/L", category: I, decimals: 1, sortOrder: 1090 },
  { code: "INSULIN", name: "Insulin, Fasting", unit: "µIU/mL", category: I, decimals: 1, sortOrder: 1100 },

  // ------------------------------------------------- coagulation
  { code: "PT", name: "Prothrombin Time", unit: "sec", category: C, decimals: 1, sortOrder: 1200 },
  { code: "INR", name: "INR", unit: "ratio", category: C, decimals: 2, sortOrder: 1210 },
  { code: "APTT", name: "APTT", unit: "sec", category: C, decimals: 1, sortOrder: 1220 },

  // ------------------------------------------------- urine routine
  { code: "UR_COLOUR", name: "Colour", category: U, valueType: "TEXT", sortOrder: 1300 },
  { code: "UR_APPEAR", name: "Appearance", category: U, valueType: "TEXT", sortOrder: 1310 },
  { code: "UR_PH", name: "pH", category: U, decimals: 1, sortOrder: 1320 },
  { code: "UR_SPGR", name: "Specific Gravity", category: U, decimals: 3, sortOrder: 1330 },
  { code: "UR_PROT", name: "Protein (Albumin)", category: U, valueType: "TEXT", sortOrder: 1340 },
  { code: "UR_GLU", name: "Glucose", category: U, valueType: "TEXT", sortOrder: 1350 },
  { code: "UR_KET", name: "Ketones", category: U, valueType: "TEXT", sortOrder: 1360 },
  { code: "UR_BLD", name: "Blood", category: U, valueType: "TEXT", sortOrder: 1370 },
  { code: "UR_NIT", name: "Nitrite", category: U, valueType: "TEXT", sortOrder: 1380 },
  { code: "UR_LEU", name: "Leucocyte Esterase", category: U, valueType: "TEXT", sortOrder: 1390 },
  { code: "UR_PUS", name: "Pus Cells", unit: "/hpf", category: U, decimals: 0, sortOrder: 1400 },
  { code: "UR_RBC", name: "RBCs", unit: "/hpf", category: U, decimals: 0, sortOrder: 1410 },
  { code: "UR_EPI", name: "Epithelial Cells", unit: "/hpf", category: U, decimals: 0, sortOrder: 1420 },
  { code: "UR_CAST", name: "Casts", category: U, valueType: "TEXT", sortOrder: 1430 },
  { code: "UR_CRYST", name: "Crystals", category: U, valueType: "TEXT", sortOrder: 1440 },
];

const ADULT = 6575; // 18 years, in days

export const RANGES: RangeSeed[] = [
  // haematology
  { code: "HB", sex: "M", ageMinDays: ADULT, low: 13, high: 17, criticalLow: 7, criticalHigh: 20 },
  { code: "HB", sex: "F", ageMinDays: ADULT, low: 12, high: 15, criticalLow: 7, criticalHigh: 20 },
  { code: "HB", sex: "A", ageMinDays: 0, ageMaxDays: ADULT - 1, low: 11, high: 16, criticalLow: 7, criticalHigh: 20 },
  { code: "RBC", sex: "M", low: 4.5, high: 5.5 },
  { code: "RBC", sex: "F", low: 3.8, high: 4.8 },
  { code: "HCT", sex: "M", low: 40, high: 50 },
  { code: "HCT", sex: "F", low: 36, high: 46 },
  { code: "MCV", low: 83, high: 101 },
  { code: "MCH", low: 27, high: 32 },
  { code: "MCHC", low: 31.5, high: 34.5 },
  { code: "RDW", low: 11.6, high: 14 },
  { code: "PLT", low: 150, high: 410, criticalLow: 50, criticalHigh: 1000 },
  { code: "MPV", low: 6.5, high: 12 },
  { code: "TLC", low: 4, high: 10, criticalLow: 2, criticalHigh: 30 },
  { code: "NEUT_PCT", low: 40, high: 80 },
  { code: "LYMPH_PCT", low: 20, high: 40 },
  { code: "MONO_PCT", low: 2, high: 10 },
  { code: "EOS_PCT", low: 1, high: 6 },
  { code: "BASO_PCT", low: 0, high: 2 },
  { code: "NEUT_ABS", low: 2, high: 7, criticalLow: 0.5 },
  { code: "LYMPH_ABS", low: 1, high: 3 },
  { code: "MONO_ABS", low: 0.2, high: 1 },
  { code: "EOS_ABS", low: 0.02, high: 0.5 },
  { code: "BASO_ABS", low: 0.02, high: 0.1 },
  { code: "ESR", sex: "M", low: 0, high: 15 },
  { code: "ESR", sex: "F", low: 0, high: 20 },

  // biochemistry
  { code: "GLU_F", low: 70, high: 100, criticalLow: 40, criticalHigh: 450 },
  { code: "GLU_PP", low: 70, high: 140 },
  { code: "GLU_R", low: 70, high: 140, criticalLow: 40, criticalHigh: 450 },
  { code: "HBA1C", low: 4, high: 5.6, note: "5.7–6.4 % prediabetes; ≥ 6.5 % diabetes (ADA)" },
  { code: "UREA", low: 17, high: 43 },
  { code: "BUN", low: 6, high: 20 },
  { code: "CREAT", sex: "M", low: 0.7, high: 1.3, criticalHigh: 5 },
  { code: "CREAT", sex: "F", low: 0.6, high: 1.1, criticalHigh: 5 },
  { code: "BUN_CREAT", low: 10, high: 20 },
  { code: "EGFR", low: 90, note: "≥ 90 normal; 60–89 mildly reduced; < 60 for ≥ 3 months suggests CKD" },
  { code: "UA", sex: "M", low: 3.5, high: 7.2 },
  { code: "UA", sex: "F", low: 2.6, high: 6.0 },
  { code: "NA", low: 136, high: 145, criticalLow: 120, criticalHigh: 160 },
  { code: "K", low: 3.5, high: 5.1, criticalLow: 2.5, criticalHigh: 6.5 },
  { code: "CL", low: 98, high: 107 },
  { code: "HCO3", low: 22, high: 29 },
  { code: "ANION_GAP", low: 8, high: 16 },
  { code: "OSMO_CALC", low: 275, high: 295 },
  { code: "CA", low: 8.6, high: 10.2, criticalLow: 6.5, criticalHigh: 13 },
  { code: "CA_CORR", low: 8.6, high: 10.2 },
  { code: "PHOS", low: 2.5, high: 4.5 },
  { code: "TP", low: 6.4, high: 8.3 },
  { code: "ALB", low: 3.5, high: 5.2 },
  { code: "GLOB", low: 2.0, high: 3.5 },
  { code: "AG_RATIO", low: 1.0, high: 2.1 },
  { code: "BIL_T", low: 0.2, high: 1.2, criticalHigh: 15 },
  { code: "BIL_D", low: 0, high: 0.3 },
  { code: "BIL_I", low: 0.2, high: 0.9 },
  { code: "SGOT", sex: "M", low: 0, high: 40 },
  { code: "SGOT", sex: "F", low: 0, high: 32 },
  { code: "SGPT", sex: "M", low: 0, high: 41 },
  { code: "SGPT", sex: "F", low: 0, high: 33 },
  { code: "ALP", low: 40, high: 129 },
  { code: "GGT", sex: "M", low: 10, high: 71 },
  { code: "GGT", sex: "F", low: 6, high: 42 },
  { code: "CHOL", high: 200, note: "Desirable < 200 mg/dL" },
  { code: "TG", high: 150, note: "Normal < 150 mg/dL" },
  { code: "HDL", sex: "M", low: 40 },
  { code: "HDL", sex: "F", low: 50 },
  { code: "LDL", high: 100, note: "Optimal < 100 mg/dL; target depends on cardiovascular risk" },
  { code: "VLDL", low: 10, high: 30 },
  { code: "NONHDL", high: 130 },
  { code: "CHOL_HDL", high: 4.5 },
  { code: "LDL_HDL", high: 3.5 },
  { code: "AMYLASE", low: 28, high: 100 },
  { code: "LIPASE", low: 13, high: 60 },
  { code: "CK", sex: "M", low: 39, high: 308 },
  { code: "CK", sex: "F", low: 26, high: 192 },
  { code: "LDH", low: 140, high: 280 },

  // immunoassay
  { code: "TSH", low: 0.4, high: 4.0, note: "Trimester-specific ranges apply in pregnancy" },
  { code: "FT3", low: 2.3, high: 4.2 },
  { code: "FT4", low: 0.8, high: 1.8 },
  { code: "T3", low: 80, high: 200 },
  { code: "T4", low: 5.1, high: 14.1 },
  { code: "VITD", low: 30, high: 100, note: "< 20 deficiency; 20–29 insufficiency" },
  { code: "VITB12", low: 211, high: 911 },
  { code: "FERRITIN", sex: "M", low: 22, high: 322 },
  { code: "FERRITIN", sex: "F", low: 10, high: 291 },
  { code: "PSA", high: 4 },
  { code: "CRP", high: 5 },
  { code: "INSULIN", low: 2.6, high: 24.9 },

  // coagulation
  { code: "PT", low: 11, high: 13.5 },
  { code: "INR", low: 0.8, high: 1.2 },
  { code: "APTT", low: 25, high: 35 },

  // urine
  { code: "UR_COLOUR", textRange: "Pale yellow" },
  { code: "UR_APPEAR", textRange: "Clear" },
  { code: "UR_PH", low: 5.0, high: 8.0 },
  { code: "UR_SPGR", low: 1.005, high: 1.03 },
  { code: "UR_PROT", textRange: "Absent" },
  { code: "UR_GLU", textRange: "Absent" },
  { code: "UR_KET", textRange: "Absent" },
  { code: "UR_BLD", textRange: "Absent" },
  { code: "UR_NIT", textRange: "Negative" },
  { code: "UR_LEU", textRange: "Negative" },
  { code: "UR_PUS", low: 0, high: 5 },
  { code: "UR_RBC", low: 0, high: 2 },
  { code: "UR_EPI", low: 0, high: 5 },
  { code: "UR_CAST", textRange: "Absent" },
  { code: "UR_CRYST", textRange: "Absent" },
];

export const PANELS: { code: string; name: string; category: string; items: string[] }[] = [
  { code: "CBC", name: "Complete Blood Count", category: "HEMATOLOGY", items: ["HB", "RBC", "HCT", "MCV", "MCH", "MCHC", "RDW", "PLT", "MPV", "TLC", "NEUT_PCT", "LYMPH_PCT", "MONO_PCT", "EOS_PCT", "BASO_PCT", "NEUT_ABS", "LYMPH_ABS", "MONO_ABS", "EOS_ABS", "BASO_ABS"] },
  { code: "LFT", name: "Liver Function Test", category: "BIOCHEMISTRY", items: ["BIL_T", "BIL_D", "BIL_I", "SGOT", "SGPT", "ALP", "GGT", "TP", "ALB", "GLOB", "AG_RATIO"] },
  { code: "KFT", name: "Kidney Function Test", category: "BIOCHEMISTRY", items: ["UREA", "BUN", "CREAT", "BUN_CREAT", "EGFR", "UA", "NA", "K", "CL", "CA", "PHOS"] },
  { code: "LIPID", name: "Lipid Profile", category: "BIOCHEMISTRY", items: ["CHOL", "TG", "HDL", "LDL", "VLDL", "NONHDL", "CHOL_HDL", "LDL_HDL"] },
  { code: "THYROID", name: "Thyroid Profile", category: "IMMUNOASSAY", items: ["TSH", "FT3", "FT4"] },
  { code: "DIABETES", name: "Diabetic Profile", category: "BIOCHEMISTRY", items: ["GLU_F", "GLU_PP", "HBA1C", "EAG"] },
  { code: "ELECTROLYTES", name: "Serum Electrolytes", category: "BIOCHEMISTRY", items: ["NA", "K", "CL", "HCO3", "ANION_GAP"] },
  { code: "URINE_RE", name: "Urine Routine & Microscopy", category: "URINE", items: ["UR_COLOUR", "UR_APPEAR", "UR_PH", "UR_SPGR", "UR_PROT", "UR_GLU", "UR_KET", "UR_BLD", "UR_NIT", "UR_LEU", "UR_PUS", "UR_RBC", "UR_EPI", "UR_CAST", "UR_CRYST"] },
  { code: "COAG", name: "Coagulation Profile", category: "COAGULATION", items: ["PT", "INR", "APTT"] },
];
