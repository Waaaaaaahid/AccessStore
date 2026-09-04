import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Youtube, Instagram, MessageCircle, Play, Star, TrendingUp, ShieldCheck, Truck, Users } from 'lucide-react';
import VoxelHero from '@/components/VoxelHero';
import ProductCard from '@/components/ProductCard';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useSettings } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

export default function Home() {
  const settings = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: featuredRef, visible: featuredVisible } = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    supabase.from('products').select('*').eq('is_featured', true).limit(8).then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, []);

  const youtubeVideos = [
    { title: 'Latest from AccessStore', url: 'https://youtu.be/8XOGUvv9IAs', thumb: 'https://i.ytimg.com/vi/8XOGUvv9IAs/hqdefault.jpg' },
    { title: 'Latest from AccessStore', url: 'https://youtu.be/YPwsvYQbN5c', thumb: 'https://i.ytimg.com/vi/YPwsvYQbN5c/hqdefault.jpg' },
    { title: 'Latest from AccessStore', url: 'https://youtu.be/OypRsfAStg4', thumb: 'https://i.ytimg.com/vi/OypRsfAStg4/hqdefault.jpg' },
  ];

  return (
    <div className="bg-white text-gray-950">
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-center">
            <div className="animate-fade-in-up max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full mb-6"><span className="w-2 h-2 bg-red-600 rounded-full" /><span className="text-xs font-semibold text-red-700">Official Creator Store</span></div>
              <h1 className="text-4xl sm:text-5xl lg:text-[4.25rem] font-extrabold text-gray-950 leading-[0.98] tracking-[-0.045em] mb-6">Level Up Your <span className="text-red-600">Roblox</span> Experience.</h1>
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">Premium gaming gear, creator merchandise and handpicked products for the community.</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/store" className="inline-flex items-center gap-2 px-6 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-sm hover:shadow-lg hover:shadow-red-600/20">Shop Now <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/store" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-gray-950 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">Explore Store</Link>
              </div>
              <div className="grid grid-cols-3 mt-10 pt-7 border-t border-gray-100 max-w-lg">
                <div><div className="text-xl sm:text-2xl font-bold text-gray-950">{settings.youtube_subscribers}</div><div className="text-xs text-gray-400 mt-1">Subscribers</div></div>
                <div className="border-l border-gray-200 pl-5"><div className="text-xl sm:text-2xl font-bold text-gray-950">{settings.youtube_views}</div><div className="text-xs text-gray-400 mt-1">Total Views</div></div>
                <div className="border-l border-gray-200 pl-5"><div className="text-xl sm:text-2xl font-bold text-gray-950">{settings.youtube_videos}</div><div className="text-xs text-gray-400 mt-1">Videos</div></div>
              </div>
            </div>
            <div className="animate-fade-in lg:-mr-8"><VoxelHero productImage={products[0]?.image_url} productName={products[0]?.name || 'Featured Drop'} /></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={featuredRef} className={`reveal ${featuredVisible ? 'visible' : ''}`}>
            <div className="flex items-end justify-between mb-7"><div><div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-red-600" /><span className="text-xs font-bold text-red-600 uppercase tracking-wider">Trending Now</span></div><h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">Featured Picks</h2></div><Link to="/store" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-red-600">View All <ArrowRight className="w-4 h-4" /></Link></div>
            {loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="bg-gray-50 rounded-2xl animate-pulse aspect-[3/4]" />)}</div> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}</div>}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50/70 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-red-600" /></div><div><p className="font-semibold text-sm">Secure Payments</p><p className="text-xs text-gray-500">Safe & simple checkout</p></div></div>
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center"><Truck className="w-5 h-5 text-red-600" /></div><div><p className="font-semibold text-sm">Fast Delivery</p><p className="text-xs text-gray-500">Reliable order fulfilment</p></div></div>
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center"><Users className="w-5 h-5 text-red-600" /></div><div><p className="font-semibold text-sm">Creator Community</p><p className="text-xs text-gray-500">Built for gamers</p></div></div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-7"><div><div className="flex items-center gap-2 mb-2"><Youtube className="w-4 h-4 text-red-600" /><span className="text-xs font-bold text-red-600 uppercase tracking-wider">YouTube</span></div><h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">Latest from YouTube</h2></div></div>
          <div className="grid md:grid-cols-3 gap-5">
            {youtubeVideos.map(video => <a key={video.url} href={video.url} target="_blank" rel="noopener noreferrer" className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"><div className="relative aspect-video overflow-hidden bg-gray-100"><img src={video.thumb} alt="YouTube video" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center"><div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"><Play className="w-5 h-5 text-white fill-white ml-0.5" /></div></div></div><div className="p-4"><h3 className="font-semibold text-sm text-gray-950 mb-1">{video.title}</h3><div className="flex items-center gap-2 text-xs text-gray-400"><Youtube className="w-3.5 h-3.5 text-red-600" />Watch on YouTube</div></div></a>)}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="rounded-3xl bg-black border border-gray-800 p-8 sm:p-12 text-center relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(229,9,20,0.14),transparent_55%)]" /><div className="relative z-10"><Star className="w-7 h-7 text-red-500 mx-auto mb-4" /><h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">Join the AccessStore Community</h2><p className="text-gray-400 max-w-xl mx-auto mb-7">Follow, subscribe and connect with fellow Roblox enthusiasts.</p><div className="flex flex-wrap items-center justify-center gap-3">{settings.youtube_url && <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700"><Youtube className="w-5 h-5" />YouTube</a>}{settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 text-white font-semibold rounded-xl border border-gray-700 hover:border-red-700"><Instagram className="w-5 h-5" />Instagram</a>}{settings.discord_url && <a href={settings.discord_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 text-white font-semibold rounded-xl border border-gray-700 hover:border-red-700"><MessageCircle className="w-5 h-5" />Discord</a>}</div></div></div></div>
      </section>
    </div>
  );
}
