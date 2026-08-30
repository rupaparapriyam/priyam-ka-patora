import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/ui";
import { formatAge } from "@/lib/age";

export const dynamic = "force-dynamic";

export default async function Worklist() {
  const orders = await prisma.order.findMany({
    orderBy: { registeredAt: "desc" },
    take: 50,
    include: {
      patient: true,
      samples: true,
      results: { select: { flag: true, status: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Worklist</h1>
          <p className="text-sm text-slate-500">Orders awaiting results, verification, or reporting.</p>
        </div>
        <Link href="/orders/new" className="btn-primary no-print">New order</Link>
      </div>

      {orders.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500">
          No orders yet. Run <code className="rounded bg-slate-100 px-1">npm run db:seed</code> for demo data,
          or create an order.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5">Order</th>
                <th className="px-4 py-2.5">Patient</th>
                <th className="px-4 py-2.5">Samples</th>
                <th className="px-4 py-2.5">Results</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => {
                const critical = o.results.filter((r) => r.flag === "HH" || r.flag === "LL").length;
                const abnormal = o.results.filter((r) => r.flag !== "N").length;
                return (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{o.orderNo}</td>
                    <td className="px-4 py-3">
                      {o.patient.name}
                      <span className="ml-2 text-xs text-slate-500">
                        {o.patient.sex} / {formatAge(o.patient)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      {o.samples.map((s) => s.barcode).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {o.results.length}
                      {abnormal > 0 && (
                        <span className="ml-2 text-xs text-amber-700">{abnormal} abnormal</span>
                      )}
                      {critical > 0 && (
                        <span className="ml-2 badge bg-red-600 text-white">{critical} critical</span>
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/orders/${o.id}`} className="text-slate-600 underline hover:text-slate-900">
                        open
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
