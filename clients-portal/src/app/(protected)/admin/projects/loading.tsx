export default function AdminProjectsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-56 bg-white/5 rounded-xl" />
      <div className="grid gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-white/[0.03] border border-white/8" />
        ))}
      </div>
    </div>
  );
}
