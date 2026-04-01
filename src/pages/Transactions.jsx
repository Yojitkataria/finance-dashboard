import { useMemo, useState } from 'react'
import { defaultTransactionCategories } from '../data/financeUtils.js'
import PageSkeleton from '../components/PageSkeleton.jsx'
import TransactionForm from '../components/TransactionForm.jsx'
import TransactionsTable from '../components/TransactionsTable.jsx'
import { useFinance } from '../context/useFinance.js'
import SectionCard from '../components/SectionCard.jsx'

function Transactions() {
  const {
    transactions,
    filters,
    setFilters,
    addTransaction,
    editTransaction,
    deleteTransaction,
    isAdmin,
    isLoading,
  } = useFinance()
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const { searchQuery, selectedCategory, selectedType, amountSort } = filters
  const safeSearchQuery = typeof searchQuery === 'string' ? searchQuery : ''

  const categories = useMemo(
    () => ['all', ...new Set(transactions.map((transaction) => transaction.category))],
    [transactions],
  )
  const safeSelectedCategory = categories.includes(selectedCategory) ? selectedCategory : 'all'

  const formCategories = useMemo(() => {
    const availableCategories = categories.filter((category) => category !== 'all')
    return availableCategories.length ? availableCategories : defaultTransactionCategories
  }, [categories])

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = safeSearchQuery.trim().toLowerCase()

    return [...transactions]
      .filter((transaction) => {
        const matchesSearch =
          normalizedQuery.length === 0 ||
          transaction.title.toLowerCase().includes(normalizedQuery) ||
          transaction.category.toLowerCase().includes(normalizedQuery) ||
          transaction.account.toLowerCase().includes(normalizedQuery)

        const matchesCategory =
          safeSelectedCategory === 'all' || transaction.category === safeSelectedCategory

        const matchesType = selectedType === 'all' || transaction.type === selectedType

        return matchesSearch && matchesCategory && matchesType
      })
      .sort((first, second) =>
        amountSort === 'asc'
          ? Math.abs(first.amount) - Math.abs(second.amount)
          : Math.abs(second.amount) - Math.abs(first.amount),
      )
  }, [amountSort, safeSearchQuery, safeSelectedCategory, selectedType, transactions])

  function handleAddClick() {
    setEditingTransaction(null)
    setIsFormVisible(true)
  }

  function handleEdit(transaction) {
    setEditingTransaction(transaction)
    setIsFormVisible(true)
  }

  function handleDelete(transactionId) {
    deleteTransaction(transactionId)

    if (editingTransaction?.id === transactionId) {
      setEditingTransaction(null)
      setIsFormVisible(false)
    }
  }

  function handleFormSubmit(transaction) {
    if (editingTransaction) {
      editTransaction(editingTransaction.id, transaction)
    } else {
      addTransaction(transaction)
    }

    setEditingTransaction(null)
    setIsFormVisible(false)
  }

  function handleFormCancel() {
    setEditingTransaction(null)
    setIsFormVisible(false)
  }

  const hasActiveFilters =
    safeSearchQuery.trim() !== '' ||
    safeSelectedCategory !== 'all' ||
    selectedType !== 'all' ||
    amountSort !== 'desc'

  if (isLoading) {
    return <PageSkeleton variant="transactions" />
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        title="Transactions"
        subtitle={
          isAdmin
            ? 'Search, filter, and manage transactions with admin controls.'
            : 'Search, filter, and view your transaction history.'
        }
      >
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <label className="block">
              <span className="ui-kicker mb-2 block">Search</span>
              <input
                type="text"
                value={safeSearchQuery}
                onChange={(event) => setFilters({ searchQuery: event.target.value })}
                placeholder="Search description, category, or account"
                aria-label="Search transactions"
                className="ui-control bg-white/5"
              />
            </label>

            <label className="block">
              <span className="ui-kicker mb-2 block">Category</span>
              <select
                value={safeSelectedCategory}
                onChange={(event) => setFilters({ selectedCategory: event.target.value })}
                aria-label="Filter transactions by category"
                className="ui-control"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All categories' : category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="ui-kicker mb-2 block">Type</span>
              <select
                value={selectedType}
                onChange={(event) => setFilters({ selectedType: event.target.value })}
                aria-label="Filter transactions by type"
                className="ui-control"
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <label className="block">
              <span className="ui-kicker mb-2 block">Sort By Amount</span>
              <select
                value={amountSort}
                onChange={(event) => setFilters({ amountSort: event.target.value })}
                aria-label="Sort transactions by amount"
                className="ui-control"
              >
                <option value="desc">Highest first</option>
                <option value="asc">Lowest first</option>
              </select>
            </label>
          </div>

          {isAdmin ? (
            <button
              type="button"
              onClick={handleAddClick}
              aria-label="Add transaction"
              className="ui-button-primary"
            >
              Add Transaction
            </button>
          ) : null}
        </div>

        {isAdmin && isFormVisible ? (
          <TransactionForm
            key={editingTransaction?.id ?? 'new-transaction'}
            categories={formCategories}
            initialValues={editingTransaction}
            mode={editingTransaction ? 'edit' : 'create'}
            onCancel={handleFormCancel}
            onSubmit={handleFormSubmit}
          />
        ) : null}

        <div className="mb-1 rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="ui-kicker block">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </span>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {isAdmin
              ? 'Admin mode lets you create, update, and remove records.'
              : 'Viewer mode only allows transaction browsing.'}
          </p>
        </div>

        <div className="mt-5">
          <TransactionsTable
            transactions={filteredTransactions}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyTitle={transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filters'}
            emptyDescription={
              transactions.length === 0
                ? isAdmin
                  ? 'Create your first transaction to start tracking activity across your accounts.'
                  : 'There are no saved transactions to display right now.'
                : 'Try clearing the current filters or search terms to see more results.'
            }
            emptyAction={
              transactions.length === 0 && isAdmin ? (
                <button
                  type="button"
                  onClick={handleAddClick}
                  aria-label="Add your first transaction"
                  className="ui-button-primary"
                >
                  Add Your First Transaction
                </button>
              ) : hasActiveFilters ? (
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      selectedCategory: 'all',
                      selectedType: 'all',
                      amountSort: 'desc',
                    })
                  }
                  aria-label="Clear transaction filters"
                  className="ui-button-secondary"
                >
                  Clear Filters
                </button>
              ) : null
            }
          />
        </div>
      </SectionCard>
    </div>
  )
}

export default Transactions
