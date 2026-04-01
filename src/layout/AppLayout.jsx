import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopNavbar from './TopNavbar.jsx'

function AppLayout() {
  return (
    <div className="min-h-screen px-3 py-3 text-slate-200 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:gap-4 lg:flex-row">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <TopNavbar />
          <main className="min-w-0 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
