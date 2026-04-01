import { useLocation } from 'react-router-dom'
import { useFinance } from '../context/useFinance.js'

const pageMeta = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Track cash flow, savings, and portfolio health from one place.',
  },
  '/transactions': {
    title: 'Transactions',
    subtitle: 'Review recent account activity and keep spending categories in check.',
  },
  '/insights': {
    title: 'Insights',
    subtitle: 'Turn this month’s activity into actionable financial next steps.',
  },
}

function TopNavbar() {
  const location = useLocation()
  const { user, role, setRole, theme, toggleTheme } = useFinance()
  const safeRole = role || 'viewer'

  const currentPage = pageMeta[location.pathname] ?? pageMeta['/dashboard']
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <header className="panel relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-cyan-400/10 via-transparent to-violet-400/10" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="ui-kicker text-cyan-300">Welcome back, {user.name}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{currentPage.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{currentPage.subtitle}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/10">
            <span className="ui-kicker">Today</span>
            <span className="mt-2 block font-medium text-white">{currentDate}</span>
          </div>
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm transition-all duration-300 ease-out hover:-translate-y-0.5">
            <span className="ui-kicker text-emerald-200">Access</span>
            <span className="mt-2 block font-medium capitalize text-white">{safeRole}</span>
          </div>
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm">
            <label className="block">
              <span className="ui-kicker text-cyan-200">Role</span>
              <select
                aria-label="Switch application role"
                value={safeRole}
                onChange={(event) => setRole(event.target.value)}
                className="ui-control mt-2 bg-slate-950/80"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-300 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/10"
          >
            <span className="ui-kicker">Theme</span>
            <span className="mt-2 block font-medium text-white">
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
