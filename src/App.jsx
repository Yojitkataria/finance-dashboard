import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PageSkeleton from './components/PageSkeleton.jsx'
import AppLayout from './layout/AppLayout.jsx'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Transactions = lazy(() => import('./pages/Transactions.jsx'))
const Insights = lazy(() => import('./pages/Insights.jsx'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/transactions"
            element={
              <Suspense fallback={<PageSkeleton variant="transactions" />}>
                <Transactions />
              </Suspense>
            }
          />
          <Route
            path="/insights"
            element={
              <Suspense fallback={<PageSkeleton variant="insights" />}>
                <Insights />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
