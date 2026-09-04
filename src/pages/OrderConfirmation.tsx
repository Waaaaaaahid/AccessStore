import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatINR } from '@/lib/config';
import type { Order, OrderItem } from '@/types';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    supabase.from('orders').select('*').eq('order_id', orderId).maybeSingle().then(({ data }) => {
      setOrder(data);
      if (data) {
        supabase.from('order_items').select('*').eq('order_id', data.id).then(({ data: idata }) => {
          setItems(idata || []);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [orderId]);

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.order_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Order not found</p>
        <Link to="/store" className="text-blue-600 font-medium">Back to Store</Link>
      </div>
    );
  }

  const paymentMethodNames: Record<string, string> = {
    gpay: 'Google Pay',
    phonepe: 'PhonePe',
    paytm: 'Paytm',
    other: 'UPI',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Order Confirmed</h1>
        <p className="text-gray-500">Thank you for your purchase! Your order has been placed successfully.</p>
      </div>

      {/* Order ID */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">Order ID</p>
          <p className="font-bold text-gray-900 text-lg">{order.order_id}</p>
        </div>
        <button
          onClick={copyOrderId}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {copied ? <><Check className="w-4 h-4 text-green-600" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
        </button>
      </div>

      {/* Order details */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Order Details</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Customer Name</p>
            <p className="font-medium text-gray-900">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Payment Method</p>
            <p className="font-medium text-gray-900">{paymentMethodNames[order.payment_method || ''] || 'UPI'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Amount Paid</p>
            <p className="font-medium text-gray-900">{formatINR(order.total_amount)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Estimated Delivery</p>
            <p className="font-medium text-gray-900">{order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }) : '5-7 days'}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Products</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex gap-3">
              <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}{item.size ? ` • Size: ${item.size}` : ''}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatINR(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping address */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="w-5 h-5 text-gray-700" />
          <h2 className="font-bold text-gray-900">Shipping Address</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {order.customer_name}<br />
          {order.address}{order.apartment ? `, ${order.apartment}` : ''}<br />
          {order.city}, {order.state} - {order.pincode}<br />
          Phone: {order.phone}
        </p>
      </div>

      {/* Payment status notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Payment Verification</p>
          <p className="text-xs text-blue-700 mt-1">
            Your payment is being verified. Once confirmed, you will receive an order confirmation and your order will be processed for shipping.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to={`/track?id=${order.order_id}`}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all"
        >
          <Package className="w-5 h-5" />
          Track Order
        </Link>
        <Link
          to="/store"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-900 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
