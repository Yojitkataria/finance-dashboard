import { memo } from 'react'

function StatCard({ label, value, change, tone = 'neutral', icon }) {
  const toneStyles = {
    positive: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
    negative: 'border-rose-400/20 bg-rose-400/10 text-rose-200',
    neutral: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
  }

  return (
    <article className="panel panel-interactive relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="ui-kicker">{label}</p>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{value}</p>
          <p className="mt-3 text-sm text-slate-400">Updated from your latest finance activity.</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 shadow-lg shadow-slate-950/10">
            {icon}
          </span>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${toneStyles[tone]}`}>
            {change}
          </span>
        </div>
      </div>
    </article>
  )
}

export default memo(StatCard)
