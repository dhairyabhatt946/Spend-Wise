'use client'

import { useState, useRef } from 'react'
import { Sparkles, Receipt, X, Loader2, UploadCloud } from 'lucide-react'
import Link from 'next/link'
import { scanReceiptAction } from './ai-actions'
import { createExpenseAction } from './actions'

interface Category { id: number; name: string }
interface Project { id: number; name: string }

interface ExpenseFormClientProps {
  userId: number
  orgId: number
  categories: Category[]
  projects: Project[]
}

export default function ExpenseFormClient({ userId, orgId, categories, projects }: ExpenseFormClientProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // UI States
  const [isScanning, setIsScanning] = useState(false)
  const [scanMessage, setScanMessage] = useState('')

  // Form Input States (so Gemini can auto-fill them)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')

  // The AI Magic Function
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setScanMessage('Reading receipt with AI...')

    // 1. Convert image to Base64
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string
        const base64Data = base64String.split(',')[1] // Strip the metadata prefix

        // 2. Send to Gemini
        const result = await scanReceiptAction(base64Data, file.type)

        if (result.error) {
          setScanMessage('❌ ' + result.error)
        } else if (result.data) {
          setScanMessage('✅ Scan successful! Please verify the details.')
          
          // 3. Auto-fill the form!
          if (result.data.amount) setAmount(result.data.amount.toString())
          if (result.data.date) setDate(result.data.date)
          if (result.data.description) setDescription(result.data.description)
        }
      } catch (error) {
        setScanMessage('❌ Something went wrong.')
      } finally {
        setIsScanning(false)
        if (fileInputRef.current) fileInputRef.current.value = '' // Reset input
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8 relative">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-indigo-600" /> New Expense Record
        </h3>
        <Link href="/dashboard/expenses" className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </Link>
      </div>
      
      <div className="p-6 grid md:grid-cols-2 gap-8">
        
        {/* LEFT SIDE: AI Scanner */}
        <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors relative">
          
          {/* Hidden File Input (HTML5 Magic for Camera/Gallery) */}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />

          {isScanning ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
              <p className="text-sm font-medium text-indigo-700 animate-pulse">{scanMessage}</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-indigo-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Smart Receipt Scanner</h4>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                Upload a photo or take a picture of your bill. Our AI will automatically extract the details.
              </p>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white border border-indigo-200 text-indigo-700 px-6 py-2 rounded-full font-medium text-sm shadow-sm hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" /> Upload or Scan
              </button>
              {scanMessage && <p className="mt-4 text-xs font-medium text-green-600">{scanMessage}</p>}
            </>
          )}
        </div>

        {/* RIGHT SIDE: Manual Form */}
        <form action={async (formData) => {
          await createExpenseAction(userId, orgId, formData)
        }} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
              <input 
                name="amount" 
                type="number" 
                step="0.01" 
                required 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-indigo-500 focus:ring-indigo-500" 
                placeholder="0.00" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input 
                name="date" 
                type="date" 
                required 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-indigo-500 focus:ring-indigo-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="categoryId" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-indigo-500 focus:ring-indigo-500" required>
                <option value="">-- Select --</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Project</label>
              <select name="projectId" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-indigo-500 focus:ring-indigo-500">
                <option value="">-- Optional --</option>
                {projects.map(proj => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description / Merchant</label>
            <input 
              name="description" 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Uber ride to airport" 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-indigo-500 focus:ring-indigo-500" 
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button type="submit" className="flex-1 bg-gray-900 text-white rounded-md py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors">
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}