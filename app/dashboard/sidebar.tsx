'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutAction } from "@/app/actions"
import {
    LayoutDashboard,
    Receipt,
    Wallet,
    BarChart3,
    Users,
    Building2,
    LogOut,
    Sparkles
} from "lucide-react"

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["OWNER", "ADMIN", "EMPLOYEE"] },
    { name: "Expenses", href: "/dashboard/expenses", icon: Receipt, roles: ["OWNER", "ADMIN", "EMPLOYEE"] },
    { name: "Incomes", href: "/dashboard/incomes", icon: Wallet, roles: ["OWNER", "ADMIN", "EMPLOYEE"] },
    // { name: "Reports", href: "/dashboard/reports", icon: BarChart3, roles: ["OWNER", "ADMIN"] },
    { name: "Team Requests", href: "/dashboard/admin/team", icon: Users, roles: ["OWNER", "ADMIN"] },
    { name: "Masters", href: "/dashboard/admin/masters", icon: Building2, roles: ["OWNER", "ADMIN"] },
]

interface SidebarProps {
    session: {
        name: string
        role: string
        email?: string
    }
}

export default function Sidebar({ session }: SidebarProps) {
    const pathname = usePathname()
    const userRole = session.role

    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col shadow-sm">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-md">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        SpendWise
                    </span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {sidebarItems.map((item) => {
                    if (!item.roles.includes(userRole)) return null

                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                        {session.name ? session.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {session.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {userRole}
                        </p>
                    </div>
                    
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </form>

                </div>
            </div>
        </aside>
    )
}
