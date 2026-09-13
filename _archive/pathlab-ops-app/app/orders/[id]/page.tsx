import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { saveResults, verifyOrder } from "@/app/actions";
import { FlagBadge, StatusPill, fmt } from "@/components/ui";
import { formatAge, ageInDays, ageInYears, type Sex } from "@/lib/age";
import { deriveResults } from "@/lib/calc/engine";
import { pickRange, formatRange, type RangeLike } from "@/lib/calc/flags";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
      samples: true,
      panels: { include: { panel: { include: { items: { include: { analyte: { include: { ranges: true } } }, orderBy: { sortOrder: "asc" } } } } } },
      results: { include: { analyte: { include: { ranges: true } } } },
    },
  });
  if (!order) notFound();

  const sex = (order.patient.sex as Sex) ?? "O";
  const ageDays = ageInDays(order.patient);
  const resultByAnalyteId = new Map(order.results.map((r) => [r.analyteId, r]));

  // Which analytes to show: everything on the ordered panels, plus anything that
  // already has a result (e.g. the machine sent a test nobody ordered).
  const shown = new Map<string, (typeof order.results)[number]["analyte"]>();
  for (const op of order.panels) for (const item of op.panel.items) shown.set(item.analyte.id, item.analyte);
  for (const r of order.results) shown.set(r.analyte.id, r.analyte);

  const groups = new Map<string, typeof order.panels[number]["panel"]["items"][number]["analyte"][]>();
  for (const a of shown.values()) {
    const list = groups.get(a.category) ?? [];
    list.push(a);
    groups.set(a.category, list);
  }
  for (const list of groups.values()) list.sort((x, y) => x.sortOrder - y.sortOrder);

  // Recompute in-memory purely to explain what could NOT be calculated and why.
  const measured: Record<string, number> = {};
  for (const r of order.results) {
    if (r.source !== "DERIVED" && r.value != null) measured[r.analyte.code] = r.value;
  }
  const { suppressed } = deriveResults(measured, { sex, ageYears: ageInYears(order.patient) });

  const critical = order.results.filter((r) => r.flag === "HH" || r.flag === "LL");
  const save = saveResults.bind(null, order.id);
  const verify = verifyOrder.bind(null, order.id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">{order.orderNo}</h1>
            <StatusPill status={order.status} />
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {order.patient.name} · {order.patient.sex} / {formatAge(order.patient)} · {order.patient.mrn}
            {order.doctor && <> · Ref: {order.doctor.name}</>}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-500">
            {order.samples.map((s) => s.barcode).join("  ·  ")}
          </p>
        </div>
        <div className="no-print flex gap-2">
          <Link href={`/report/${order.id}`} className="btn-ghost">Preview report</Link>
          <form action={verify}><button className="btn-primary">Verify &amp; report</button></form>
        </div>
      </div>

      {critical.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">
            {critical.length} critical value{critical.length > 1 ? "s" : ""} — call the referring doctor
          </p>
          <ul className="mt-1 text-sm text-red-700">
            {critical.map((r) => (
              <li key={r.id}>
                {r.analyte.name}: <strong>{fmt(r.value, r.analyte.decimals)} {r.unit}</strong> ({r.flag === "HH" ? "critical high" : "critical low"})
              </li>
            ))}
          </ul>
        </div>
      )}

      {suppressed.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Calculations withheld</p>
          <ul className="mt-1 space-y-0.5 text-sm text-amber-800">
            {suppressed.map((s) => (<li key={s.code}><strong>{s.code}</strong> — {s.reason}</li>))}
          </ul>
        </div>
      )}

      <form action={save} className="space-y-6">
        {[...groups.entries()].map(([category, analytes]) => (
          <div key={category} className="card overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              {category}
            </div>
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-2 font-medium">Test</th>
                  <th className="w-40 px-4 py-2 font-medium">Result</th>
                  <th className="w-24 px-4 py-2 font-medium">Unit</th>
                  <th className="w-40 px-4 py-2 font-medium">Reference</th>
                  <th className="w-32 px-4 py-2 font-medium">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytes.map((a) => {
                  const r = resultByAnalyteId.get(a.id);
                  const range = pickRange(a.ranges as unknown as RangeLike[], sex, ageDays);
                  const isDerived = r?.source === "DERIVED";
                  const shownValue = r
                    ? a.valueType === "TEXT"
                      ? (r.textValue ?? "")
                      : fmt(r.value, a.decimals)
                    : "";
                  return (
                    <tr key={a.id} className={isDerived ? "bg-slate-50/60" : ""}>
                      <td className="px-4 py-2">
                        {a.name}
                        {isDerived && (
                          <span className="ml-2 badge bg-slate-200 text-slate-600">calculated</span>
                        )}
                        {isDerived && r?.comment && (
                          <div className="text-[11px] text-slate-500">{r.comment}</div>
                        )}
                        {r?.rawValue && r.source === "IMPORT" && r.rawValue !== shownValue && (
                          <div className="text-[11px] text-slate-400">machine sent: {r.rawValue}</div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {isDerived ? (
                          <span className="font-medium">{shownValue}</span>
                        ) : (
                          <input
                            name={`v_${a.id}`}
                            defaultValue={shownValue}
                            className="input font-medium"
                            inputMode={a.valueType === "TEXT" ? "text" : "decimal"}
                            autoComplete="off"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 text-slate-500">{r?.unit ?? a.unit ?? ""}</td>
                      <td className="px-4 py-2 text-slate-500">{formatRange(range)}</td>
                      <td className="px-4 py-2"><FlagBadge flag={r?.flag ?? "N"} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        <div className="no-print flex items-center gap-3">
          <button type="submit" className="btn-primary">Save &amp; recalculate</button>
          <p className="text-xs text-slate-500">
            Clearing a field deletes that result and removes anything calculated from it.
          </p>
        </div>
      </form>
    </div>
  );
}
