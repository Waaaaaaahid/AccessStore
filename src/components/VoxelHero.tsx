import { useEffect, useState } from 'react';

export default function VoxelHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">
      {/* Floating gradient orbs */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60 animate-float" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-gray-100 rounded-full blur-3xl opacity-80 animate-float-delayed" />

      {/* Voxel character composition */}
      <div className={`relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <div className="relative" style={{ width: '320px', height: '320px' }}>
          {/* Head */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-24">
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl">
              {/* Eyes */}
              <div className="flex gap-3 justify-center pt-7">
                <div className="w-5 h-5 bg-blue-400 rounded-md shadow-inner" />
                <div className="w-5 h-5 bg-blue-400 rounded-md shadow-inner" />
              </div>
              {/* Mouth */}
              <div className="flex justify-center mt-3">
                <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="absolute left-1/2 -translate-x-1/2 top-24 w-28 h-28">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-xl flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-300 rounded-lg opacity-50" />
            </div>
          </div>

          {/* Left arm */}
          <div className="absolute top-28 left-12 w-8 h-20">
            <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg shadow-lg" />
          </div>

          {/* Right arm */}
          <div className="absolute top-28 right-12 w-8 h-20">
            <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg shadow-lg" />
          </div>

          {/* Left leg */}
          <div className="absolute top-48 left-20 w-10 h-16">
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg" />
          </div>

          {/* Right leg */}
          <div className="absolute top-48 right-20 w-10 h-16">
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg" />
          </div>

          {/* Ground shadow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-3 bg-gray-200 rounded-full blur-sm" />
        </div>
      </div>

      {/* Floating UI badges */}
      <div className="absolute top-8 left-4 sm:left-8 bg-white border border-gray-200 shadow-lg rounded-xl px-3 py-2 animate-float">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-gray-900">New Drop</span>
        </div>
      </div>

      <div className="absolute top-1/3 right-4 sm:right-8 bg-white border border-gray-200 shadow-lg rounded-xl px-3 py-2 animate-float-delayed">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-400 rounded-full" />
          <span className="text-xs font-semibold text-gray-900">Community Favorite</span>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white shadow-lg rounded-xl px-3 py-2 animate-float">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold">Limited Stock</span>
        </div>
      </div>
    </div>
  );
}
