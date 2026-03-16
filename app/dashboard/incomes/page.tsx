import { prisma } from '@/app/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createIncomeAction, deleteIncomeAction } from './actions'
import { Plus, Wallet, X, Trash2 } from 'lucide-react'

async function getSession() {
  const cookieHeader = (await headers()).get("cookie") || ""
  const match = cookieHeader.match(/session=([^;]+)/)
  if (!match) return null
  return JSON.parse(decodeURIComponent(match[1]))
}

export default async function IncomesPage({
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
    where: { orgId, isIncome: true },
    orderBy: { name: 'asc' }
  })
  
  const projects = await prisma.project.findMany({
    where: { orgId, isActive: true },
    orderBy: { name: 'asc' }
  })

  // 2. Fetch Incomes based on Role
  const incomes = await prisma.income.findMany({
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
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incomes</h1>
          <p className="text-gray-500">Track money coming into your organization.</p>
        </div>
        {!showForm && (
          <Link 
            href="?new=true" 
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Income
          </Link>
        )}
      </div>

      {/* ADD INCOME FORM (Manual Only) */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex justify-between items-center">
            <h3 className="font-bold text-green-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-green-600" /> New Income Record
            </h3>
            <Link href="/dashboard/incomes" className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="p-6">
            <form action={async (formData) => {
              "use server"
              await createIncomeAction(userId, orgId, formData)
            }} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                  <input name="amount" type="number" step="0.01" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-green-500 focus:ring-green-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-green-500 focus:ring-green-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select name="categoryId" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-green-500 focus:ring-green-500">
                    <option value="">-- Select --</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project (Optional)</label>
                  <select name="projectId" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-green-500 focus:ring-green-500">
                    <option value="">-- None --</option>
                    {projects.map(proj => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description / Source</label>
                <input name="description" type="text" placeholder="e.g. Invoice #1042 Payment" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-green-500 focus:ring-green-500" />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-green-600 text-white rounded-md px-8 py-2.5 text-sm font-medium hover:bg-green-700 transition-colors">
                  Save Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INCOME TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Date</th>
              {role !== 'EMPLOYEE' && <th className="px-6 py-4">Logged By</th>}
              <th className="px-6 py-4">Source / Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {incomes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Wallet className="w-10 h-10 text-gray-300 mb-3" />
                    <p>No incomes recorded yet.</p>
                  </div>
                </td>
              </tr>
            ) : incomes.map((income) => (
              <tr key={income.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {new Date(income.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                {role !== 'EMPLOYEE' && (
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {income.user?.name}
                  </td>
                )}
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{income.description || '-'}</p>
                  {income.project && (
                    <p className="text-xs text-gray-500 mt-1">Project: {income.project.name}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    {income.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-green-600">
                  +{formatCurrency(income.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={async (formData) => {
                    "use server"
                    await deleteIncomeAction(formData)
                  }}>
                    <input type="hidden" name="incomeId" value={income.id} />
                    <button 
                      type="submit" 
                      title="Delete Income"
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