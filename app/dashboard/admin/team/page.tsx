import { prisma } from '@/app/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Check, X, Shield, User as UserIcon, BadgeCheck } from 'lucide-react'
import { approveUserAction, rejectUserAction } from './actions'

async function getSession() {
    const cookieHeader = (await headers()).get("cookie") || ""
    const match = cookieHeader.match(/session=([^;]+)/)
    if (!match) return null
    return JSON.parse(decodeURIComponent(match[1]))
}

export default async function TeamPage() {
    const session = await getSession()
    if (!session) redirect("/login")

    if (session.role === 'EMPLOYEE') {
        return <div className="p-8 text-center text-red-500">Access Denied. Contact your Admin.</div>
    }

    const users = await prisma.user.findMany({
        where: { orgId: Number(session.orgId) },
        orderBy: { createdAt: 'desc' }
    })

    const pendingUsers = users.filter(u => u.status === 'PENDING')
    const activeUsers = users.filter(u => u.status === 'ACTIVE' || u.status === 'REJECTED')

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
                    <p className="text-gray-500">Manage access and roles for your organization.</p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium">
                    Total Members: {users.length}
                </div>
            </div>

            {pendingUsers.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
                    <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-amber-600" />
                        <h3 className="font-bold text-amber-900">Pending Approvals ({pendingUsers.length})</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {pendingUsers.map((user) => (
                            <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                            Role: {user.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <form action={rejectUserAction}>
                                        <input type="hidden" name="userId" value={user.id} />
                                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                                            <X className="w-4 h-4" /> Reject
                                        </button>
                                    </form>
                                    <form action={approveUserAction}>
                                        <input type="hidden" name="userId" value={user.id} />
                                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-sm">
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Active Members</h3>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activeUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'OWNER' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.status === 'ACTIVE' ? (
                                        <span className="flex items-center text-green-600 gap-1 text-xs font-medium">
                                            <BadgeCheck className="w-4 h-4" /> Active
                                        </span>
                                    ) : (
                                        <span className="text-red-500 text-xs font-medium">Rejected</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}