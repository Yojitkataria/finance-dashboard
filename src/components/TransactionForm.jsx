import { useState } from 'react'

const defaultTransaction = {
  date: new Date().toISOString().slice(0, 10),
  title: '',
  category: 'Food',
  amount: '',
  type: 'expense',
  account: 'Primary Checking',
  status: 'Cleared',
}

function buildInitialValues(categories, initialValues) {
  if (initialValues) {
    return {
      ...initialValues,
      amount: Math.abs(initialValues.amount),
    }
  }

  return {
    ...defaultTransaction,
    category: categories[0] ?? defaultTransaction.category,
  }
}

function TransactionForm({ categories, initialValues, mode, onCancel, onSubmit }) {
  const [formValues, setFormValues] = useState(() => buildInitialValues(categories, initialValues))

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(formValues)
  }

  return (
    <form onSubmit={handleSubmit} className="panel-muted panel-interactive mb-5 rounded-[26px] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-semibold tracking-tight text-white">
            {mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-400">Only admins can manage transaction records.</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-500">Date</span>
          <input
            required
            type="date"
            name="date"
            value={formValues.date}
            onChange={handleChange}
            className="ui-control"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-500">Description</span>
          <input
            required
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            placeholder="Transaction description"
            className="ui-control"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-500">Category</span>
          <select
            name="category"
            value={formValues.category}
            onChange={handleChange}
            className="ui-control"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-500">Amount</span>
          <input
            required
            min="0"
            step="0.01"
            type="number"
            name="amount"
            value={formValues.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="ui-control"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-500">Type</span>
          <select
            name="type"
            value={formValues.type}
            onChange={handleChange}
            className="ui-control"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-500">Account</span>
          <input
            required
            type="text"
            name="account"
            value={formValues.account}
            onChange={handleChange}
            placeholder="Primary Checking"
            className="ui-control"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          className="ui-button-primary"
        >
          {mode === 'edit' ? 'Save Changes' : 'Create Transaction'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="ui-button-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
