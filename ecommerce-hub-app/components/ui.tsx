export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      {children}
    </div>
  );
}
