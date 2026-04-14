import React from 'react';
import { LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Orders', path: '/admin/orders' },
  { label: 'Products', path: '/admin/products' },
  { label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout({ sessionEmail, onSignOut }) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="fixed left-0 top-0 z-20 h-screen w-[250px] bg-gray-900 text-white shadow-xl">
        <div className="flex h-full flex-col px-6 py-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin Panel</p>
            <h1 className="mt-6 text-2xl font-extrabold">Swift Control</h1>
          </div>

          <nav className="space-y-2">
            {menuItems.map(({ label, path }) => (
              <NavLink
                key={label}
                to={path}
                end={path === '/admin'}
                className={({ isActive }) =>
                  `block rounded-3xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-slate-700 text-white shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Signed In</p>
            <p className="mt-2 truncate text-sm font-semibold text-white">{sessionEmail || 'Admin session'}</p>
            <button
              type="button"
              onClick={onSignOut}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-700 px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-slate-600"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-[250px] flex-1 min-h-screen bg-slate-50 p-10">
        <Outlet />
      </main>
    </div>
  );
}
