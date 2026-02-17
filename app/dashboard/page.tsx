import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { prisma } from "@/app/lib/prisma"
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  TrendingUp, 
} from "lucide-react"

async function getSession() {
  const cookieHeader = (await headers()).get("cookie") || ""
  const match = cookieHeader.match(/session=([^;]+)/)
  if (!match) return null
  return JSON.parse(decodeURIComponent(match[1]))
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const { role, orgId, id: userId } = session

  let stats = {
    totalSpend: 0,
    pendingRequests: 0,
    recentExpenses: [] as any[],
    activeProjects: 0
  }

  if (role === 'OWNER' || role === 'ADMIN') {
    const expenses = await prisma.expense.aggregate({
      where: { orgId: Number(orgId) },
      _sum: { amount: true }
    })
    
    const pendingUsers = await prisma.user.count({
      where: { orgId: Number(orgId), status: 'PENDING' }
    })

    const projects = await prisma.project.count({
      where: { orgId: Number(orgId), isActive: true }
    })

    const recent = await prisma.expense.findMany({
      where: { orgId: Number(orgId) },
      take: 5,
      orderBy: { date: 'desc' },
      include: { user: true, category: true } // Join tables
    })

    stats = {
      totalSpend: Number(expenses._sum.amount || 0),
      pendingRequests: pendingUsers,
      activeProjects: projects,
      recentExpenses: recent
    }

  } else {
    const myExpenses = await prisma.expense.aggregate({
      where: { userId: Number(userId) },
      _sum: { amount: true }
    })

    const recent = await prisma.expense.findMany({
      where: { userId: Number(userId) },
      take: 5,
      orderBy: { date: 'desc' },
      include: { category: true }
    })

    stats = {
      totalSpend: Number(myExpenses._sum.amount || 0),
      pendingRequests: 0, 
      activeProjects: 0,
      recentExpenses: recent
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {session.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title={role === 'EMPLOYEE' ? "My Total Spend" : "Total Organization Spend"} 
          value={formatCurrency(stats.totalSpend)} 
          icon={DollarSign} 
          color="bg-indigo-600" 
        />
        
        {role !== 'EMPLOYEE' ? (
          <>
            <StatCard 
              title="Pending Approvals" 
              value={stats.pendingRequests} 
              icon={Users} 
              color={stats.pendingRequests > 0 ? "bg-amber-500" : "bg-green-500"} 
            />
            <StatCard 
              title="Active Projects" 
              value={stats.activeProjects} 
              icon={TrendingUp} 
              color="bg-blue-500" 
            />
          </>
        ) : (
          <StatCard 
            title="My Recent Expenses" 
            value={stats.recentExpenses.length} 
            icon={CreditCard} 
            color="bg-blue-500" 
          />
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                {role !== 'EMPLOYEE' && <th className="px-6 py-4">Employee</th>}
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No expenses recorded yet.
                  </td>
                </tr>
              ) : (
                stats.recentExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    {role !== 'EMPLOYEE' && (
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {expense.user?.name}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {expense.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {expense.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {formatCurrency(Number(expense.amount))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}