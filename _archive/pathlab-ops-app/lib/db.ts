import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function audit(entry: {
  actor?: string;
  action: string;
  entity: string;
  entityId?: string;
  detail?: string;
}) {
  await prisma.auditLog.create({
    data: {
      actor: entry.actor ?? "system",
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      detail: entry.detail,
    },
  });
}
