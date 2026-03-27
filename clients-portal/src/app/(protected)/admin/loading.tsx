export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-48 bg-white/5 rounded-xl mb-2" />
          <div className="h-4 w-64 bg-white/3 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-white/5 rounded-xl" />
          <div className="h-10 w-36 bg-indigo-500/20 rounded-xl" />
        </div>
      </div>
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/[0.03] border border-white/8" />
        ))}
      </div>
      {/* Content area skeleton */}
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-3">
          <div className="h-6 w-40 bg-white/5 rounded-lg mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/[0.03] border border-white/8" />
          ))}
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="h-36 rounded-2xl bg-white/[0.03] border border-white/8" />
          <div className="h-64 rounded-2xl bg-white/[0.03] border border-white/8" />
        </div>
      </div>
    </div>
  );
}
