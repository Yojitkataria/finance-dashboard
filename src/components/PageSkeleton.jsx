import SkeletonBlock from './SkeletonBlock.jsx'

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="panel p-5 sm:p-6">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="mt-4 h-10 w-40" />
            <SkeletonBlock className="mt-5 h-4 w-48" />
          </div>
        ))}
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        {[1, 2].map((item) => (
          <div key={item} className="panel p-5 sm:p-6">
            <SkeletonBlock className="h-5 w-44" />
            <SkeletonBlock className="mt-2 h-4 w-72" />
            <SkeletonBlock className="mt-6 h-72 w-full rounded-[24px]" />
          </div>
        ))}
      </section>
    </div>
  )
}

function TransactionsSkeleton() {
  return (
    <div className="panel p-5 sm:p-6">
      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        {[1, 2, 3, 4].map((item) => (
          <div key={item}>
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="mt-2 h-12 w-full" />
          </div>
        ))}
      </div>
      <SkeletonBlock className="mt-6 h-5 w-48" />
      <SkeletonBlock className="mt-6 h-72 w-full" />
    </div>
  )
}

function InsightsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="panel p-5 sm:p-6">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="mt-4 h-10 w-36" />
            <SkeletonBlock className="mt-4 h-6 w-24" />
          </div>
        ))}
      </section>
      <div className="panel p-5 sm:p-6">
        <SkeletonBlock className="h-5 w-52" />
        <SkeletonBlock className="mt-2 h-4 w-72" />
        <SkeletonBlock className="mt-6 h-96 w-full rounded-[24px]" />
      </div>
    </div>
  )
}

function PageSkeleton({ variant = 'dashboard' }) {
  if (variant === 'transactions') {
    return <TransactionsSkeleton />
  }

  if (variant === 'insights') {
    return <InsightsSkeleton />
  }

  return <DashboardSkeleton />
}

export default PageSkeleton
