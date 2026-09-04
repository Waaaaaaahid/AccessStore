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
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(8)
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  const youtubeVideos = [
    { title: 'Epic Roblox Challenge - 24 Hour Survival', views: '2.1M views', date: '3 days ago', thumb: 'https://images.pexels.com/photos/32575344/pexels-photo-32575344.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
    { title: 'Building the Ultimate Gaming Setup', views: '890K views', date: '1 week ago', thumb: 'https://images.pexels.com/photos/29283981/pexels-photo-29283981.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
    { title: 'Reacting to Your Roblox Creations', views: '1.5M views', date: '2 weeks ago', thumb: 'https://images.pexels.com/photos/4225229/pexels-photo-4225229.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-blue-700">Official Creator Store</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-5">
                {settings.hero_heading}
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                {settings.hero_subheading}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/store"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/support"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-gray-900 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <Coffee className="w-4 h-4" />
                  Support the Channel
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-10">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{settings.youtube_subscribers}</div>
                  <div className="text-xs text-gray-500">Subscribers</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{settings.youtube_views}</div>
                  <div className="text-xs text-gray-500">Total Views</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{settings.youtube_videos}</div>
                  <div className="text-xs text-gray-500">Videos</div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in">
              <VoxelHero />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          ref={featuredRef}
          className={`reveal ${featuredVisible ? 'visible' : ''}`}
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Featured</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Featured Picks</h2>
              <p className="text-gray-500 mt-2">Handpicked products for the ultimate gaming setup.</p>
            </div>
            <Link to="/store" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* YouTube Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Youtube className="w-4 h-4 text-red-600" />
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">YouTube</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Latest From YouTube</h2>
            </div>
            <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-900 hover:text-red-600 transition-colors">
              View All Videos <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {youtubeVideos.map((video, i) => (
              <div key={i} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img src={video.thumb} alt={video.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-gray-900 fill-gray-900 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">{video.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{video.views}</span>
                    <span>•</span>
                    <span>{video.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <Star className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Join the Community</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Be part of an amazing community of gamers. Follow, subscribe, and connect with fellow Roblox enthusiasts across platforms.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all hover:scale-105">
                <Youtube className="w-5 h-5 text-red-600" />
                YouTube
              </a>
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
              <a href={settings.discord_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <MessageCircle className="w-5 h-5" />
                Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
