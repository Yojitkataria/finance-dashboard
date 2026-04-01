import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import EmptyState from '../components/EmptyState.jsx'
import PageSkeleton from '../components/PageSkeleton.jsx'
import SectionCard from '../components/SectionCard.jsx'
import StatCard from '../components/StatCard.jsx'
import { useFinance } from '../context/useFinance.js'
import { compactCurrencyFormatter, currencyFormatter } from '../data/formatters.js'

function CategoryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <path d="M4.5 7.5A1.5 1.5 0 0 1 6 6h4.5A1.5 1.5 0 0 1 12 7.5V12a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 12V7.5Z" />
      <path d="M12 7.5A1.5 1.5 0 0 1 13.5 6H18a1.5 1.5 0 0 1 1.5 1.5V12a1.5 1.5 0 0 1-1.5 1.5h-4.5A1.5 1.5 0 0 1 12 12V7.5Z" />
      <path d="M4.5 16.5A1.5 1.5 0 0 1 6 15h12a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18v-1.5Z" />
    </svg>
  )
}

function SpendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <path d="M4.5 7.5h15" />
      <path d="M6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 17.25V6.75A2.25 2.25 0 0 1 6.75 4.5Z" />
      <path d="M9 12h6" />
    </svg>
  )
}

function CompareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <path d="M7.5 18V9.75" />
      <path d="M12 18V6" />
      <path d="M16.5 18v-5.25" />
    </svg>
  )
}

function DailyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <path d="M7.5 3.75v3" />
      <path d="M16.5 3.75v3" />
      <path d="M4.5 8.25h15" />
      <path d="M6.75 5.25h10.5A2.25 2.25 0 0 1 19.5 7.5v9.75a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 17.25V7.5a2.25 2.25 0 0 1 2.25-2.25Z" />
      <path d="M12 11.25v3.75" />
    </svg>
  )
}

function Insights() {
  const { expenseCategoryBreakdown, summary, cashFlowTrend, totals, isLoading } = useFinance()

  if (isLoading) {
    return <PageSkeleton variant="insights" />
  }

  const populatedExpenseCategories = [...expenseCategoryBreakdown]
    .filter((item) => item.value > 0)
    .sort((first, second) => second.value - first.value)
  const topCategory = populatedExpenseCategories[0] ?? {
    name: 'No expenses',
    amount: 0,
    percentage: 0,
  }
  const totalSpentThisMonth = totals.totalExpenses
  const incomeVsExpenseDelta = summary.monthlyIncome - summary.monthlyExpenses
  const averageDailySpending = totalSpentThisMonth / 30
  const hasCashFlowData = cashFlowTrend.length > 0

  const insightCards = [
    {
      label: 'Highest Spending Category',
      value: topCategory.name,
      change: currencyFormatter.format(topCategory.amount),
      tone: 'neutral',
      icon: <CategoryIcon />,
    },
    {
      label: 'Total Spent This Month',
      value: compactCurrencyFormatter.format(totalSpentThisMonth),
      change: '-2.4%',
      tone: 'negative',
      icon: <SpendIcon />,
    },
    {
      label: 'Income vs Expenses',
      value: compactCurrencyFormatter.format(incomeVsExpenseDelta),
      change: `${Math.round((summary.monthlyIncome / summary.monthlyExpenses) * 100)}% cover`,
      tone: 'positive',
      icon: <CompareIcon />,
    },
    {
      label: 'Average Daily Spending',
      value: currencyFormatter.format(averageDailySpending),
      change: '+1.8%',
      tone: 'neutral',
      icon: <DailyIcon />,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {insightCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <SectionCard
        title="Monthly Income vs Expenses"
        subtitle="Mock monthly comparison of cash inflows and outflows."
      >
        {hasCashFlowData ? (
          <div className="ui-chart-shell h-96 min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={cashFlowTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  formatter={(value) => <span className="text-sm text-slate-300">{value}</span>}
                />
                <Bar dataKey="income" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            title="No chart data available"
            description="Monthly income and expense comparison data is currently unavailable."
            icon="BR"
            className="min-h-96"
          />
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="panel-muted panel-interactive p-4">
            <p className="ui-kicker">Top category share</p>
            <p className="mt-2 text-2xl font-semibold text-white">{topCategory.percentage}%</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">{topCategory.name} leads monthly spending.</p>
          </div>
          <div className="panel-muted panel-interactive p-4">
            <p className="ui-kicker">This month income</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {currencyFormatter.format(summary.monthlyIncome)}
            </p>
          </div>
          <div className="panel-muted panel-interactive p-4">
            <p className="ui-kicker">This month expenses</p>
            <p className="mt-2 text-2xl font-semibold text-rose-300">
              {currencyFormatter.format(summary.monthlyExpenses)}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export default Insights
