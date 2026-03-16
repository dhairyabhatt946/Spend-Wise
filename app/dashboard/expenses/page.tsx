import { prisma } from '@/app/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createExpenseAction, deleteExpenseAction } from './actions'
import { Plus, Sparkles, Receipt, X, Trash2 } from 'lucide-react'
import ExpenseFormClient from './ExpenseFormClient'

async function getSession() {
  const cookieHeader = (await headers()).get("cookie") || ""
  const match = cookieHeader.match(/session=([^;]+)/)
  if (!match) return null
  return JSON.parse(decodeURIComponent(match[1]))
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>
}) {
  const resolvedParams = await searchParams
  const session = await getSession()
  if (!session) redirect("/login")

  const orgId = Number(session.orgId)
  const userId = Number(session.id)
  const role = session.role
  const showForm = resolvedParams.new === 'true'

  const categories = await prisma.category.findMany({
    where: { orgId, isExpense: true },
    orderBy: { name: 'asc' }
  })
  
  const projects = await prisma.project.findMany({
    where: { orgId, isActive: true },
    orderBy: { name: 'asc' }
  })

  const expenses = await prisma.expense.findMany({
    where: role === 'EMPLOYEE' ? { userId } : { orgId },
    include: {
      user: true,
      category: true,
      project: true
    },
    orderBy: { date: 'desc' }
  })

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500">Track and manage your spending.</p>
        </div>
        {!showForm && (
          <Link 
            href="?new=true" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </Link>
        )}
      </div>

      {showForm && (
        <ExpenseFormClient 
          userId={userId} 
          orgId={orgId} 
          categories={categories} 
          projects={projects} 
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Date</th>
              {role !== 'EMPLOYEE' && <th className="px-6 py-4">Employee</th>}
              <th className="px-6 py-4">Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Receipt className="w-10 h-10 text-gray-300 mb-3" />
                    <p>No expenses found.</p>
                  </div>
                </td>
              </tr>
            ) : expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                {role !== 'EMPLOYEE' && (
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {expense.user?.name}
                  </td>
                )}
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{expense.description || '-'}</p>
                  {expense.project && (
                    <p className="text-xs text-gray-500 mt-1">Project: {expense.project.name}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                    {expense.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  {formatCurrency(expense.amount)}
                </td>
                {/* NEW: Delete Button Cell */}
                <td className="px-6 py-4 text-right">
                  <form action={async () => {
                    "use server"
                    await deleteExpenseAction(expense.id)
                  }}>
                    <button 
                      type="submit" 
                      title="Delete Expense"
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}