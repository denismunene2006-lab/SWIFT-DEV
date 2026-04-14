import React from 'react'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export default function ProductDetailsPage({ products, loading, addToCart, currencyLabel, formatPrice }) {
  const { productId } = useParams()
  const product = products.find((item) => String(item.id) === String(productId))

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Loading product details...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm space-y-4 text-center">
          <h2 className="text-2xl font-black text-slate-900">Product not found</h2>
          <p className="text-sm text-slate-500">This product may have been removed or is no longer available.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft size={16} /> Back to shop
      </Link>

      <section className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex min-h-[20rem] items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              No image
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {product.category || 'General'}
            </span>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{product.name}</h1>
            <p className="text-sm leading-relaxed text-slate-600">
              {product.description || 'No product description has been provided yet.'}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Price</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-blue-600">
              {currencyLabel} {formatPrice(product.price)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${
                product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-wide transition-all ${
              product.stock <= 0
                ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-slate-900 text-white hover:bg-blue-600'
            }`}
          >
            <ShoppingBag size={17} /> {product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}
          </button>
        </div>
      </section>
    </main>
  )
}
