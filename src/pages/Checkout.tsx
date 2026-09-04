import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Truck, ArrowLeft, Check, Loader2, Smartphone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
  });

  const deliveryCharge = subtotal >= 999 ? 0 : 49;
  const total = subtotal + deliveryCharge;

  const upiOptions = [
    { id: 'gpay', name: 'Google Pay', color: 'bg-blue-50 border-blue-200', icon: 'G' },
    { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-50 border-purple-200', icon: 'P' },
    { id: 'paytm', name: 'Paytm', color: 'bg-blue-50 border-blue-200', icon: 'P' },
    { id: 'other', name: 'Other UPI Apps', color: 'bg-gray-50 border-gray-200', icon: 'U' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    for (const field of ['fullName', 'mobile', 'email', 'address', 'city', 'state', 'pincode'] as const) {
      if (!form[field].trim()) {
        setError('Please fill in all required fields');
        return;
      }
    }

    if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ''))) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setProcessing(true);

    try {
      // Create order in database with pending payment status
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.fullName,
          email: form.email,
          phone: form.mobile,
          address: form.address,
          apartment: form.apartment || null,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          subtotal: subtotal,
          total_amount: total,
          discount: 0,
          payment_status: 'pending',
          order_status: 'pending_payment',
          payment_method: paymentMethod,
          estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size || null,
        variant: item.variant || null,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // Create payment record (pending - awaiting gateway verification)
      const { error: paymentError } = await supabase.from('payments').insert({
        order_id: order.id,
        payment_method: paymentMethod,
        amount: total,
        status: 'pending',
      });
      if (paymentError) throw paymentError;

      // In a real implementation, this is where we would redirect to the UPI payment gateway
      // and verify the payment server-side via webhook/edge function.
      // For now, we simulate the payment gateway redirect flow.
      // Payment status will be verified through the gateway, NOT by screenshot upload.

      clearCart();
      navigate(`/order-confirmation/${order.order_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link to="/store" className="text-blue-600 font-medium">Browse the store</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Left: Form fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={form.mobile}
                  onChange={e => setForm({ ...form, mobile: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Address *</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="House no, Street, Area"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Apartment / House (Optional)</label>
                <input
                  type="text"
                  value={form.apartment}
                  onChange={e => setForm({ ...form, apartment: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">City *</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">State *</label>
                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Pincode *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={form.pincode}
                  onChange={e => setForm({ ...form, pincode: e.target.value })}
                  placeholder="6-digit pincode"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="w-5 h-5 text-gray-900" />
              <h2 className="font-bold text-gray-900">UPI Payment</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Pay securely using UPI</p>

            <div className="grid grid-cols-2 gap-3">
              {upiOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`flex items-center gap-3 p-3.5 border-2 rounded-xl transition-all ${
                    paymentMethod === opt.id ? `${opt.color} ring-2 ring-blue-500/20` : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-700">
                    {opt.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{opt.name}</span>
                  {paymentMethod === opt.id && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                </button>
              ))}
            </div>

            <div className="mt-4 p-3.5 bg-blue-50 rounded-lg flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                You will be redirected to your UPI app to complete the payment. Your order will be confirmed only after the payment is verified by the payment gateway.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}{item.size ? ` • ${item.size}` : ''}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatINR(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 py-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="font-medium text-gray-900">{deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}</span>
              </div>
            </div>

            <div className="flex justify-between py-4 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900 text-lg">{formatINR(total)}</span>
            </div>

            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            <button
              type="submit"
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <>Pay {formatINR(total)}</>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Secure</span>
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Fast Delivery</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
