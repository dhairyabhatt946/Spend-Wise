import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Sparkles } from "lucide-react"
import Sidebar from "./sidebar"

async function getSession() {
    const cookieHeader = (await headers()).get("cookie") || ""
    const match = cookieHeader.match(/session=([^;]+)/)
    if (!match) return null
    return JSON.parse(decodeURIComponent(match[1]))
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()

    if (!session) redirect("/login")

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Sidebar session={session} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4 md:px-8">
                        <div className="flex items-center gap-3">
                            <div className="md:hidden inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-md">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent md:hidden">
                                SpendWise
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{session.name}</p>
                                    <p className="text-xs text-gray-500">{session.role}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                    {session.name ? session.name.charAt(0).toUpperCase() : "U"}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}