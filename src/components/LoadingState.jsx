import React from 'react'
import { Loader2 } from 'lucide-react'

export default function LoadingState({ title, message }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl">
        <Loader2 className="mx-auto mb-4 animate-spin text-blue-600" size={34} />
        <h2 className="text-2xl font-black tracking-tight text-slate-900">{title}</h2>
        <p className="mt-3 text-sm font-medium text-slate-500">{message}</p>
      </div>
    </div>
  )
}
