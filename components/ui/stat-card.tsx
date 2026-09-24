export function StatCard({ label, value, detail }: { label: string; value: React.ReactNode; detail?: string }) {
  return <div className="panel"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>{detail && <p className="mt-2 text-xs text-muted-foreground">{detail}</p>}</div>;
}
