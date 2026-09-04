import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Zap, Truck, RotateCcw, Shield, Check, Minus, Plus, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/config';
import type { Product, Review } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase.from('products').select('*').eq('slug', slug).maybeSingle().then(({ data }) => {
      setProduct(data);
      if (data) {
        setSelectedSize(data.sizes.length > 0 ? data.sizes[0] : undefined);
        setSelectedVariant(data.variants.length > 0 ? data.variants[0] : undefined);
        setActiveImage(0);
        supabase.from('reviews').select('*').eq('product_id', data.id).order('created_at', { ascending: false }).limit(5).then(({ data: rdata }) => {
          setReviews(rdata || []);
        });
        supabase.from('products').select('*').eq('category_id', data.category_id).neq('id', data.id).limit(4).then(({ data: rdata }) => {
          setRelated(rdata || []);
        });
      }
      setLoading(false);
    });
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedSize, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, selectedSize, selectedVariant);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-gray-50 rounded-2xl animate-pulse aspect-square" />
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg animate-pulse h-8 w-3/4" />
            <div className="bg-gray-50 rounded-lg animate-pulse h-6 w-1/2" />
            <div className="bg-gray-50 rounded-lg animate-pulse h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-500 mb-4">Product not found</p>
        <Link to="/store" className="text-blue-600 font-medium">Back to Store</Link>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.image_url];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link to="/store" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Store
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 mb-4">
            <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square bg-gray-50 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-blue-600' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {product.is_new && <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full">NEW</span>}
            {product.discount_percentage > 0 && (
              <span className="px-2.5 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full">-{product.discount_percentage}% OFF</span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.review_count} reviews)</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatINR(product.price)}</span>
            {product.original_price && (
              <span className="text-lg text-gray-400 line-through">{formatINR(product.original_price)}</span>
            )}
            {product.discount_percentage > 0 && (
              <span className="text-sm font-semibold text-green-600">Save {formatINR((product.original_price || 0) - product.price)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Variant</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selectedVariant === v ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors min-w-[3rem] ${
                      selectedSize === s ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-l-lg transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-r-lg transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">{product.stock} in stock</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl transition-all ${
                added ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {added ? <><Check className="w-5 h-5" /> Added!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-5 h-5" />
              Buy Now
            </button>
            <button
              onClick={() => setWished(!wished)}
              className="p-3.5 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              <Heart className={`w-5 h-5 ${wished ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Info badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <Truck className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Free Delivery</p>
                <p className="text-xs text-gray-500">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <RotateCcw className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">7-Day Returns</p>
                <p className="text-xs text-gray-500">Easy return policy</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <Shield className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-500">UPI Payments Accepted</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <Check className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Creator Verified</p>
                <p className="text-xs text-gray-500">Made for gamers. Selected by the creator.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              UPI Payments Accepted
            </p>
            <p className="text-xs text-blue-700 mt-1">Pay securely using Google Pay, PhonePe, Paytm or any UPI app.</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-900">{review.name}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
