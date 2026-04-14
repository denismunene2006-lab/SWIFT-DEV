export const DEFAULT_SETTINGS = {
  storeName: 'Your Store',
  logo: '',
  description: '',
  currency: 'KSH',
  logoFile: null,
  logoPreview: '',
}

export const EMPTY_PRODUCT_FORM = {
  name: '',
  price: '',
  stock: '',
  description: '',
  image: '',
  category: 'Accessories',
}

export const ASSETS_BUCKET = 'store-assets'

export function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.name ?? '',
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    description: product.description ?? '',
    image: product.image_url ?? '',
    category: product.category ?? 'Accessories',
  }
}

export function normalizeSettings(row) {
  return {
    ...DEFAULT_SETTINGS,
    storeName: row?.store_name ?? DEFAULT_SETTINGS.storeName,
    logo: row?.logo_url ?? DEFAULT_SETTINGS.logo,
    description: row?.description ?? DEFAULT_SETTINGS.description,
    currency: row?.currency === 'USD' ? 'USD' : 'KSH',
    logoFile: null,
    logoPreview: '',
  }
}

export function formatOrderItems(items) {
  if (Array.isArray(items)) {
    return items
      .map((item) => `${item.name}${item.quantity ? ` x${item.quantity}` : ''}`)
      .join(', ')
  }

  if (typeof items === 'string') {
    return items
  }

  return ''
}

export function formatDate(value) {
  if (!value) return 'No orders yet'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'No orders yet'

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function buildCustomerSummaries(orders) {
  const customers = new Map()

  orders.forEach((order) => {
    const key = order.customer_email || order.phone_number || order.id
    const amount = Number(order.amount) || 0
    const isPaid = ['paid', 'delivered'].includes((order.status || '').toLowerCase())
    const existing = customers.get(key) ?? {
      id: key,
      name: order.customer_name || 'Guest customer',
      email: order.customer_email || 'No email supplied',
      phone: order.phone_number || 'No phone supplied',
      totalOrders: 0,
      totalSpent: 0,
      latestOrderAt: order.created_at,
    }

    customers.set(key, {
      ...existing,
      name: existing.name === 'Guest customer' && order.customer_name ? order.customer_name : existing.name,
      email: existing.email === 'No email supplied' && order.customer_email ? order.customer_email : existing.email,
      phone: existing.phone === 'No phone supplied' && order.phone_number ? order.phone_number : existing.phone,
      totalOrders: existing.totalOrders + 1,
      totalSpent: existing.totalSpent + (isPaid ? amount : 0),
      latestOrderAt:
        !existing.latestOrderAt || new Date(order.created_at) > new Date(existing.latestOrderAt)
          ? order.created_at
          : existing.latestOrderAt,
    })
  })

  return Array.from(customers.values()).sort((left, right) => {
    return new Date(right.latestOrderAt || 0) - new Date(left.latestOrderAt || 0)
  })
}
