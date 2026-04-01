import EmptyState from './EmptyState.jsx'
import { currencyFormatter, dateFormatter } from '../data/formatters.js'

const categoryTagStyles = {
  Salary: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
  Freelance: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
  Bonus: 'border-sky-400/20 bg-sky-400/10 text-sky-200',
  Investments: 'border-violet-400/20 bg-violet-400/10 text-violet-200',
  Housing: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
  Food: 'border-lime-400/20 bg-lime-400/10 text-lime-200',
  Bills: 'border-pink-400/20 bg-pink-400/10 text-pink-200',
  Transport: 'border-blue-400/20 bg-blue-400/10 text-blue-200',
  Shopping: 'border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200',
}

function TransactionsTable({
  transactions,
  isAdmin = false,
  onEdit,
  onDelete,
  emptyTitle = 'No transactions found',
  emptyDescription = 'Try changing the current filters or add a new transaction.',
  emptyAction,
}) {
  if (!transactions.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        icon={isAdmin ? 'TX' : '0'}
        className="min-h-64"
      />
    )
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-[26px] border border-white/10 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left">
            <thead className="bg-white/5 text-[11px] uppercase tracking-[0.24em] text-slate-500">
              <tr>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Description</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 text-right font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Type</th>
                {isAdmin ? <th className="px-5 py-4 text-right font-medium">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/30">
              {transactions.map((transaction) => {
                const isIncome = transaction.type === 'income'
                const categoryStyle =
                  categoryTagStyles[transaction.category] ?? 'border-white/10 bg-white/5 text-slate-200'

                return (
                  <tr key={transaction.id} className="text-sm text-slate-300 transition hover:bg-white/[0.03]">
                    <td className="px-5 py-4">{dateFormatter.format(new Date(transaction.date))}</td>
                    <td className="px-5 py-4">
                      <span className="block font-medium text-white">{transaction.title}</span>
                      <span className="mt-1 block text-xs text-slate-500">{transaction.account}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${categoryStyle}`}>
                        {transaction.category}
                      </span>
                    </td>
                    <td
                      className={[
                        'px-5 py-4 text-right font-semibold',
                        isIncome ? 'text-emerald-300' : 'text-rose-300',
                      ].join(' ')}
                    >
                      {isIncome ? '+' : '-'}
                      {currencyFormatter.format(Math.abs(transaction.amount))}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={[
                          'rounded-full px-3 py-1 text-xs font-semibold capitalize',
                          isIncome ? 'bg-emerald-400/15 text-emerald-200' : 'bg-rose-400/15 text-rose-200',
                        ].join(' ')}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    {isAdmin ? (
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit?.(transaction)}
                            aria-label={`Edit transaction ${transaction.title}`}
                            className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-cyan-400/20"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete?.(transaction.id)}
                            aria-label={`Delete transaction ${transaction.title}`}
                            className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-200 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-rose-400/20"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === 'income'
          const categoryStyle =
            categoryTagStyles[transaction.category] ?? 'border-white/10 bg-white/5 text-slate-200'

          return (
            <article key={transaction.id} className="panel-muted panel-interactive rounded-[26px] p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold tracking-tight text-white">{transaction.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {dateFormatter.format(new Date(transaction.date))}
                  </p>
                </div>
                <p className={['text-sm font-semibold', isIncome ? 'text-emerald-300' : 'text-rose-300'].join(' ')}>
                  {isIncome ? '+' : '-'}
                  {currencyFormatter.format(Math.abs(transaction.amount))}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${categoryStyle}`}>
                  {transaction.category}
                </span>
                <span
                  className={[
                    'rounded-full px-3 py-1 text-xs font-semibold capitalize',
                    isIncome ? 'bg-emerald-400/15 text-emerald-200' : 'bg-rose-400/15 text-rose-200',
                  ].join(' ')}
                >
                  {transaction.type}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {transaction.account}
                </span>
              </div>

              {isAdmin ? (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(transaction)}
                    aria-label={`Edit transaction ${transaction.title}`}
                    className="flex-1 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-cyan-400/20"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(transaction.id)}
                    aria-label={`Delete transaction ${transaction.title}`}
                    className="flex-1 rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-200 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-rose-400/20"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </>
  )
}

export default TransactionsTable
