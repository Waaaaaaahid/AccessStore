import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle, Clock, Truck, Box, Home, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatINR } from '@/lib/config';
import type { Order, OrderItem } from '@/types';

const statuses = [
  { key: 'pending_payment', label: 'Order Placed', icon: Clock },
  { key: 'paid', label: 'Payment Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'packed', label: 'Packed', icon: Box },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

const statusIndex = (status: string) => statuses.findIndex(s => s.key === status);

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);

    let query = supabase.from('orders').select('*').eq('order_id', orderId.trim());
    if (contact.trim()) {
      query = query.or(`email.ilike.%${contact.trim()}%,phone.ilike.%${contact.trim()}%`);
    }

    const { data, error: qError } = await query.maybeSingle();

    if (qError || !data) {
      setOrder(null);
      setItems([]);
      setError('Order not found. Please check your Order ID and contact details.');
      setLoading(false);
      return;
    }

    setOrder(data);
    const { data: idata } = await supabase.from('order_items').select('*').eq('order_id', data.id);
    setItems(idata || []);
    setLoading(false);
  };

  useEffect(() => {
    if (searchParams.get('id')) {
      setOrderId(searchParams.get('id')!);
      setTimeout(() => {
        document.getElementById('track-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 100);
    }
  }, [searchParams]);

  const currentStep = order ? statusIndex(order.order_status) : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-7 h-7 text-gray-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Track Your Order</h1>
        <p className="text-gray-500">Enter your Order ID and contact details to see your order status.</p>
      </div>

      {/* Search form */}
      <form id="track-form" onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Order ID *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="ORD-XXXX-XXXX"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Mobile / Email</label>
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="Mobile number or email"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center mb-6">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Order status */}
      {order && !loading && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-bold text-gray-900">{order.order_id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900 text-sm">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Progress timeline */}
            <div className="relative">
              {statuses.map((status, index) => {
                const Icon = status.icon;
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;
                return (
                  <div key={status.key} className="flex gap-4 pb-8 last:pb-0 relative">
                    {/* Vertical line */}
                    {index < statuses.length - 1 && (
                      <div
                        className={`absolute left-5 top-12 w-0.5 h-full ${index < currentStep ? 'bg-blue-500' : 'bg-gray-200'}`}
                      />
                    )}
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all z-10 ${
                        isCompleted
                          ? isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Label */}
                    <div className="pt-1.5">
                      <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {status.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-blue-600 mt-0.5">Current status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Items in this order</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}{item.size ? ` • ${item.size}` : ''}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{formatINR(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 mt-4 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">{formatINR(order.total_amount)}</span>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-700" />
              <h2 className="font-bold text-gray-900">Delivery Address</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.customer_name}<br />
              {order.address}{order.apartment ? `, ${order.apartment}` : ''}<br />
              {order.city}, {order.state} - {order.pincode}<br />
              Phone: {order.phone}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!order && !loading && !error && searched && (
        <div className="text-center py-12">
          <p className="text-gray-500">Enter your order details above to track your shipment.</p>
        </div>
      )}
    </div>
  );
}
