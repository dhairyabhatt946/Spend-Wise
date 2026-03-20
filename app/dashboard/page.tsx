import { prisma } from '@/app/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Building2 } from 'lucide-react'
import Link from 'next/link'

async function getSession() {
  const cookieHeader = (await headers()).get("cookie") || ""
  const match = cookieHeader.match(/session=([^;]+)/)
  if (!match) return null
  return JSON.parse(decodeURIComponent(match[1]))
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const orgId = Number(session.orgId)
  const userId = Number(session.id)
  const role = session.role

  const whereClause = role === 'EMPLOYEE' ? { userId } : { orgId }

  // NEW: Fetch the organization details to get the code!
  const organization = await prisma.organization.findUnique({
    where: { id: orgId }
  })

  const expenseAgg = await prisma.expense.aggregate({ _sum: { amount: true }, where: whereClause })
  const totalExpense = Number(expenseAgg._sum.amount || 0)

  const incomeAgg = await prisma.income.aggregate({ _sum: { amount: true }, where: whereClause })
  const totalIncome = Number(incomeAgg._sum.amount || 0)

  const netBalance = totalIncome - totalExpense

  const recentExpenses = await prisma.expense.findMany({
    where: whereClause,
    orderBy: { date: 'desc' },
    take: 5,
    include: { category: true }
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* HEADER SECTION WITH ORG CODE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-500">Here is what is happening with your finances today.</p>
        </div>
        
        {/* THE ORG CODE BADGE */}
        <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Organization Code</p>
            <p className="font-mono font-bold text-gray-900">{organization?.code}</p>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Net Balance</p>
            <h3 className={`text-2xl font-bold ${netBalance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              {formatCurrency(netBalance)}
            </h3>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Income</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalIncome)}</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpense)}</h3>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Expenses</h3>
          <Link href="/dashboard/expenses" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentExpenses.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No recent expenses found.</div>
          ) : (
            recentExpenses.map((expense) => (
              <div key={expense.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{expense.description || 'Untitled Expense'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()} • {expense.category?.name || 'Uncategorized'}
                  </p>
                </div>
                <div className="font-bold text-red-600">
                  -{formatCurrency(Number(expense.amount))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}