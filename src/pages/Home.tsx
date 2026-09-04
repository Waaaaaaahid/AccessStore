import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Youtube, Instagram, MessageCircle, Play, Star, TrendingUp } from 'lucide-react';
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
    { title: 'Latest YouTube Video', url: 'https://youtu.be/8XOGUvv9IAs', thumb: 'https://i.ytimg.com/vi/8XOGUvv9IAs/hqdefault.jpg' },
    { title: 'Latest YouTube Video', url: 'https://youtu.be/YPwsvYQbN5c', thumb: 'https://i.ytimg.com/vi/YPwsvYQbN5c/hqdefault.jpg' },
    { title: 'Latest YouTube Video', url: 'https://youtu.be/OypRsfAStg4', thumb: 'https://i.ytimg.com/vi/OypRsfAStg4/hqdefault.jpg' },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-950 border border-red-700 rounded-full mb-6">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-red-400">AccessStore · Official Creator Store</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-5">{settings.hero_heading}</h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-lg">{settings.hero_subheading}</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/store" className="inline-flex items-center gap-2 px-6 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all hover:scale-[1.02] hover:shadow-lg">Shop Now <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/support" className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white font-semibold rounded-xl border border-red-700 hover:bg-red-950 transition-all"><Coffee className="w-4 h-4 text-red-500" />Support the Channel</Link>
              </div>
              <div className="flex items-center gap-8 mt-10">
                <div><div className="text-2xl font-bold text-white">{settings.youtube_subscribers}</div><div className="text-xs text-gray-400">Subscribers</div></div>
                <div className="w-px h-10 bg-red-900" />
                <div><div className="text-2xl font-bold text-white">{settings.youtube_views}</div><div className="text-xs text-gray-400">Total Views</div></div>
                <div className="w-px h-10 bg-red-900" />
                <div><div className="text-2xl font-bold text-white">{settings.youtube_videos}</div><div className="text-xs text-gray-400">Videos</div></div>
              </div>
            </div>
            <div className="animate-fade-in"><VoxelHero /></div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={featuredRef} className={`reveal ${featuredVisible ? 'visible' : ''}`}>
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-red-500" /><span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Featured</span></div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Featured Picks</h2>
                <p className="text-gray-400 mt-2">Handpicked products for the ultimate gaming setup.</p>
              </div>
              <Link to="/store" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-white hover:text-red-500 transition-colors">View All <ArrowRight className="w-4 h-4" /></Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">{[...Array(8)].map((_, i) => <div key={i} className="bg-zinc-900 rounded-2xl animate-pulse aspect-[3/4]" />)}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">{products.map(product => <ProductCard key={product.id} product={product} />)}</div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div><div className="flex items-center gap-2 mb-2"><Youtube className="w-4 h-4 text-red-500" /><span className="text-xs font-semibold text-red-500 uppercase tracking-wider">YouTube</span></div><h2 className="text-3xl font-bold text-white tracking-tight">Latest from YouTube</h2></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {youtubeVideos.map(video => (
              <a key={video.url} href={video.url} target="_blank" rel="noopener noreferrer" className="group bg-black border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-700 hover:shadow-lg hover:shadow-red-950/30 transition-all hover:-translate-y-1">
                <div className="relative aspect-video overflow-hidden bg-zinc-900">
                  <img src={video.thumb} alt={video.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center"><div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Play className="w-6 h-6 text-white fill-white ml-1" /></div></div>
                </div>
                <div className="p-4"><h3 className="font-semibold text-sm text-white line-clamp-2 mb-2">{video.title}</h3><div className="flex items-center gap-2 text-xs text-gray-400"><Youtube className="w-3.5 h-3.5 text-red-500" /><span>Watch on YouTube</span></div></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-950 border border-red-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" /><div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl" />
            <div className="relative z-10"><Star className="w-8 h-8 text-red-500 mx-auto mb-4" /><h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Join the AccessStore Community</h2><p className="text-gray-400 max-w-xl mx-auto mb-8">Be part of an amazing community of gamers. Follow, subscribe, and connect with fellow Roblox enthusiasts across platforms.</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {settings.youtube_url && <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all hover:scale-105"><Youtube className="w-5 h-5" />YouTube</a>}
                {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white font-semibold rounded-xl border border-zinc-700 hover:border-red-700 hover:bg-red-950 transition-all hover:scale-105"><Instagram className="w-5 h-5" />Instagram</a>}
                {settings.discord_url && <a href={settings.discord_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white font-semibold rounded-xl border border-zinc-700 hover:border-red-700 hover:bg-red-950 transition-all hover:scale-105"><MessageCircle className="w-5 h-5" />Discord</a>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
