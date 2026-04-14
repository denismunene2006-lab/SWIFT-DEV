import React from 'react'
import { Search } from 'lucide-react'
import { formatDate } from '../lib/shopConfig.js'

export default function AdminDashboardPage({
  customerSearch,
  setCustomerSearch,
  filteredCustomers,
  totalRevenue,
  totalOrders,
  totalCustomers,
}) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
      <header className="space-y-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Overview</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Track customer growth, order activity, and revenue from your backend.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-2">Total Customers</p>
            <p className="text-3xl font-black text-slate-900">{totalCustomers}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-2">Total Orders</p>
            <p className="text-3xl font-black text-slate-900">{totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-2">Paid Revenue</p>
            <p className="text-3xl font-black text-slate-900">Ksh {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search name, email, or phone..."
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-2xl outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
            value={customerSearch}
            onChange={(event) => setCustomerSearch(event.target.value)}
          />
        </div>
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                  Customer Name
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                  Contact
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                  Orders
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                  Total Spent
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 text-right">
                  Latest Order
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-sm font-medium text-slate-500">
                    Customers will appear here after orders are placed.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-700">{customer.name}</td>
                    <td className="px-8 py-6 text-sm text-slate-500 max-w-[250px]">
                      <div>{customer.email}</div>
                      <div className="mt-1 text-xs uppercase tracking-wider text-slate-400">{customer.phone}</div>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-slate-900">{customer.totalOrders}</td>
                    <td className="px-8 py-6 text-sm font-black text-slate-900">
                      Ksh {customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white">
                        {formatDate(customer.latestOrderAt)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
