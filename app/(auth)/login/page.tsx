'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginAction } from './actions'
import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Building, Users, Mail, Lock, Sparkles, LogIn } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, null)

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
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage your expenses
            </p>
          </div>

          <form action={formAction} className="space-y-5">
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
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
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">New to SpendWise?</span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex w-full justify-center rounded-lg border-2 border-indigo-600 bg-white px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 shadow-sm transition-all duration-200 hover:shadow-md">
                  Create Account / Join Team
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl">How do you want to get started?</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">

                  <Link
                    href="/register"
                    className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-gray-50 hover:border-indigo-500 transition-all group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-600 transition-colors">
                      <Building className="h-6 w-6 text-indigo-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Create New Organization</h4>
                      <p className="text-sm text-gray-500">I am an Owner setting up a new company.</p>
                    </div>
                  </Link>

                  <Link
                    href="/join"
                    className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-gray-50 hover:border-indigo-500 transition-all group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 group-hover:bg-green-600 transition-colors">
                      <Users className="h-6 w-6 text-green-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Join Existing Team</h4>
                      <p className="text-sm text-gray-500">I have an Org Code and want to join.</p>
                    </div>
                  </Link>

                </div>
              </DialogContent>
            </Dialog>
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
          Signing In...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-5 w-5" />
          Sign In
        </>
      )}
    </button>
  )
}