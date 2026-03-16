import { prisma } from '@/app/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createCategoryAction, createProjectAction, toggleProjectStatusAction } from './actions'
import { FolderKanban, Tags, Plus, Archive, ArchiveRestore } from 'lucide-react'
import Link from 'next/link'

async function getSession() {
  const cookieHeader = (await headers()).get("cookie") || ""
  const match = cookieHeader.match(/session=([^;]+)/)
  if (!match) return null
  return JSON.parse(decodeURIComponent(match[1]))
}

export default async function MastersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await getSession()
  if (!session || session.role === 'EMPLOYEE') redirect("/dashboard")

  const orgId = Number(session.orgId)
  
  const resolvedParams = await searchParams
  const activeTab = resolvedParams.tab === 'projects' ? 'projects' : 'categories'

  const categories = await prisma.category.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' }
  })

  const projects = await prisma.project.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Masters Configuration</h1>
        <p className="text-gray-500">Manage categories and projects for your organization.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        <Link 
          href="?tab=categories" 
          className={`pb-4 px-2 font-medium flex items-center gap-2 ${activeTab === 'categories' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Tags className="w-4 h-4" /> Categories
        </Link>
        <Link 
          href="?tab=projects" 
          className={`pb-4 px-2 font-medium flex items-center gap-2 ${activeTab === 'projects' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FolderKanban className="w-4 h-4" /> Projects
        </Link>
      </div>

      {activeTab === 'categories' && (
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" /> Add Category
            </h3>
            <form action={async (formData) => {
              "use server"
              await createCategoryAction(orgId, formData)
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                <input name="name" type="text" required placeholder="e.g. Travel, Software" className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select name="type" className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option className='text-black' value="expense">Expense</option>
                  <option className='text-black' value="income">Income</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white rounded-md py-2 text-sm font-medium hover:bg-indigo-700">
                Save Category
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.length === 0 ? (
                  <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500">No categories added yet.</td></tr>
                ) : categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.isExpense ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {cat.isExpense ? 'Expense' : 'Income'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" /> Add Project
            </h3>
            <form action={async (formData) => {
              "use server"
              await createProjectAction(orgId, formData)
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input name="name" type="text" required placeholder="e.g. Website Redesign" className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" rows={3} placeholder="Optional details..." className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white rounded-md py-2 text-sm font-medium hover:bg-indigo-700">
                Save Project
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No projects added yet.</td></tr>
                ) : projects.map((proj) => (
                  <tr key={proj.id} className={`hover:bg-gray-50 ${!proj.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{proj.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{proj.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        proj.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {proj.isActive ? 'Active' : 'Archived'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={async (formData) => {
                        "use server"
                        await toggleProjectStatusAction(formData)
                      }}>
                        <input type="hidden" name="projectId" value={proj.id} />
                        <input type="hidden" name="currentStatus" value={proj.isActive.toString()} />
                        <button 
                          type="submit" 
                          title={proj.isActive ? "Archive Project" : "Restore Project"}
                          className={`p-2 rounded-lg transition-colors ${
                            proj.isActive 
                              ? 'text-amber-600 hover:bg-amber-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {proj.isActive ? <Archive className="w-4 h-4" /> : <ArchiveRestore className="w-4 h-4" />}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}