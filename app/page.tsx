import Link from "next/link";
import { ArrowRight, Wallet, Users, BarChart3, Receipt, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">SpendWise</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 px-4 mx-auto max-w-7xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8">
          <Zap className="w-4 h-4" />
          <span>The smart way to manage team finances</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
          Control your expenses. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Empower your team.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
          SpendWise is the modern financial dashboard for growing organizations. Track incomes, approve expenses, and get real-time insights—all in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2 text-lg">
            Start for free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-lg">
            Company Login
          </Link>
        </div>
      </main>

      {/* FEATURES GRID */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to scale</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Stop using messy spreadsheets. We built SpendWise with enterprise-grade features designed for simplicity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Expense Tracking</h3>
              <p className="text-gray-600 leading-relaxed">Employees can easily log expenses with sub-categories, attach receipts, and assign them to active company projects.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Role-Based Access</h3>
              <p className="text-gray-600 leading-relaxed">Invite your team with secret Organization Codes. Admins get full control, while employees only see their own data.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Analytics</h3>
              <p className="text-gray-600 leading-relaxed">Instantly know your net balance. Live dashboards calculate total incomes and expenses the second they are logged.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-gray-900">
            <Wallet className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl">SpendWise</span>
          </div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} SpendWise. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}