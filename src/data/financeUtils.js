import { financeData } from './financeData.js'

export const TRANSACTIONS_STORAGE_KEY = 'finance-dashboard-transactions'
export const THEME_STORAGE_KEY = 'finance-dashboard-theme'
export const ROLE_STORAGE_KEY = 'finance-dashboard-role'
export const validRoles = ['viewer', 'admin']
export const validThemes = ['dark', 'light']
export const validTransactionTypes = ['all', 'income', 'expense']
export const validAmountSortOptions = ['desc', 'asc']
export const dashboardCategoryOrder = ['Food', 'Transport', 'Shopping', 'Bills']
export const defaultTransactionCategories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Salary',
  'Freelance',
  'Bonus',
]
export const defaultFilters = {
  searchQuery: '',
  selectedCategory: 'all',
  selectedType: 'all',
  amountSort: 'desc',
}

const seedTotals = calculateTotals(financeData.transactions)

export function calculateTotals(transactions) {
  const totalIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalExpenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)

  return {
    totalIncome,
    totalExpenses,
    netFlow: totalIncome - totalExpenses,
  }
}

export function buildSummary(transactions) {
  const totals = calculateTotals(transactions)

  return {
    ...financeData.summary,
    balance: financeData.summary.balance - seedTotals.netFlow + totals.netFlow,
    monthlyIncome: totals.totalIncome,
    monthlyExpenses: totals.totalExpenses,
    savingsRate: totals.totalIncome > 0 ? Math.round((totals.netFlow / totals.totalIncome) * 100) : 0,
  }
}

export function normalizeTransaction(transaction) {
  const rawAmount = Math.abs(Number(transaction.amount) || 0)

  return {
    ...transaction,
    amount: transaction.type === 'income' ? rawAmount : -rawAmount,
  }
}

export function sanitizeRole(role) {
  return validRoles.includes(role) ? role : 'viewer'
}

export function sanitizeTheme(theme) {
  return validThemes.includes(theme) ? theme : 'dark'
}

export function sanitizeFilters(nextFilters) {
  const sanitizedFilters = {}

  if ('searchQuery' in nextFilters) {
    sanitizedFilters.searchQuery =
      typeof nextFilters.searchQuery === 'string' ? nextFilters.searchQuery : defaultFilters.searchQuery
  }

  if ('selectedCategory' in nextFilters) {
    sanitizedFilters.selectedCategory =
      typeof nextFilters.selectedCategory === 'string'
        ? nextFilters.selectedCategory
        : defaultFilters.selectedCategory
  }

  if ('selectedType' in nextFilters) {
    sanitizedFilters.selectedType = validTransactionTypes.includes(nextFilters.selectedType)
      ? nextFilters.selectedType
      : defaultFilters.selectedType
  }

  if ('amountSort' in nextFilters) {
    sanitizedFilters.amountSort = validAmountSortOptions.includes(nextFilters.amountSort)
      ? nextFilters.amountSort
      : defaultFilters.amountSort
  }

  return sanitizedFilters
}

export function buildCategoryBreakdown(transactions, categories) {
  const expenseTotals = {}

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      expenseTotals[transaction.category] = (expenseTotals[transaction.category] ?? 0) + Math.abs(transaction.amount)
    })

  const sourceCategories = categories ?? Object.keys(expenseTotals)
  const total = sourceCategories.reduce((sum, category) => sum + (expenseTotals[category] ?? 0), 0)

  return sourceCategories.map((category, index) => {
    const amount = expenseTotals[category] ?? 0
    const colors = ['#22c55e', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#64748b', '#84cc16']

    return {
      name: category,
      amount,
      value: amount,
      color: colors[index % colors.length],
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }
  })
}

export function getStoredTransactions() {
  if (typeof window === 'undefined') {
    return financeData.transactions
  }

  try {
    const rawTransactions = window.localStorage.getItem(TRANSACTIONS_STORAGE_KEY)

    if (!rawTransactions) {
      return financeData.transactions
    }

    const parsedTransactions = JSON.parse(rawTransactions)
    return Array.isArray(parsedTransactions) ? parsedTransactions : financeData.transactions
  } catch {
    return financeData.transactions
  }
}

export function getStoredTheme() {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  return sanitizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY) ?? 'dark')
}

export function getStoredRole() {
  if (typeof window === 'undefined') {
    return 'viewer'
  }

  return sanitizeRole(window.localStorage.getItem(ROLE_STORAGE_KEY) ?? 'viewer')
}
