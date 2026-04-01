import { memo } from 'react'

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="panel panel-interactive p-5 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h3>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}

export default memo(SectionCard)
