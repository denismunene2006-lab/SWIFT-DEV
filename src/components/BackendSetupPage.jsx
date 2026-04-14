import React from 'react'
import { BarChart3 } from 'lucide-react'

export default function BackendSetupPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
        <div className="inline-flex rounded-2xl bg-sky-100 p-3 text-sky-700">
          <BarChart3 size={24} />
        </div>
        <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900">Connect Backend First</h2>
        <p className="mt-3 text-sm font-medium text-slate-500">
          This app expects a backend for products, orders, admin auth, and store settings.
        </p>
        <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm font-medium text-slate-600">
          <p>Add these frontend environment variables locally and in Vercel:</p>
          <p className="mt-3 font-mono text-xs text-slate-900">Backend project URL</p>
          <p className="font-mono text-xs text-slate-900">Backend public key</p>
          <p className="font-mono text-xs text-slate-900">VITE_ENABLE_MPESA_PAYMENTS=false</p>
        </div>
      </div>
    </div>
  )
}
