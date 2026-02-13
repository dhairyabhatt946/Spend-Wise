'use client'

import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'
import { joinOrgAction } from './actions'
import Link from 'next/link'
import { Loader2, Building2, User, Mail, Phone, Lock, UserPlus, Sparkles } from 'lucide-react'

export default function JoinPage() {
  const [state, formAction] = useFormState(joinOrgAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SpendWise
          </h1>
          <p className="text-gray-600 mt-1 text-sm">Smart Expense Management</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Join Your Team</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your details and the Organization Code shared by your admin
            </p>
          </div>

          <form action={formAction} className="space-y-5"> 
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="orgCode"
                  type="text"
                  placeholder="Ex. SPE-X92A"
                  required
                  className="block w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 uppercase"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">Ask your manager for this code</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">I am joining as:</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer">
                  <input type="radio" name="role" value="EMPLOYEE" defaultChecked className="peer sr-only" />
                  <div className="rounded-lg border-2 border-gray-200 p-3 text-center peer-checked:border-indigo-600 peer-checked:bg-indigo-50 hover:bg-gray-50 transition-all duration-200">
                    <span className="text-sm font-semibold text-gray-900">Employee</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="role" value="ADMIN" className="peer sr-only" />
                  <div className="rounded-lg border-2 border-gray-200 p-3 text-center peer-checked:border-indigo-600 peer-checked:bg-indigo-50 hover:bg-gray-50 transition-all duration-200">
                    <span className="text-sm font-semibold text-gray-900">Admin</span>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="block w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  className="block w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="mobile"
                  type="tel"
                  placeholder="9876543210"
                  required
                  pattern="[6-9]\d{9}"
                  maxLength={10}
                  title="Please enter a valid 10-digit mobile number starting with 6-9"
                  className="block w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className="block w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>
            {state?.error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 text-center">
                {state.error}
              </div>
            )}

            <SubmitButton />
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Need to create a new organization?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Register here
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Sending Request...
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-5 w-5" />
          Join Organization
        </>
      )}
    </button>
  )
}