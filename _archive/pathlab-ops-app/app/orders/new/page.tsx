import { prisma } from "@/lib/db";
import { createOrder } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function NewOrder() {
  const panels = await prisma.panel.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <form action={createOrder} className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">New order</h1>
        <p className="text-sm text-slate-500">
          The sample barcode is what links a machine file back to this patient — it must match
          exactly what the analyzer sends.
        </p>
      </div>

      <div className="card space-y-4 p-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Patient name</label>
            <input name="name" className="input" required />
          </div>
          <div>
            <label className="label">Sex</label>
            <select name="sex" className="input" defaultValue="M">
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div>
            <label className="label">Age (years)</label>
            <input name="ageYears" type="number" min="0" max="120" className="input" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input name="phone" className="input" />
          </div>
          <div>
            <label className="label">Referring doctor</label>
            <input name="doctorName" className="input" />
          </div>
          <div className="col-span-2">
            <label className="label">Sample barcodes (comma separated)</label>
            <input name="barcodes" className="input font-mono" placeholder="S1010, S1011" required />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <p className="label">Panels</p>
        <div className="grid grid-cols-3 gap-2">
          {panels.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="panels" value={p.code} />
              {p.name}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary">Create order</button>
    </form>
  );
}
