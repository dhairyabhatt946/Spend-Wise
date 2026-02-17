import Image from "next/image";
import { prisma } from "./lib/prisma";
import Link from "next/link"
import { ArrowRight, CheckCircle2, ScanLine, PieChart, ShieldCheck } from "lucide-react"

export default async function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <PieChart className="h-6 w-6" />
            <span>SpendWise</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Smart Expense Tracking for <br />
            <span className="text-indigo-600">Modern Teams</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Stop chasing receipts. Use AI to scan bills, automate approvals, 
            and get real-time financial insights for your organization.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/register" className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl shadow-indigo-200">
              Create Organization <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/join" className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all hover:border-gray-300">
              Join Existing Team
            </Link>
          </div>

          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-4 ring-1 ring-gray-900/10">
               <div className="bg-gray-800 rounded-xl aspect-[16/9] flex items-center justify-center border border-gray-700">
                  <p className="text-gray-500 font-mono">Dashboard Preview UI</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to control spend</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Receipt Scanning</h3>
              <p className="text-gray-600 leading-relaxed">
                Don't type manually. Upload a photo of your bill and our AI automatically extracts date, amount, and merchant.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">One-Click Approvals</h3>
              <p className="text-gray-600 leading-relaxed">
                Admins can approve or reject expenses instantly. Keep your team moving without the paperwork bottlenecks.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Grade</h3>
              <p className="text-gray-600 leading-relaxed">
                Role-based access control (RBAC), secure data encryption, and audit logs. Built for scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2026 SpendWise Inc. Final Year Project.</p>
        </div>
      </footer>
    </div>
  )
}
