import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { formatINR } from '@/lib/config';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, setCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { navigate('/login', { state: { from: `/product/${product.slug}` } }); return; }
    addToCart(product, 1, product.sizes?.length ? product.sizes[0] : undefined);
    setCartOpen(true);
  };

  return (
    <Link to={`/product/${product.slug}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)] hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img src={product.image_url} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">{product.is_new && <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full">NEW</span>}{product.discount_percentage > 0 && <span className="px-2.5 py-1 bg-slate-950 text-white text-[10px] font-bold rounded-full">-{product.discount_percentage}%</span>}</div>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWished(!wished); }} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"><Heart className={`w-4 h-4 transition-colors ${wished ? 'fill-blue-600 text-blue-600' : 'text-slate-400'}`} /></button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /><span className="text-xs font-medium text-slate-600">{product.rating}</span><span className="text-xs text-slate-400">({product.review_count})</span></div>
        <h3 className="font-semibold text-sm text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{product.short_description}</p>
        <div className="flex items-center gap-2 mb-3"><span className="text-lg font-bold text-slate-950">{formatINR(product.price)}</span>{product.original_price && <span className="text-sm text-slate-400 line-through">{formatINR(product.original_price)}</span>}</div>
        <button onClick={handleAdd} className="w-full py-2.5 bg-slate-950 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2"><ShoppingCart className="w-4 h-4" />{user ? 'Add to Cart' : 'Sign in to Buy'}</button>
      </div>
    </Link>
  );
}
