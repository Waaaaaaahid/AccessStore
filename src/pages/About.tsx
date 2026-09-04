import { Link } from 'react-router-dom';
import { Youtube, Instagram, MessageCircle, Users, Eye, Video, Play } from 'lucide-react';
import { useSettings } from '@/lib/config';

export default function About() {
  const settings = useSettings();

  const stats = [
    { icon: Users, label: 'Subscribers', value: settings.youtube_subscribers },
    { icon: Video, label: 'Videos', value: settings.youtube_videos },
    { icon: Eye, label: 'Total Views', value: settings.youtube_views },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile */}
      <div className="text-center mb-12">
        <div className="w-32 h-32 bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-6 h-6 bg-blue-500 rounded" />
            <div className="w-6 h-6 bg-white rounded" />
            <div className="w-6 h-6 bg-white rounded" />
            <div className="w-6 h-6 bg-blue-500 rounded" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">{settings.creator_name}</h1>
        <p className="text-gray-500">Roblox Content Creator</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
              <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Bio */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">About the Creator</h2>
        <p className="text-gray-600 leading-relaxed mb-4">{settings.creator_description}</p>
        <p className="text-gray-600 leading-relaxed">
          From epic gaming challenges to community events and creative builds, I strive to bring the best entertainment to the Roblox community. Your support means everything and helps me keep creating the content you love.
        </p>
      </div>

      {/* YouTube CTA */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-3">Catch me on YouTube</h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">Subscribe and never miss a video. New content every week!</p>
        <a
          href={settings.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all hover:scale-[1.02]"
        >
          <Play className="w-5 h-5 fill-white" />
          Watch on YouTube
        </a>
      </div>

      {/* Social links */}
      <div className="flex items-center justify-center gap-4">
        <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors">
          <Youtube className="w-5 h-5" />
        </a>
        <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-pink-600 hover:border-pink-200 transition-colors">
          <Instagram className="w-5 h-5" />
        </a>
        <a href={settings.discord_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
