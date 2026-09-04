import { useEffect, useState } from 'react';

interface VoxelHeroProps {
  productImage?: string;
  productName?: string;
}

export default function VoxelHero({ productImage, productName = 'Featured Drop' }: VoxelHeroProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative w-full min-h-[420px] flex items-center justify-center">
      <div className="absolute inset-8 rounded-[2rem] bg-gradient-to-br from-gray-50 via-white to-red-50/60 border border-gray-100" />
      <div className="absolute top-10 right-10 w-56 h-56 rounded-full bg-red-100/50 blur-3xl" />
      <div className="absolute bottom-8 left-8 w-40 h-40 rounded-full bg-gray-100/80 blur-3xl" />

      <div className={`relative z-10 w-[min(88%,390px)] transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="relative bg-white rounded-[1.75rem] border border-gray-200 shadow-[0_24px_70px_rgba(0,0,0,0.10)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-red-600">New Drop</span>
            <span className="text-xs text-gray-400">AccessStore</span>
          </div>
          <div className="aspect-[4/4.2] bg-gradient-to-br from-gray-100 via-white to-gray-50 flex items-center justify-center p-8">
            {productImage ? (
              <img src={productImage} alt={productName} className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl" />
            ) : (
              <div className="relative w-44 h-52">
                <div className="absolute inset-x-7 top-4 bottom-0 bg-gray-950 rounded-[2rem] shadow-2xl" />
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-20 h-16 bg-gray-950 rounded-t-[2.2rem]" />
                <div className="absolute left-1/2 -translate-x-1/2 top-14 w-9 h-9 rounded-full bg-red-600" />
                <div className="absolute -left-1 top-14 w-12 h-28 bg-gray-950 rounded-3xl -rotate-12" />
                <div className="absolute -right-1 top-14 w-12 h-28 bg-gray-950 rounded-3xl rotate-12" />
              </div>
            )}
          </div>
          <div className="p-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Featured collection</p>
              <h3 className="font-semibold text-gray-900">{productName}</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold">Shop now</span>
          </div>
        </div>
      </div>

      <div className="absolute top-8 left-0 sm:left-2 bg-white border border-gray-200 shadow-lg rounded-xl px-3.5 py-2.5">
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-red-600 rounded-full" /><span className="text-xs font-semibold text-gray-800">Limited Drop</span></div>
      </div>
      <div className="absolute bottom-8 right-0 sm:right-2 bg-gray-950 text-white shadow-xl rounded-xl px-3.5 py-2.5">
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full" /><span className="text-xs font-semibold">Community Favorite</span></div>
      </div>
    </div>
  );
}
