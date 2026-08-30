import Link from "next/link";
import { prisma } from "@/lib/db";
import { runImport } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function ImportPage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>;
}) {
  const { batch: batchId } = await searchParams;
  const analyzers = await prisma.analyzer.findMany({
    where: { active: true },
    orderBy: { code: "asc" },
    include: { _count: { select: { mappings: true } } },
  });
  const batch = batchId
    ? await prisma.importBatch.findUnique({
        where: { id: batchId },
        include: { analyzer: true, results: { include: { order: true, analyte: true } } },
      })
    : null;

  const recent = await prisma.importBatch.findMany({
    orderBy: { createdAt: "desc" }, take: 8, include: { analyzer: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Import results</h1>
        <p className="text-sm text-slate-500">
          Upload the file the analyzer&apos;s PC software exports, or paste an ASTM capture.
          Rows are matched to orders by <strong>sample barcode</strong>, and machine test codes are
          translated using that analyzer&apos;s mapping table.
        </p>
      </div>

      {batch && (
        <div className={`rounded-lg border p-4 ${batch.status === "APPLIED" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
          <p className="text-sm font-semibold">
            {batch.analyzer.name}: {batch.matchedCount} of {batch.rowCount} rows applied
            {batch.filename ? ` from ${batch.filename}` : ""}
          </p>
          {batch.notes && <p className="mt-1 text-sm text-slate-700">{batch.notes}</p>}
          {batch.results.length > 0 && (
            <p className="mt-2 text-sm">
              Orders updated:{" "}
              {[...new Map(batch.results.map((r) => [r.order.id, r.order])).values()].map((o) => (
                <Link key={o.id} href={`/orders/${o.id}`} className="mr-2 underline">{o.orderNo}</Link>
              ))}
            </p>
          )}
        </div>
      )}

      <form action={runImport} className="card space-y-4 p-5">
        <div>
          <label className="label">Analyzer</label>
          <select name="analyzerId" className="input" required>
            <option value="">Select…</option>
            {analyzers.map((a) => (
              <option key={a.id} value={a.id}>
                {a.code} — {a.name} ({a._count.mappings} codes mapped, parser: {a.parserKey})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">File</label>
          <input type="file" name="file" accept=".csv,.txt,.tsv,.dat" className="input" />
        </div>
        <div>
          <label className="label">…or paste the contents</label>
          <textarea name="pasted" rows={8} className="input font-mono text-xs"
            placeholder="SampleID,TestCode,Value,Unit&#10;S1001,HGB,14.2,g/dL" />
        </div>
        <button className="btn-primary">Parse &amp; apply</button>
      </form>

      {recent.length > 0 && (
        <div className="card overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Recent imports
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {recent.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-2 text-slate-500">{b.createdAt.toLocaleString()}</td>
                  <td className="px-4 py-2">{b.analyzer.name}</td>
                  <td className="px-4 py-2 text-slate-500">{b.filename ?? "pasted"}</td>
                  <td className="px-4 py-2">{b.matchedCount}/{b.rowCount} applied</td>
                  <td className="px-4 py-2">
                    <Link href={`/import?batch=${b.id}`} className="underline text-slate-600">details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
