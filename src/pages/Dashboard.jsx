import EmptyState from '../components/EmptyState.jsx'
import PageSkeleton from '../components/PageSkeleton.jsx'
import SectionCard from '../components/SectionCard.jsx'
import StatCard from '../components/StatCard.jsx'
import { useFinance } from '../context/useFinance.js'
import { compactCurrencyFormatter, currencyFormatter } from '../data/formatters.js'
import {
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <path d="M3.75 7.5A2.25 2.25 0 0 1 6 5.25h10.5A2.25 2.25 0 0 1 18.75 7.5v9A2.25 2.25 0 0 1 16.5 18.75H6A2.25 2.25 0 0 1 3.75 16.5v-9Z" />
      <path d="M18.75 9.75h1.5v4.5h-1.5a2.25 2.25 0 1 1 0-4.5Z" />
    </svg>
  )
}

function IncomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <path d="M12 19.5v-15" />
      <path d="m6.75 9.75 5.25-5.25 5.25 5.25" />
      <path d="M5.25 19.5h13.5" />
    </svg>
  )
}

function ExpenseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <path d="M12 4.5v15" />
      <path d="m17.25 14.25-5.25 5.25-5.25-5.25" />
      <path d="M5.25 4.5h13.5" />
    </svg>
  )
}

function Dashboard() {
  const { summary, spendingByCategory, balanceHistory, isLoading } = useFinance()

  if (isLoading) {
    return <PageSkeleton variant="dashboard" />
  }

  const hasBalanceHistory = balanceHistory.length > 0
  const hasSpendingData = spendingByCategory.some((item) => item.value > 0)

  const statCards = [
    {
      label: 'Total Balance',
      value: compactCurrencyFormatter.format(summary.balance),
      change: '+8.4%',
      tone: 'positive',
      icon: <WalletIcon />,
    },
    {
      label: 'Total Income',
      value: compactCurrencyFormatter.format(summary.monthlyIncome),
      change: '+3.2%',
      tone: 'positive',
      icon: <IncomeIcon />,
    },
    {
      label: 'Total Expenses',
      value: compactCurrencyFormatter.format(summary.monthlyExpenses),
      change: '-1.1%',
      tone: 'negative',
      icon: <ExpenseIcon />,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard
          title="Balance Over Time"
          subtitle="Mock trend data showing how your balance is moving month to month."
        >
          {hasBalanceHistory ? (
            <div className="ui-chart-shell h-80 min-w-0 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={balanceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balanceStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => compactCurrencyFormatter.format(value)}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => currencyFormatter.format(value)}
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="url(#balanceStroke)"
                    strokeWidth={3}
                    dot={{ fill: '#22d3ee', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: '#8b5cf6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="No balance history available"
              description="Balance history data is missing, so the trend chart cannot be rendered right now."
              icon="CH"
            />
          )}
        </SectionCard>

        <SectionCard
          title="Spending By Category"
          subtitle="Mock category split across Food, Transport, Shopping, and Bills."
        >
          {hasSpendingData ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_180px] xl:grid-cols-1">
              <div className="ui-chart-shell h-80 min-w-0 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={spendingByCategory}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={4}
                    >
                      {spendingByCategory.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => currencyFormatter.format(value)}
                      contentStyle={{
                        backgroundColor: '#020617',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        color: '#e2e8f0',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      formatter={(value) => <span className="text-sm text-slate-300">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {spendingByCategory.map((item) => (
                  <div key={item.name} className="panel-muted panel-interactive p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{item.name}</span>
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    </div>
                    <p className="mt-3 text-xl font-semibold text-white">{currencyFormatter.format(item.amount)}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.percentage}% of total spending</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No spending data available"
              description="Add expense transactions in the tracked categories to populate the spending chart."
              icon="PI"
            />
          )}
        </SectionCard>
      </section>
    </div>
  )
}

export default Dashboard
