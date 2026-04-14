import React, { useState } from 'react'
import { ArrowLeft, Loader2, Mail, Phone, ShieldCheck, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { backendClient } from './backendClient'

export default function CheckoutPage({
  cartItems,
  totalAmount,
  currencyLabel,
  onOrderPlaced,
  paymentsEnabled,
}) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    if (!backendClient) {
      setLoading(false)
      setStatus({
        type: 'error',
        message: 'Backend is not configured yet. Update the Vite env keys in .env and restart the app.',
      })
      return
    }

    if (cartItems.length === 0) {
      setLoading(false)
      setStatus({
        type: 'error',
        message: 'Your cart is empty. Add products before checking out.',
      })
      return
    }

    try {
      const orderItems = cartItems.map((item) => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))

      const { data: order, error: insertError } = await backendClient
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          phone_number: formData.phone,
          amount: totalAmount,
          currency: currencyLabel,
          status: 'pending',
          payment_method: paymentsEnabled ? 'M-Pesa' : 'Manual confirmation',
          items: orderItems,
        })
        .select('*')
        .single()

      if (insertError) throw insertError

      if (paymentsEnabled) {
        const { error: paymentError } = await backendClient.functions.invoke('create-stk-push', {
          body: {
            orderId: order.id,
            phone: formData.phone,
            amount: totalAmount,
          },
        })

        if (paymentError) throw paymentError

        setStatus({
          type: 'success',
          message: 'Payment request sent to your phone. We will update the order automatically once it is completed.',
        })
      } else {
        setStatus({
          type: 'success',
          message: 'Order placed successfully. You can manage it from the admin panel.',
        })
      }

      onOrderPlaced()
    } catch (error) {
      console.error('Checkout error:', error)
      setStatus({
        type: 'error',
        message: error.message || 'Could not place the order. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="p-8 md:p-12">
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Shop
          </button>

          <header className="mb-10">
            <h2 className="mb-2 text-3xl font-black uppercase italic tracking-tighter text-slate-900">Checkout</h2>
            <p className="text-sm font-medium text-slate-500">
              Complete your order by providing your details below.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {status.message && (
              <div
                className={`rounded-2xl border p-4 text-center text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2 ${
                  status.type === 'success'
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                    : 'border-red-100 bg-red-50 text-red-600'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-blue-500 focus:ring-2 ring-blue-500/10"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-blue-500 focus:ring-2 ring-blue-500/10"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (e.g., 0712345678)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-blue-500 focus:ring-2 ring-blue-500/10"
                />
              </div>
            </div>

            <div className="space-y-4 rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Order Summary</span>
                <ShieldCheck className="text-blue-400" size={20} />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-sm font-medium text-slate-300">Total Amount</span>
                <span className="text-2xl font-black tracking-tighter">
                  {currencyLabel} {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-blue-600 py-5 text-lg font-black text-white shadow-xl shadow-blue-100 transition-all active:scale-[0.98] hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : paymentsEnabled ? (
                  `Pay ${currencyLabel} ${totalAmount.toLocaleString()}`
                ) : (
                  'Place Order'
                )}
              </button>
              <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {paymentsEnabled
                  ? 'You will be prompted to complete payment on your phone'
                  : 'Orders are saved in the backend and can be fulfilled from the admin panel'}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
