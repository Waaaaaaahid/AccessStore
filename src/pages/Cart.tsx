import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/config';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState('');

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.trim().toUpperCase())
      .eq('active', true)
      .maybeSingle();

    if (!data) {
      setCouponError('Invalid coupon code');
      setDiscount(0);
      setCouponApplied('');
      return;
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setCouponError('Coupon has expired');
      setDiscount(0);
      setCouponApplied('');
      return;
    }
    if (data.min_order && subtotal < data.min_order) {
      setCouponError(`Minimum order of ${formatINR(data.min_order)} required`);
      setDiscount(0);
      setCouponApplied('');
      return;
    }
    let disc = 0;
    if (data.discount_type === 'percentage') {
      disc = (subtotal * data.discount_value) / 100;
    } else {
      disc = data.discount_value;
    }
    setDiscount(disc);
    setCouponApplied(couponCode.trim().toUpperCase());
  };

  const total = subtotal - discount;
  const deliveryCharge = subtotal >= 999 ? 0 : 49;
  const finalTotal = total + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is waiting for its next power-up.</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet. Let's find something epic.</p>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all hover:scale-[1.02]"
          >
            Explore Store
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-2xl">
              <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-xl overflow-hidden">
                  <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.slug}`}>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">{item.product.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {item.variant && <span className="text-xs text-gray-500">{item.variant}</span>}
                  {item.size && <span className="text-xs text-gray-500">Size: {item.size}</span>}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-gray-900">{formatINR(item.product.price)}</span>
                  {item.product.original_price && (
                    <span className="text-sm text-gray-400 line-through">{formatINR(item.product.original_price)}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button onClick={() => updateQuantity(index, item.quantity - 1)} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-l-lg transition-colors">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, item.quantity + 1)} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-r-lg transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <Link to="/store" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              ← Continue Shopping
            </Link>
            <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
              {couponApplied && <p className="text-xs text-green-600 mt-1.5">Coupon "{couponApplied}" applied!</p>}
            </div>

            <div className="space-y-2.5 py-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-green-600">-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="font-medium text-gray-900">{deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}</span>
              </div>
            </div>

            <div className="flex justify-between py-4 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900 text-lg">{formatINR(finalTotal)}</span>
            </div>

            {deliveryCharge > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mb-4">
                <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-700">Add {formatINR(999 - subtotal)} more for FREE delivery</p>
              </div>
            )}

            <Link
              to="/checkout"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all hover:scale-[1.02]"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-gray-400 text-center mt-3">Secure UPI payments accepted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
