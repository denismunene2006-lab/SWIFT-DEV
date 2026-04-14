import React from 'react'
import { ShoppingCart, Trash2, X } from 'lucide-react'

export default function CartDrawer({
  cart,
  cartCount,
  currencyLabel,
  formatPrice,
  isOpen,
  onClose,
  onCheckout,
  onRemoveFromCart,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex justify-end animate-in fade-in">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-100 p-2 text-slate-700">
              <ShoppingCart size={18} />
            </div>
            <h2 className="text-xl font-black uppercase italic">Bag ({cartCount})</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1 font-bold">
                <h4 className="text-xs uppercase">
                  {item.name}
                  {item.quantity > 1 ? <span className="ml-1 text-blue-600">x{item.quantity}</span> : null}
                </h4>
                <p className="text-blue-600">
                  {currencyLabel} {formatPrice(item.price)}
                </p>
              </div>
              <button onClick={() => onRemoveFromCart(item.id)} className="text-slate-300 hover:text-red-500">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        <div className="border-t bg-slate-50 p-8">
          <button
            type="button"
            disabled={cartCount === 0}
            onClick={onCheckout}
            className={`w-full rounded-[2rem] py-5 text-lg font-black transition-all ${
              cartCount === 0 ? 'cursor-not-allowed bg-slate-300 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
