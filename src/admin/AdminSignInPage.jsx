import React from 'react'
import { Loader2, LockKeyhole, Store } from 'lucide-react'

export default function AdminSignInPage({ authForm, setAuthForm, onSubmit, authSubmitting, authError }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl">
        <div className="bg-slate-950 px-8 py-10 text-white">
          <div className="inline-flex rounded-2xl bg-white/10 p-3">
            <LockKeyhole size={24} />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight">Admin Sign In</h2>
          <p className="mt-3 max-w-md text-sm font-medium text-slate-300">
            Use your admin account to access products, orders, and store settings.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-8">
          {authError && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {authError}
            </div>
          )}

          <div className="space-y-2">
            <label className="ml-1 text-[11px] font-bold uppercase text-slate-400">Email</label>
            <input
              required
              type="email"
              value={authForm.email}
              onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 ring-blue-500/10"
              placeholder="admin@yourstore.com"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[11px] font-bold uppercase text-slate-400">Password</label>
            <input
              required
              type="password"
              value={authForm.password}
              onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 ring-blue-500/10"
              placeholder="Enter your admin password"
            />
          </div>

          <button
            type="submit"
            disabled={authSubmitting}
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            {authSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Store size={18} />}
            {authSubmitting ? 'Signing In' : 'Open Admin'}
          </button>

          <p className="text-center text-xs font-medium text-slate-400">
            Sign in with an account that has admin access.
          </p>
        </form>
      </div>
    </div>
  )
}
