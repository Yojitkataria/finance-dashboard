import { memo } from 'react'

function EmptyState({ title, description, action, icon = '0', className = '' }) {
  return (
    <div
      className={`panel-muted panel-interactive flex min-h-56 flex-col items-center justify-center p-6 text-center sm:p-8 ${className}`.trim()}
      role="status"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-white/5 text-lg font-semibold text-slate-200 shadow-lg shadow-slate-950/10">
        {icon}
      </div>
      <h4 className="mt-5 text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h4>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export default memo(EmptyState)
