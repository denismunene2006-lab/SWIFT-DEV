import React, { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function ShopPage({ products, loading, addToCart, shopSettings, backendConnected }) {
  const [searchTerm, setSearchTerm] = useState('')
  const shopRef = useRef(null)
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const logoSrc = shopSettings.logoPreview || shopSettings.logo || ''
  const logoLabel = (shopSettings.storeName || 'Store').trim().charAt(0).toUpperCase() || 'S'
  const currencyLabel = shopSettings.currency === 'USD' ? 'USD' : 'Ksh'
  const convertPrice = (price) => (shopSettings.currency === 'USD' ? price * 0.0073 : price)
  const formatShopPrice = (price) => {
    const converted = convertPrice(price)
    return shopSettings.currency === 'USD'
      ? converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : converted.toLocaleString()
  }

  useEffect(() => {
    const root = shopRef.current
    if (!root) return undefined

    const revealTargets = Array.from(root.querySelectorAll('[data-reveal]'))
    if (revealTargets.length === 0) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      revealTargets.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    revealTargets.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 90, 420)}ms`)
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [filteredProducts, loading, backendConnected, searchTerm, shopSettings.storeName])

  return (
    <div
      ref={shopRef}
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-slate-950/60" />
      <main className="relative mx-auto max-w-6xl px-6 py-12 animate-in fade-in duration-500">
        <section
          className="mb-8 overflow-hidden rounded-[2rem] shadow-md"
          data-reveal
          style={{
            backgroundImage:
              "linear-gradient(rgba(14, 116, 244, 0.75), rgba(15, 81, 202, 0.75)), url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            <div className="absolute inset-0 bg-sky-900/75" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8 animate-in fade-in duration-700" data-reveal>
              <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-lg">
                {logoSrc ? (
                  <img src={logoSrc} alt={`${shopSettings.storeName} logo`} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl font-black uppercase text-white/90">{logoLabel}</span>
                )}
              </div>
              <div className="flex-1 space-y-4 text-white">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{shopSettings.storeName}</h1>
                <button
                  type="button"
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center rounded-full bg-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
                >
                  Browse our products
                </button>
                <p className="max-w-2xl text-sm text-slate-200 md:text-base">
                  {shopSettings.description || 'Add a store description in Admin Settings.'}
                </p>
              </div>
            </div>
            <div className="relative z-10 mt-8">
              <div className="max-w-3xl">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-3xl border border-white/20 bg-white/90 px-5 py-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 ring-blue-500/10"
                />
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div id="products" className="space-y-8">
            {!backendConnected && (
              <div className="rounded-[2rem] border border-amber-100 bg-amber-50/95 px-6 py-5 text-sm font-medium text-amber-800 shadow-lg" data-reveal>
                Connect your backend environment variables to load your live catalog here.
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="rounded-[2rem] border border-white/40 bg-white/85 px-8 py-12 text-center shadow-2xl" data-reveal>
                <p className="text-lg font-black text-slate-900">
                  {searchTerm ? 'No products match your search yet.' : 'Your catalog is currently empty.'}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-500">
                  {searchTerm
                    ? 'Try a different keyword or clear the search box.'
                    : 'Add products from the admin panel and they will appear here automatically.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-[2rem] border border-white/60 bg-white/90 p-4 shadow-2xl backdrop-blur-xl transition-all hover:shadow-2xl"
                    data-reveal
                  >
                    <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-50 shadow-inner">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-slate-200" />
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">No image</p>
                        </div>
                      )}
                    </div>
                    <div className="px-2">
                      <h3 className="mb-1 text-lg font-black uppercase tracking-tight">{product.name}</h3>
                      <p className="mb-3 line-clamp-2 text-xs text-slate-500">{product.description}</p>
                      <p className="mb-4 text-sm font-black text-blue-600">
                        {currencyLabel} {formatShopPrice(product.price)}
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className={`w-full rounded-2xl py-4 font-black transition-all ${
                          product.stock <= 0
                            ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                            : 'bg-slate-900 text-white hover:bg-blue-600'
                        }`}
                      >
                        {product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
