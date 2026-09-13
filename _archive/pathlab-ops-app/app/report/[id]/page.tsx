import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatAge, ageInDays, type Sex } from "@/lib/age";
import { pickRange, formatRange, type RangeLike } from "@/lib/calc/flags";
import { fmt } from "@/components/ui";

export const dynamic = "force-dynamic";

const FLAG_MARK: Record<string, string> = { H: "H", L: "L", HH: "H*", LL: "L*", A: "A", N: "" };

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
      samples: true,
      results: { include: { analyte: { include: { ranges: true } } } },
      reports: { orderBy: { version: "desc" }, take: 1 },
    },
  });
  if (!order) notFound();

  const sex = (order.patient.sex as Sex) ?? "O";
  const ageDays = ageInDays(order.patient);
  const report = order.reports[0];

  const withValues = order.results.filter((r) => r.value != null || r.textValue);
  const groups = new Map<string, typeof withValues>();
  for (const r of withValues) {
    const list = groups.get(r.analyte.category) ?? [];
    list.push(r);
    groups.set(r.analyte.category, list);
  }
  for (const list of groups.values()) list.sort((a, b) => a.analyte.sortOrder - b.analyte.sortOrder);

  const critical = withValues.filter((r) => r.flag === "HH" || r.flag === "LL");

  return (
    <div className="space-y-6">
      <p className="no-print text-right text-xs text-slate-500">
        Print with ⌘P — the page is laid out for A4 and hides the app chrome.
      </p>

      <div className="card p-8">
        <div className="flex items-start justify-between border-b border-slate-300 pb-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight">LABORATORY REPORT</h1>
            <p className="text-xs text-slate-500">
              {report ? `Report v${report.version} · ${report.status}` : "Draft — not yet verified"}
            </p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <p className="font-semibold">{order.orderNo}</p>
            <p>Reported: {(order.reportedAt ?? new Date()).toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-1 border-b border-slate-200 py-4 text-sm">
          <p><span className="text-slate-500">Patient:</span> <strong>{order.patient.name}</strong></p>
          <p><span className="text-slate-500">Lab ID:</span> {order.patient.mrn}</p>
          <p><span className="text-slate-500">Age / Sex:</span> {formatAge(order.patient)} / {order.patient.sex}</p>
          <p><span className="text-slate-500">Referred by:</span> {order.doctor?.name ?? "Self"}</p>
          <p><span className="text-slate-500">Sample(s):</span> <span className="font-mono">{order.samples.map((s) => s.barcode).join(", ")}</span></p>
          <p><span className="text-slate-500">Collected:</span> {order.collectedAt?.toLocaleString() ?? "—"}</p>
        </div>

        {critical.length > 0 && (
          <div className="mt-4 border border-red-400 p-3 text-sm">
            <strong className="text-red-700">CRITICAL VALUES</strong>{" "}
            {critical.map((r) => `${r.analyte.name} ${fmt(r.value, r.analyte.decimals)} ${r.unit ?? ""}`).join("; ")}
            <span className="text-slate-600"> — communicated to the referring physician.</span>
          </div>
        )}

        {[...groups.entries()].map(([category, results]) => (
          <div key={category} className="mt-6">
            <h2 className="mb-1 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-widest">
              {category}
            </h2>
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-1.5 font-medium">Investigation</th>
                  <th className="w-28 py-1.5 font-medium">Result</th>
                  <th className="w-10 py-1.5"></th>
                  <th className="w-24 py-1.5 font-medium">Unit</th>
                  <th className="w-36 py-1.5 font-medium">Biological Ref. Interval</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const range = pickRange(r.analyte.ranges as unknown as RangeLike[], sex, ageDays);
                  const abnormal = r.flag !== "N";
                  return (
                    <tr key={r.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-1.5">
                        {r.analyte.name}
                        {r.source === "DERIVED" && <span className="ml-1 text-[10px] text-slate-400">(calculated)</span>}
                      </td>
                      <td className={`py-1.5 ${abnormal ? "font-bold" : ""}`}>
                        {r.analyte.valueType === "TEXT" ? r.textValue : fmt(r.value, r.analyte.decimals)}
                      </td>
                      <td className={`py-1.5 font-bold ${abnormal ? "text-red-600" : ""}`}>
                        {FLAG_MARK[r.flag] ?? ""}
                      </td>
                      <td className="py-1.5 text-slate-600">{r.unit ?? r.analyte.unit ?? ""}</td>
                      <td className="py-1.5 text-slate-600">{formatRange(range)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {results.some((r) => pickRange(r.analyte.ranges as unknown as RangeLike[], sex, ageDays)?.note) && (
              <ul className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                {results
                  .map((r) => ({ r, note: pickRange(r.analyte.ranges as unknown as RangeLike[], sex, ageDays)?.note }))
                  .filter((x) => x.note)
                  .map((x) => (<li key={x.r.id}>{x.r.analyte.name}: {x.note}</li>))}
              </ul>
            )}
          </div>
        ))}

        <div className="mt-10 flex items-end justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
          <p className="max-w-md">
            Results relate only to the sample(s) tested. Calculated parameters are marked and are derived
            from the measured values on this report. Reference intervals are the laboratory&apos;s own and
            should be interpreted with the clinical picture.
          </p>
          <div className="text-center">
            <div className="mb-1 h-10 w-40 border-b border-slate-400" />
            <p>Consultant Pathologist</p>
          </div>
        </div>
      </div>
    </div>
  );
}
