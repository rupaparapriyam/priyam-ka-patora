"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, audit } from "@/lib/db";
import { applyImport, recomputeOrder } from "@/lib/pipeline";

export async function createOrder(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const sex = String(formData.get("sex") ?? "O");
  const ageYears = Number(formData.get("ageYears") ?? 0) || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const doctorName = String(formData.get("doctorName") ?? "").trim();
  const panelCodes = formData.getAll("panels").map(String);
  const barcodes = String(formData.get("barcodes") ?? "")
    .split(/[,\s]+/).map((b) => b.trim()).filter(Boolean);

  if (!name) throw new Error("Patient name is required");
  if (barcodes.length === 0) throw new Error("At least one sample barcode is required");

  const count = await prisma.patient.count();
  const orderCount = await prisma.order.count();

  const patient = await prisma.patient.create({
    data: {
      mrn: `VL-${String(count + 1).padStart(6, "0")}`,
      name, sex, ageYears, phone,
    },
  });

  const doctor = doctorName
    ? await prisma.referringDoctor.create({ data: { name: doctorName } })
    : null;

  const order = await prisma.order.create({
    data: {
      orderNo: `ORD-${String(orderCount + 1).padStart(4, "0")}`,
      patientId: patient.id,
      doctorId: doctor?.id,
      status: "COLLECTED",
      collectedAt: new Date(),
    },
  });

  for (const barcode of barcodes) {
    await prisma.sample.create({
      data: { orderId: order.id, barcode, type: "SERUM", collectedAt: new Date(), receivedAt: new Date() },
    });
  }

  for (const code of panelCodes) {
    const panel = await prisma.panel.findUnique({ where: { code } });
    if (panel) await prisma.orderPanel.create({ data: { orderId: order.id, panelId: panel.id } });
  }

  await audit({ action: "CREATE", entity: "Order", entityId: order.id, detail: `${order.orderNo} for ${name}` });
  redirect(`/orders/${order.id}`);
}

export async function saveResults(orderId: string, formData: FormData) {
  const analytes = await prisma.analyte.findMany();
  const byId = new Map(analytes.map((a) => [a.id, a]));

  for (const [key, raw] of formData.entries()) {
    if (!key.startsWith("v_")) continue;
    const analyteId = key.slice(2);
    const analyte = byId.get(analyteId);
    if (!analyte) continue;

    const value = String(raw).trim();
    const existing = await prisma.result.findUnique({
      where: { orderId_analyteId: { orderId, analyteId } },
    });

    if (value === "") {
      // clearing a field removes the result so downstream calculations rebuild
      if (existing && existing.source !== "DERIVED") {
        await prisma.result.delete({ where: { id: existing.id } });
      }
      continue;
    }
    if (existing?.source === "DERIVED") continue; // calculated fields are read-only

    const numeric = Number.parseFloat(value);
    const isNumeric = analyte.valueType === "NUMERIC" && Number.isFinite(numeric);
    if (analyte.valueType === "NUMERIC" && !isNumeric) continue;

    await prisma.result.upsert({
      where: { orderId_analyteId: { orderId, analyteId } },
      create: {
        orderId, analyteId,
        rawValue: existing?.rawValue ?? value,
        value: isNumeric ? numeric : null,
        textValue: isNumeric ? null : value,
        unit: analyte.unit, source: existing?.source ?? "MANUAL", status: "ENTERED",
      },
      update: {
        value: isNumeric ? numeric : null,
        textValue: isNumeric ? null : value,
        status: existing?.status === "VERIFIED" ? "AMENDED" : "ENTERED",
      },
    });
  }

  await recomputeOrder(orderId);
  revalidatePath(`/orders/${orderId}`);
}

export async function verifyOrder(orderId: string) {
  const summary = await recomputeOrder(orderId);
  await prisma.result.updateMany({
    where: { orderId },
    data: { status: "VERIFIED", verifiedAt: new Date() },
  });
  const last = await prisma.report.findFirst({
    where: { orderId }, orderBy: { version: "desc" },
  });
  await prisma.report.create({
    data: { orderId, version: (last?.version ?? 0) + 1, status: "FINAL" },
  });
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "REPORTED", reportedAt: new Date() },
  });
  await audit({
    action: "VERIFY", entity: "Order", entityId: orderId,
    detail: `${summary.flagged.length} flagged, ${summary.critical.length} critical`,
  });
  redirect(`/report/${orderId}`);
}

export async function runImport(formData: FormData) {
  const analyzerId = String(formData.get("analyzerId") ?? "");
  const file = formData.get("file") as File | null;
  const pasted = String(formData.get("pasted") ?? "").trim();

  let content = pasted;
  let filename: string | undefined;
  if (file && file.size > 0) {
    content = await file.text();
    filename = file.name;
  }
  if (!analyzerId || !content) throw new Error("Pick an analyzer and provide a file or paste its contents.");

  const summary = await applyImport({ analyzerId, content, filename });
  revalidatePath("/import");
  redirect(`/import?batch=${summary.batchId}`);
}
