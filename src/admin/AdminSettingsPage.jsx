import React from 'react'

export default function AdminSettingsPage({ settings, setSettings, settingsSaved, handleSettingsSave }) {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Store Settings</h2>
          <p className="text-slate-500 text-sm mt-2">
            Update your store profile, branding, and currency in your backend.
          </p>
        </div>
        <form onSubmit={handleSettingsSave} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-slate-400 ml-1">Store Name</label>
              <input
                value={settings.storeName}
                onChange={(event) => setSettings((prev) => ({ ...prev, storeName: event.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-900 outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500 transition-all"
                placeholder="Store name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-slate-400 ml-1">Currency</label>
              <select
                value={settings.currency}
                onChange={(event) => setSettings((prev) => ({ ...prev, currency: event.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-900 outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500 transition-all"
              >
                <option value="KSH">KSH</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-slate-400 ml-1">Store Description</label>
            <textarea
              value={settings.description}
              onChange={(event) => setSettings((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-900 outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500 transition-all"
              placeholder="Describe your store"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-slate-400 ml-1">Upload Logo</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-slate-700 file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:rounded-2xl file:text-slate-900"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                setSettings((prev) => ({
                  ...prev,
                  logoFile: file,
                  logoPreview: URL.createObjectURL(file),
                }))
              }}
            />
          </div>
          {(settings.logoPreview || settings.logo) && (
            <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <img
                src={settings.logoPreview || settings.logo}
                alt="Logo preview"
                className="w-full h-44 object-contain bg-slate-100"
              />
            </div>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-sm font-black uppercase tracking-wide text-white hover:bg-blue-600 transition-all"
            >
              Save Settings
            </button>
            {settingsSaved && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700">
                Settings saved successfully.
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
