import React from 'react'
import { Loader2, Plus } from 'lucide-react'

export default function AdminProductsPage({
  products,
  formRef,
  editingId,
  setEditingId,
  formData,
  setFormData,
  setImageFile,
  uploading,
  handleSubmit,
  onDeleteProduct,
}) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
      <header className="space-y-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Products</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Create and manage the products in your marketplace.</p>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-6">
        <div ref={formRef} className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Plus size={18} /></div>
            <h3 className="font-bold text-lg text-slate-900">{editingId ? 'Update Product' : 'Create Product'}</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Product Name</label>
              <input
                required
                placeholder="e.g. Premium Watch"
                className="w-full bg-slate-50 p-4 rounded-2xl font-medium border border-slate-100 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Price (Ksh)</label>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="0.00"
                  className="w-full bg-slate-50 p-4 rounded-2xl font-medium border border-slate-100 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Stock Quantity</label>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full bg-slate-50 p-4 rounded-2xl font-medium border border-slate-100 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Description</label>
              <textarea
                placeholder="Enter product description"
                className="w-full min-h-[8rem] bg-slate-50 p-4 rounded-2xl font-medium border border-slate-100 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Category</label>
              <select
                className="w-full bg-slate-50 p-4 rounded-2xl font-medium border border-slate-100 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                <option>Accessories</option>
                <option>Wearables</option>
                <option>Audio</option>
                <option>Electronics</option>
                <option>Home</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Upload Image</label>
              <input
                required={!editingId && !formData.image}
                type="file"
                accept="image/*"
                className="w-full text-sm text-slate-700 file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:rounded-2xl file:text-slate-900"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setImageFile(file)
                  setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }))
                }}
              />
            </div>
            {formData.image && (
              <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <img src={formData.image} alt="Product preview" className="w-full h-44 object-cover" />
              </div>
            )}
            <button
              disabled={uploading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex justify-center items-center"
            >
              {uploading ? <Loader2 className="animate-spin mx-auto" /> : editingId ? 'Update Product' : 'Create Product'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setFormData({ name: '', price: '', stock: '', description: '', image: '', category: 'Accessories' })
                  setImageFile(null)
                }}
                className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest pt-2"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-6 border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white">
              <div>
                <h3 className="font-bold text-slate-900">Product Catalog</h3>
                <p className="text-slate-500 text-sm">Manage stock, pricing, and product details.</p>
              </div>
              <span className="bg-slate-100 text-slate-500 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">{products.length} Products</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">Product</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">Price</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">Stock</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{product.name}</p>
                            <p className="text-slate-500 text-xs uppercase tracking-wider">Ksh {product.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500">{product.category}</td>
                      <td className="px-6 py-5 text-sm font-black text-slate-900">Ksh {product.price.toLocaleString()}</td>
                      <td className="px-6 py-5 text-sm text-slate-700">{product.stock}</td>
                      <td className="px-6 py-5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(product.id)
                            setFormData({
                              name: product.name,
                              price: String(product.price),
                              stock: String(product.stock),
                              description: product.description ?? '',
                              image: product.image,
                              category: product.category,
                            })
                            setImageFile(null)
                            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          }}
                          className="px-3 py-2 bg-slate-100 text-slate-700 rounded-2xl hover:bg-indigo-50 hover:text-indigo-700 transition-all text-xs font-bold uppercase tracking-wider"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteProduct(product.id)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all text-xs font-bold uppercase tracking-wider"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
