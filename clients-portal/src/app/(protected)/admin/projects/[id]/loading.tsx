export default function AdminProjectDetailLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 bg-white/5 rounded-xl" />
        <div className="h-8 w-64 bg-white/5 rounded-xl" />
        <div className="ml-auto h-9 w-32 bg-indigo-500/20 rounded-xl" />
      </div>
      {/* Cover + meta */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-52 rounded-2xl bg-white/[0.03] border border-white/8" />
          <div className="h-64 rounded-2xl bg-white/[0.03] border border-white/8" />
        </div>
        <div className="space-y-4">
          <div className="h-40 rounded-2xl bg-white/[0.03] border border-white/8" />
          <div className="h-52 rounded-2xl bg-white/[0.03] border border-white/8" />
        </div>
      </div>
      {/* Events */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/[0.03] border border-white/8" />
        ))}
      </div>
    </div>
  );
}
