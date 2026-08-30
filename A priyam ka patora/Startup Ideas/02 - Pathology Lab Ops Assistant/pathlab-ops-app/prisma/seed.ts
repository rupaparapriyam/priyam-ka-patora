import { PrismaClient } from "@prisma/client";
import { ANALYTES, RANGES, PANELS } from "../lib/catalog/analytes";

const prisma = new PrismaClient();

/** machineCode -> our analyte code, per analyzer */
const HEMATOLOGY_MAP: Record<string, string> = {
  WBC: "TLC", RBC: "RBC", HGB: "HB", HCT: "HCT", MCV: "MCV", MCH: "MCH",
  MCHC: "MCHC", "RDW-CV": "RDW", RDW: "RDW", PLT: "PLT", MPV: "MPV",
  "NEU%": "NEUT_PCT", "LYM%": "LYMPH_PCT", "MON%": "MONO_PCT",
  "EOS%": "EOS_PCT", "BAS%": "BASO_PCT",
  "NEU#": "NEUT_ABS", "LYM#": "LYMPH_ABS", "MON#": "MONO_ABS",
  "EOS#": "EOS_ABS", "BAS#": "BASO_ABS",
};

const BIOCHEM_MAP: Record<string, string> = {
  GLU: "GLU_F", GLUF: "GLU_F", GLUPP: "GLU_PP", UREA: "UREA", BUN: "BUN",
  CREA: "CREAT", CREAT: "CREAT", UA: "UA", TP: "TP", ALB: "ALB",
  TBIL: "BIL_T", DBIL: "BIL_D", AST: "SGOT", SGOT: "SGOT", ALT: "SGPT",
  SGPT: "SGPT", ALP: "ALP", GGT: "GGT", CHOL: "CHOL", TC: "CHOL",
  TRIG: "TG", TG: "TG", "HDL-C": "HDL", HDL: "HDL", "LDL-C": "LDL",
  CA: "CA", PHOS: "PHOS", IP: "PHOS", NA: "NA", K: "K", CL: "CL",
  HCO3: "HCO3", AMY: "AMYLASE", LIP: "LIPASE", CK: "CK", LDH: "LDH",
  HBA1C: "HBA1C",
};

const IMMUNO_MAP: Record<string, string> = {
  TSH: "TSH", FT3: "FT3", FT4: "FT4", T3: "T3", T4: "T4",
  "25OHD": "VITD", VITD: "VITD", B12: "VITB12", FER: "FERRITIN",
  PSA: "PSA", CRP: "CRP", INS: "INSULIN",
};

async function main() {
  console.log("Seeding catalog…");

  for (const a of ANALYTES) {
    await prisma.analyte.upsert({
      where: { code: a.code },
      create: {
        code: a.code, name: a.name, unit: a.unit, category: a.category,
        valueType: a.valueType ?? "NUMERIC", decimals: a.decimals ?? 1,
        isDerived: a.isDerived ?? false, formulaKey: a.formulaKey,
        sortOrder: a.sortOrder ?? 100, method: a.method,
      },
      update: {
        name: a.name, unit: a.unit, category: a.category,
        valueType: a.valueType ?? "NUMERIC", decimals: a.decimals ?? 1,
        isDerived: a.isDerived ?? false, formulaKey: a.formulaKey,
        sortOrder: a.sortOrder ?? 100,
      },
    });
  }
  console.log(`  ${ANALYTES.length} analytes`);

  // Ranges are replaced wholesale on each seed so edits live in one place.
  await prisma.referenceRange.deleteMany({});
  for (const r of RANGES) {
    const analyte = await prisma.analyte.findUnique({ where: { code: r.code } });
    if (!analyte) continue;
    await prisma.referenceRange.create({
      data: {
        analyteId: analyte.id,
        sex: r.sex ?? "A",
        ageMinDays: r.ageMinDays ?? 0,
        ageMaxDays: r.ageMaxDays ?? 43800,
        low: r.low ?? null, high: r.high ?? null,
        criticalLow: r.criticalLow ?? null, criticalHigh: r.criticalHigh ?? null,
        textRange: r.textRange ?? null, note: r.note ?? null,
      },
    });
  }
  console.log(`  ${RANGES.length} reference ranges`);

  for (const p of PANELS) {
    const panel = await prisma.panel.upsert({
      where: { code: p.code },
      create: { code: p.code, name: p.name, category: p.category },
      update: { name: p.name, category: p.category },
    });
    await prisma.panelItem.deleteMany({ where: { panelId: panel.id } });
    let i = 0;
    for (const code of p.items) {
      const analyte = await prisma.analyte.findUnique({ where: { code } });
      if (!analyte) continue;
      await prisma.panelItem.create({
        data: { panelId: panel.id, analyteId: analyte.id, sortOrder: i++ },
      });
    }
  }
  console.log(`  ${PANELS.length} panels`);

  // ------------------------------------------------------------- analyzers
  const analyzers = [
    { code: "HEM-01", name: "Haematology Analyzer", manufacturer: "—", model: "5-part cell counter", category: "HEMATOLOGY", map: HEMATOLOGY_MAP },
    { code: "BIO-01", name: "Biochemistry Analyzer", manufacturer: "—", model: "Auto chemistry", category: "BIOCHEMISTRY", map: BIOCHEM_MAP },
    { code: "IMM-01", name: "Immunoassay Analyzer", manufacturer: "—", model: "CLIA", category: "IMMUNOASSAY", map: IMMUNO_MAP },
  ];

  for (const a of analyzers) {
    const analyzer = await prisma.analyzer.upsert({
      where: { code: a.code },
      create: {
        code: a.code, name: a.name, manufacturer: a.manufacturer, model: a.model,
        category: a.category, connection: "FILE", parserKey: "generic-csv",
        configJson: JSON.stringify({ layout: "long" }),
      },
      update: { name: a.name, category: a.category },
    });
    for (const [machineCode, analyteCode] of Object.entries(a.map)) {
      const analyte = await prisma.analyte.findUnique({ where: { code: analyteCode } });
      if (!analyte) continue;
      await prisma.analyzerMapping.upsert({
        where: { analyzerId_machineCode: { analyzerId: analyzer.id, machineCode } },
        create: { analyzerId: analyzer.id, machineCode, analyteId: analyte.id },
        update: { analyteId: analyte.id },
      });
    }
    console.log(`  analyzer ${a.code}: ${Object.keys(a.map).length} code mappings`);
  }

  // ------------------------------------------------------------- demo order
  const existing = await prisma.order.findUnique({ where: { orderNo: "ORD-0001" } });
  if (!existing) {
    const doctor = await prisma.referringDoctor.create({
      data: { name: "Dr. A. Mehta", qualification: "MBBS, MD", clinic: "Rajkot" },
    });
    const patient = await prisma.patient.create({
      data: { mrn: "VL-000001", name: "Demo Patient", sex: "M", ageYears: 45, phone: "" },
    });
    const order = await prisma.order.create({
      data: {
        orderNo: "ORD-0001", patientId: patient.id, doctorId: doctor.id,
        status: "COLLECTED", collectedAt: new Date(),
      },
    });
    for (const [barcode, type] of [["S1001", "EDTA_WHOLE_BLOOD"], ["S1002", "SERUM"]] as const) {
      await prisma.sample.create({
        data: { orderId: order.id, barcode, type, collectedAt: new Date(), receivedAt: new Date() },
      });
    }
    for (const code of ["CBC", "LFT", "KFT", "LIPID"]) {
      const panel = await prisma.panel.findUnique({ where: { code } });
      if (panel) await prisma.orderPanel.create({ data: { orderId: order.id, panelId: panel.id } });
    }
    console.log("  demo order ORD-0001 with samples S1001 (EDTA) and S1002 (serum)");
  }

  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
