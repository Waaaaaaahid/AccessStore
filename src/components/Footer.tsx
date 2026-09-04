import { Link } from 'react-router-dom';
import { Youtube, Instagram, MessageCircle } from 'lucide-react';
import { useSettings } from '@/lib/config';

export default function Footer() {
  const settings = useSettings();

  const links = [
    { name: 'Store', path: '/store' },
    { name: 'About', path: '/about' },
    { name: 'Support', path: '/support' },
    { name: 'Contact', path: '/contact' },
    { name: 'Track Order', path: '/track' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Refund & Cancellation', path: '/refund-policy' },
    { name: 'Shipping Policy', path: '/shipping-policy' },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                  <div className="w-2 h-2 bg-white rounded-sm" />
                  <div className="w-2 h-2 bg-white rounded-sm" />
                  <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                </div>
              </div>
              <span className="font-bold text-lg text-gray-900">{settings.creator_name}</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              Official creator merchandise, gaming gear and exclusive picks for the community. Made for gamers, selected by the creator.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors">
                <Youtube className="w-4.5 h-4.5" />
              </a>
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-pink-600 hover:border-pink-200 transition-colors">
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a href={settings.discord_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                <MessageCircle className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {links.slice(0, 5).map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Policies</h3>
            <ul className="space-y-2">
              {links.slice(5).map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 {settings.creator_name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-medium">UPI Accepted</span>
            <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-medium">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
