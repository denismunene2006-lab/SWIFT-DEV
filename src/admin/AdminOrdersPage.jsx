import React from 'react'
import { Check, Loader2, Package, Phone, Search, Trash2 } from 'lucide-react'
import { formatOrderItems } from '../lib/shopConfig.js'

export default function AdminOrdersPage({
  statusFilter,
  setStatusFilter,
  orderSearch,
  setOrderSearch,
  filteredAdminOrders,
  updateOrderStatus,
  deleteOrder,
  ordersLoading,
}) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
      <header className="space-y-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 italic uppercase">Orders</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Fulfill and manage customer orders stored in your backend.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['All', 'Pending', 'Paid', 'Delivered'].map((filterName) => (
              <button
                key={filterName}
                onClick={() => setStatusFilter(filterName)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                  statusFilter === filterName ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'
                }`}
              >
                {filterName}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search customer, phone, or items..."
              className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500 transition-all text-xs font-medium"
              value={orderSearch}
              onChange={(event) => setOrderSearch(event.target.value)}
            />
          </div>
        </div>
      </header>
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                  Customer
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                  Details
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                  Amount
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                  State
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ordersLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center">
                    <Loader2 className="mx-auto animate-spin text-blue-600" size={24} />
                  </td>
                </tr>
              ) : filteredAdminOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-sm font-medium text-slate-500">
                    No orders matched the current filters.
                  </td>
                </tr>
              ) : (
                filteredAdminOrders.map((order) => {
                  const status = (order.status || 'pending').toLowerCase()
                  return (
                    <tr key={order.id} className="group transition-colors hover:bg-slate-50/50">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                            <Phone size={12} />
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-slate-700">
                              {order.customer_name || 'Guest customer'}
                            </span>
                            <span className="block text-xs text-slate-400">{order.phone_number}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-500 max-w-[280px]">
                        <p className="truncate">{formatOrderItems(order.items) || '-'}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">
                          {order.customer_email || 'No email supplied'}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-slate-900">
                        Ksh {Number(order.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter ${
                            status === 'pending'
                              ? 'bg-yellow-50 text-yellow-600'
                              : status === 'paid'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${
                              status === 'pending'
                                ? 'bg-yellow-400'
                                : status === 'paid'
                                  ? 'bg-emerald-400'
                                  : 'bg-blue-400'
                            }`}
                          />
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2 transition-opacity sm:opacity-0 group-hover:opacity-100">
                          {status === 'pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'paid')}
                              className="rounded-lg bg-emerald-50 p-2 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          {status === 'paid' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
                            >
                              <Package size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-2 text-slate-300 transition-colors hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
