import { useCallback, useEffect, useMemo, useState } from 'react'
import { financeData } from '../data/financeData.js'
import {
  ROLE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  TRANSACTIONS_STORAGE_KEY,
  buildCategoryBreakdown,
  buildSummary,
  calculateTotals,
  dashboardCategoryOrder,
  defaultFilters,
  getStoredRole,
  getStoredTheme,
  getStoredTransactions,
  normalizeTransaction,
  sanitizeFilters,
  sanitizeRole,
  sanitizeTheme,
} from '../data/financeUtils.js'
import { FinanceContext } from './financeContextObject.js'

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(getStoredTransactions)
  const [role, setRoleState] = useState(getStoredRole)
  const [filters, setFiltersState] = useState(defaultFilters)
  const [theme, setTheme] = useState(getStoredTheme)
  const [isLoading, setIsLoading] = useState(true)

  const setRole = useCallback((nextRole) => {
    setRoleState(sanitizeRole(nextRole))
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }, [])

  const setFilters = useCallback((nextFilters) => {
    setFiltersState((currentFilters) => ({
      ...currentFilters,
      ...sanitizeFilters(nextFilters),
    }))
  }, [])

  const addTransaction = useCallback((transaction) => {
    const normalizedTransaction = normalizeTransaction(transaction)

    setTransactions((currentTransactions) => [
      {
        id: crypto.randomUUID(),
        status: transaction.status ?? 'Cleared',
        ...normalizedTransaction,
      },
      ...currentTransactions,
    ])
  }, [])

  const editTransaction = useCallback((transactionId, transaction) => {
    const normalizedTransaction = normalizeTransaction(transaction)

    setTransactions((currentTransactions) =>
      currentTransactions.map((item) =>
        item.id === transactionId ? { ...item, ...normalizedTransaction } : item,
      ),
    )
  }, [])

  const deleteTransaction = useCallback((transactionId) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId),
    )
  }, [])

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setIsLoading(false), 700)
    return () => window.clearTimeout(loadingTimer)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem(ROLE_STORAGE_KEY, role)
  }, [role])

  const totals = useMemo(() => calculateTotals(transactions), [transactions])
  const summary = useMemo(() => buildSummary(transactions), [transactions])
  const dashboardSpendingByCategory = useMemo(
    () => buildCategoryBreakdown(transactions, dashboardCategoryOrder),
    [transactions],
  )
  const expenseCategoryBreakdown = useMemo(() => buildCategoryBreakdown(transactions), [transactions])
  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions])

  const value = useMemo(
    () => ({
      user: financeData.user,
      balanceHistory: financeData.balanceHistory,
      cashFlowTrend: financeData.cashFlowTrend,
      summary,
      spendingByCategory: dashboardSpendingByCategory,
      expenseCategoryBreakdown,
      transactions,
      role,
      isAdmin: role === 'admin',
      filters,
      theme: sanitizeTheme(theme),
      isLoading,
      totals,
      recentTransactions,
      setRole,
      toggleTheme,
      setFilters,
      addTransaction,
      editTransaction,
      deleteTransaction,
    }),
    [
      addTransaction,
      dashboardSpendingByCategory,
      deleteTransaction,
      editTransaction,
      expenseCategoryBreakdown,
      filters,
      isLoading,
      recentTransactions,
      role,
      setFilters,
      setRole,
      summary,
      theme,
      toggleTheme,
      totals,
      transactions,
    ],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}
