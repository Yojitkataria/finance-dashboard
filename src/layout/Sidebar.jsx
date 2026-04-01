import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', shortLabel: 'DB' },
  { to: '/transactions', label: 'Transactions', shortLabel: 'TX' },
  { to: '/insights', label: 'Insights', shortLabel: 'IN' },
]

function Sidebar() {
  return (
    <aside className="panel flex w-full flex-col gap-5 p-4 sm:p-5 lg:w-72 lg:gap-6">
      <div className="rounded-[26px] border border-cyan-400/20 bg-cyan-400/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/20 text-sm font-semibold text-cyan-200 shadow-lg shadow-cyan-900/10">
          FD
          </div>
          <div>
            <p className="ui-kicker">Finance Hub</p>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-white">Control Center</h1>
          </div>
        </div>
      </div>

      <nav aria-label="Primary navigation" className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-[22px] px-4 py-3.5 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5',
                isActive
                  ? 'bg-white text-slate-950 shadow-lg shadow-cyan-500/10'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={[
                    'flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold',
                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-900/70 text-slate-300',
                  ].join(' ')}
                >
                  {item.shortLabel}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto hidden panel-muted p-4 lg:block">
        <p className="ui-kicker">Monthly Focus</p>
        <p className="mt-3 text-sm font-medium leading-6 text-white">Keep expenses under 65% of income.</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">You are currently trending at 65.1% this month.</p>
      </div>
    </aside>
  )
}

export default Sidebar
