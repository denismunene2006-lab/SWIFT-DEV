import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Zap } from 'lucide-react'
import AdminLayout from './AdminLayout.jsx'
import AdminProductsPage from './AdminProductsPage.jsx'
import CheckoutPage from './CheckoutPage.jsx'
import AdminDashboardPage from './admin/AdminDashboardPage.jsx'
import AdminOrdersPage from './admin/AdminOrdersPage.jsx'
import AdminSignInPage from './admin/AdminSignInPage.jsx'
import AdminSettingsPage from './admin/AdminSettingsPage.jsx'
import BackendSetupPage from './components/BackendSetupPage.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import LoadingState from './components/LoadingState.jsx'
import ProductDetailsPage from './components/ProductDetailsPage.jsx'
import ShopPage from './components/ShopPage.jsx'
import {
  ASSETS_BUCKET,
  DEFAULT_SETTINGS,
  EMPTY_PRODUCT_FORM,
  buildCustomerSummaries,
  formatOrderItems,
  normalizeProduct,
  normalizeSettings,
} from './lib/shopConfig.js'
import { backendClient, hasBackendConfig } from './backendClient'

export default function App() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingStore, setLoadingStore] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [formData, setFormData] = useState(EMPTY_PRODUCT_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [orderSearch, setOrderSearch] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [productSavedMessage, setProductSavedMessage] = useState('')
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [authSubmitting, setAuthSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')
  const [adminSession, setAdminSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const formRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname
  const isStorefrontRoute = currentPath === '/' || currentPath.startsWith('/product/')
  const mpesaEnabled = import.meta.env.VITE_ENABLE_MPESA_PAYMENTS === 'true'

  useEffect(() => {
    fetchStorefrontData()
  }, [])

  useEffect(() => {
    if (!backendClient) {
      setAuthLoading(false)
      return
    }

    let isMounted = true

    backendClient.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) console.error('Failed to load admin session:', error.message)
        if (isMounted) {
          setAdminSession(data?.session ?? null)
          setAuthLoading(false)
        }
      })
      .catch((error) => {
        console.error('Failed to load admin session:', error.message)
        if (isMounted) setAuthLoading(false)
      })

    const {
      data: { subscription },
    } = backendClient.auth.onAuthStateChange((_event, session) => {
      setAdminSession(session ?? null)
      setAuthLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (adminSession) {
      fetchOrders()
      return
    }

    setOrders([])
  }, [adminSession])

  async function fetchStorefrontData() {
    setLoadingStore(true)

    if (!backendClient) {
      setProducts([])
      setSettings(DEFAULT_SETTINGS)
      setLoadingStore(false)
      return
    }

    try {
      const [productsResponse, settingsResponse] = await Promise.all([
        backendClient.from('products').select('*').order('created_at', { ascending: false }),
        backendClient.from('store_settings').select('*').eq('id', 1).maybeSingle(),
      ])

      if (productsResponse.error) throw productsResponse.error
      if (settingsResponse.error) console.error('Failed to load store settings:', settingsResponse.error.message)

      setProducts((productsResponse.data ?? []).map(normalizeProduct))
      setSettings(settingsResponse.data ? normalizeSettings(settingsResponse.data) : DEFAULT_SETTINGS)
    } catch (error) {
      console.error('Failed to load storefront data:', error.message)
      setProducts([])
      setSettings(DEFAULT_SETTINGS)
    } finally {
      setLoadingStore(false)
    }
  }

  async function fetchOrders() {
    if (!backendClient || !adminSession) return

    setOrdersLoading(true)

    try {
      const { data, error } = await backendClient.from('orders').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setOrders(data ?? [])
    } catch (error) {
      console.error('Failed to load orders:', error.message)
    } finally {
      setOrdersLoading(false)
    }
  }

  async function uploadAsset(file, folder) {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`
    const { error } = await backendClient.storage.from(ASSETS_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    })
    if (error) throw error
    return backendClient.storage.from(ASSETS_BUCKET).getPublicUrl(path).data.publicUrl
  }

  async function handleProductSubmit(event) {
    event.preventDefault()
    if (!backendClient) return alert('Backend is not configured yet.')

    setUploading(true)
    try {
      const wasEditing = Boolean(editingId)
      let imageUrl = formData.image.trim()
      if (imageFile) imageUrl = await uploadAsset(imageFile, 'products')

      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        image_url: imageUrl,
        category: formData.category,
      }

      const query = editingId
        ? backendClient.from('products').update(payload).eq('id', editingId)
        : backendClient.from('products').insert(payload)

      const { error } = await query
      if (error) throw error

      setFormData(EMPTY_PRODUCT_FORM)
      setImageFile(null)
      setEditingId(null)
      setProductSavedMessage(wasEditing ? 'Product updated successfully.' : 'Product created successfully.')
      setTimeout(() => setProductSavedMessage(''), 3000)
      await fetchStorefrontData()
    } catch (error) {
      console.error('Failed to save product:', error.message)
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteProduct(productId) {
    if (!backendClient) return alert('Backend is not configured yet.')
    if (!window.confirm('Delete product?')) return

    const { error } = await backendClient.from('products').delete().eq('id', productId)
    if (error) return alert(error.message)

    if (editingId === productId) {
      setEditingId(null)
      setFormData(EMPTY_PRODUCT_FORM)
      setImageFile(null)
    }

    await fetchStorefrontData()
  }

  async function handleSettingsSave(event) {
    event.preventDefault()
    if (!backendClient) return alert('Backend is not configured yet.')

    try {
      let logoUrl = settings.logo
      if (settings.logoFile) logoUrl = await uploadAsset(settings.logoFile, 'branding')

      const { error } = await backendClient.from('store_settings').upsert(
        {
          id: 1,
          store_name: settings.storeName.trim(),
          description: settings.description.trim(),
          currency: settings.currency,
          logo_url: logoUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      )

      if (error) throw error

      setSettings((prev) => ({ ...prev, logo: logoUrl, logoFile: null, logoPreview: '' }))
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 3000)
      await fetchStorefrontData()
    } catch (error) {
      console.error('Failed to save settings:', error.message)
      alert(error.message)
    }
  }

  async function updateOrderStatus(id, newStatus) {
    if (!backendClient) return alert('Backend is not configured yet.')
    const { error } = await backendClient.from('orders').update({ status: newStatus }).eq('id', id)
    if (error) return alert(error.message)
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order)))
  }

  async function deleteOrder(id) {
    if (!backendClient) return alert('Backend is not configured yet.')
    if (!window.confirm('Delete this order?')) return
    const { error } = await backendClient.from('orders').delete().eq('id', id)
    if (error) return alert(error.message)
    setOrders((prev) => prev.filter((order) => order.id !== id))
  }

  async function handleAdminSignOut() {
    if (backendClient) {
      const { error } = await backendClient.auth.signOut()
      if (error) return alert(error.message)
    }

    setAdminSession(null)
    setAuthForm((prev) => ({ ...prev, password: '' }))
    setAuthError('')
    navigate('/admin')
  }

  async function handleAdminSignIn(event) {
    event.preventDefault()
    if (!backendClient) return

    setAuthSubmitting(true)
    setAuthError('')

    try {
      const { data, error } = await backendClient.auth.signInWithPassword({
        email: authForm.email.trim(),
        password: authForm.password,
      })

      if (error) throw error

      setAdminSession(data.session ?? null)
      setAuthForm((prev) => ({ ...prev, password: '' }))
      navigate('/admin')
    } catch (error) {
      setAuthError(error.message || 'Could not sign in. Check your credentials and try again.')
    } finally {
      setAuthSubmitting(false)
    }
  }

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const customerSummaries = useMemo(() => buildCustomerSummaries(orders), [orders])
  const filteredCustomers = customerSummaries.filter((customer) => {
    const searchLower = customerSearch.toLowerCase()
    return [customer.name, customer.email, customer.phone].some((value) => value.toLowerCase().includes(searchLower))
  })
  const filteredAdminOrders = orders.filter((order) => {
    const searchLower = orderSearch.toLowerCase()
    const orderText = `${order.customer_name || ''} ${order.phone_number || ''} ${formatOrderItems(order.items)}`.toLowerCase()
    const matchesStatus = statusFilter === 'All' || (order.status || '').toLowerCase() === statusFilter.toLowerCase()
    return matchesStatus && orderText.includes(searchLower)
  })

  const totalRevenue = orders.reduce((sum, order) => {
    return ['paid', 'delivered'].includes((order.status || '').toLowerCase()) ? sum + (Number(order.amount) || 0) : sum
  }, 0)
  const catalogProducts = products
  const totalCart = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const currencyLabel = settings.currency === 'USD' ? 'USD' : 'Ksh'
  const formatPrice = (price) => {
    const converted = settings.currency === 'USD' ? price * 0.0073 : price
    return settings.currency === 'USD'
      ? converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : converted.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 p-4 shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-1.5 text-white shadow-lg shadow-blue-100"><Zap size={20} /></div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter">Swift</h1>
          </Link>
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            <Link to="/" className={`rounded-lg px-4 py-2 text-xs font-bold uppercase transition-all ${isStorefrontRoute ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Shop</Link>
            <Link to="/admin" className={`rounded-lg px-4 py-2 text-xs font-bold uppercase transition-all ${currentPath.startsWith('/admin') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Admin</Link>
          </div>
        </div>
        {isStorefrontRoute && (
          <button
            onClick={() => setIsCartOpen(true)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-black transition-all ${
              cartCount === 0 ? 'bg-slate-200 text-slate-500' : 'bg-slate-900 text-white hover:bg-blue-600'
            }`}
          >
            <ShoppingCart size={18} />
            <span className="text-sm">{cartCount} items - {currencyLabel} {formatPrice(totalCart)}</span>
          </button>
        )}
      </nav>

      <CartDrawer
        cart={cart}
        cartCount={cartCount}
        currencyLabel={currencyLabel}
        formatPrice={formatPrice}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false)
          navigate('/checkout')
        }}
        onRemoveFromCart={removeFromCart}
      />

      <Routes>
        <Route path="/" element={<ShopPage products={catalogProducts} loading={loadingStore} addToCart={addToCart} shopSettings={settings} backendConnected={hasBackendConfig} />} />
        <Route path="/product/:productId" element={<ProductDetailsPage products={catalogProducts} loading={loadingStore} addToCart={addToCart} currencyLabel={currencyLabel} formatPrice={formatPrice} />} />
        <Route path="/checkout" element={<CheckoutPage cartItems={cart} totalAmount={totalCart} currencyLabel={currencyLabel} onOrderPlaced={() => { setCart([]); fetchOrders() }} paymentsEnabled={mpesaEnabled} />} />
        <Route
          path="/admin"
          element={
            !hasBackendConfig ? (
              <BackendSetupPage />
            ) : authLoading ? (
              <LoadingState title="Checking Admin Access" message="Verifying your admin session." />
            ) : !adminSession ? (
              <AdminSignInPage
                authForm={authForm}
                setAuthForm={setAuthForm}
                onSubmit={handleAdminSignIn}
                authSubmitting={authSubmitting}
                authError={authError}
              />
            ) : (
              <AdminLayout sessionEmail={adminSession.user?.email} onSignOut={handleAdminSignOut} />
            )
          }
        >
          <Route index element={<AdminDashboardPage customerSearch={customerSearch} setCustomerSearch={setCustomerSearch} filteredCustomers={filteredCustomers} totalRevenue={totalRevenue} totalOrders={orders.length} totalCustomers={customerSummaries.length} />} />
          <Route path="products" element={<AdminProductsPage products={products} formRef={formRef} editingId={editingId} setEditingId={setEditingId} formData={formData} setFormData={setFormData} setImageFile={setImageFile} uploading={uploading} handleSubmit={handleProductSubmit} onDeleteProduct={handleDeleteProduct} productSavedMessage={productSavedMessage} />} />
          <Route path="orders" element={<AdminOrdersPage statusFilter={statusFilter} setStatusFilter={setStatusFilter} orderSearch={orderSearch} setOrderSearch={setOrderSearch} filteredAdminOrders={filteredAdminOrders} updateOrderStatus={updateOrderStatus} deleteOrder={deleteOrder} ordersLoading={ordersLoading} />} />
          <Route path="settings" element={<AdminSettingsPage settings={settings} setSettings={setSettings} settingsSaved={settingsSaved} handleSettingsSave={handleSettingsSave} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
