import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, TrendingUp, Plus, Edit2, Trash2, X, Search, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatINR } from '@/lib/config';
import type { Product, Order, Category } from '@/types';

type Tab = 'dashboard' | 'products' | 'orders' | 'customers' | 'settings';

export default function Admin() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]).then(([p, o, c]) => {
      setProducts(p.data || []);
      setOrders(o.data || []);
      setCategories(c.data || []);
      setLoading(false);
    });
  }, []);

  const refreshProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const refreshOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  };

  // Analytics
  const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.total_amount, 0);
  const pendingOrders = orders.filter(o => o.order_status === 'pending_payment').length;
  const deliveredOrders = orders.filter(o => o.order_status === 'delivered').length;
  const productsSold = orders.filter(o => o.payment_status === 'paid').length;

  const navItems: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
    { key: 'customers', label: 'Customers', icon: Users },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  const orderStatuses = ['pending_payment', 'paid', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ order_status: status, updated_at: new Date().toISOString() }).eq('id', orderId);
    refreshOrders();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    refreshProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your store, products, and orders.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto scrollbar-hide border-b border-gray-200">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === item.key ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading...</div>
      ) : (
        <>
          {/* Dashboard tab */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Orders" value={orders.length.toString()} icon={ShoppingBag} />
                <StatCard label="Total Revenue" value={formatINR(totalRevenue)} icon={TrendingUp} />
                <StatCard label="Pending Orders" value={pendingOrders.toString()} icon={Package} />
                <StatCard label="Delivered" value={deliveredOrders.toString()} icon={BarChart3} />
              </div>

              {/* Sales chart placeholder */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="font-bold text-gray-900 mb-4">Sales Overview</h2>
                <div className="flex items-end gap-2 h-48">
                  {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                </div>
              </div>

              {/* Recent orders */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="font-bold text-gray-900 mb-4">Recent Orders</h2>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.order_id}</p>
                        <p className="text-xs text-gray-500">{order.customer_name} • {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">{formatINR(order.total_amount)}</span>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>}
                </div>
              </div>
            </div>
          )}

          {/* Products tab */}
          {tab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Products ({products.length})</h2>
                <button
                  onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Stock</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                              {product.is_featured && <span className="text-[10px] text-blue-600 font-semibold">FEATURED</span>}
                              {product.is_new && <span className="text-[10px] text-green-600 font-semibold ml-1">NEW</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                          {categories.find(c => c.id === product.category_id)?.name || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatINR(product.price)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{product.stock}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => { setEditingProduct(product); setShowProductModal(true); }} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteProduct(product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders tab */}
          {tab === 'orders' && (
            <div>
              <h2 className="font-bold text-gray-900 mb-4">Orders ({orders.length})</h2>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Customer</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.order_id}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{order.customer_name}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatINR(order.total_amount)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                              {order.payment_status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.order_status}
                              onChange={e => updateOrderStatus(order.id, e.target.value)}
                              className="text-xs font-medium px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                              {orderStatuses.map(s => (
                                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Customers tab */}
          {tab === 'customers' && (
            <div>
              <h2 className="font-bold text-gray-900 mb-4">Customers</h2>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Phone</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Array.from(new Set(orders.map(o => o.email))).map(email => {
                        const customerOrders = orders.filter(o => o.email === email);
                        const name = customerOrders[0]?.customer_name || '';
                        const phone = customerOrders[0]?.phone || '';
                        const totalSpent = customerOrders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.total_amount, 0);
                        return (
                          <tr key={email} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{email}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{phone}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{customerOrders.length}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatINR(totalSpent)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {orders.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No customers yet</p>}
              </div>
            </div>
          )}

          {/* Settings tab */}
          {tab === 'settings' && <SettingsTab />}
        </>
      )}

      {/* Product modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setShowProductModal(false)}
          onSaved={() => { setShowProductModal(false); refreshProducts(); }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof TrendingUp }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function ProductModal({ product, categories, onClose, onSaved }: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price?.toString() || '',
    original_price: product?.original_price?.toString() || '',
    stock: product?.stock?.toString() || '0',
    category_id: product?.category_id || categories[0]?.id || '',
    image_url: product?.image_url || '',
    is_featured: product?.is_featured || false,
    is_new: product?.is_new || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const data = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description,
      short_description: form.short_description,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      discount_percentage: form.original_price ? Math.round(((Number(form.original_price) - Number(form.price)) / Number(form.original_price)) * 100) : 0,
      stock: Number(form.stock),
      category_id: form.category_id,
      image_url: form.image_url,
      images: form.image_url ? [form.image_url] : [],
      is_featured: form.is_featured,
      is_new: form.is_new,
      updated_at: new Date().toISOString(),
    };

    if (product) {
      await supabase.from('products').update(data).eq('id', product.id);
    } else {
      await supabase.from('products').insert(data);
    }

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-bold text-gray-900">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Short Description</label>
            <input type="text" value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Original Price (₹)</label>
              <input type="number" value={form.original_price} onChange={e => setForm({ ...form, original_price: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category</label>
              <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Image URL</label>
            <input type="text" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-blue-600" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={form.is_new} onChange={e => setForm({ ...form, is_new: e.target.checked })} className="w-4 h-4 accent-blue-600" />
              New
            </label>
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.name || !form.price} className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      const s: Record<string, string> = {};
      for (const row of data || []) {
        try {
          s[row.key] = String(JSON.parse(row.value));
        } catch {
          s[row.key] = String(row.value);
        }
      }
      setSettings(s);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from('site_settings').upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { key: 'creator_name', label: 'Creator Name' },
    { key: 'creator_description', label: 'Creator Description' },
    { key: 'hero_heading', label: 'Hero Heading' },
    { key: 'hero_subheading', label: 'Hero Subheading' },
    { key: 'youtube_subscribers', label: 'YouTube Subscribers' },
    { key: 'youtube_videos', label: 'YouTube Videos' },
    { key: 'youtube_views', label: 'YouTube Views' },
    { key: 'youtube_url', label: 'YouTube URL' },
    { key: 'instagram_url', label: 'Instagram URL' },
    { key: 'discord_url', label: 'Discord URL' },
    { key: 'business_email', label: 'Business Email' },
    { key: 'whatsapp_number', label: 'WhatsApp Number' },
    { key: 'upi_id', label: 'UPI ID' },
    { key: 'support_page_url', label: 'Support Page URL' },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="font-bold text-gray-900 mb-4">Site Settings</h2>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        {fields.map(field => (
          <div key={field.key}>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{field.label}</label>
            <input
              type="text"
              value={settings[field.key] || ''}
              onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        ))}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
        >
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
