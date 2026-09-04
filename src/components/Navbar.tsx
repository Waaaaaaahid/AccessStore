import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Coffee } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/lib/config';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/store' },
    { name: 'Categories', path: '/store' },
    { name: 'Track Order', path: '/track' },
    { name: 'Support', path: '/support' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white border-b border-slate-100'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            <Link to="/" className="flex items-center gap-2.5 group" aria-label="AccessStore Home">
              <div className="w-9 h-9 bg-slate-950 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <div className="grid grid-cols-2 gap-1"><div className="w-2 h-2 bg-blue-500 rounded-sm" /><div className="w-2 h-2 bg-white rounded-sm" /><div className="w-2 h-2 bg-white rounded-sm" /><div className="w-2 h-2 bg-blue-500 rounded-sm" /></div>
              </div>
              <span className="font-bold text-lg text-slate-950 tracking-tight">AccessStore</span>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(link => <Link key={link.name} to={link.path} className="px-3.5 py-2 text-[13px] font-medium text-slate-600 hover:text-blue-600 transition-colors">{link.name}{link.name === 'Categories' && <span className="ml-1 text-[10px]">⌄</span>}</Link>)}
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-slate-600 hover:text-blue-600 rounded-lg transition-colors" aria-label="Search"><Search className="w-5 h-5" /></button>
              <Link to="/cart" className="relative p-2 text-slate-600 hover:text-blue-600 rounded-lg transition-colors" aria-label="Cart"><ShoppingCart className="w-5 h-5" />{totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full">{totalItems}</span>}</Link>
              <Link to="/support" className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-slate-950 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"><Coffee className="w-4 h-4" />Support</Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-600 hover:text-blue-600 rounded-lg" aria-label="Menu">{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
            </div>
          </div>
          {searchOpen && <div className="py-3 border-t border-slate-100 animate-fade-in-down"><form onSubmit={handleSearch} className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." autoFocus className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></form></div>}
        </nav>
        {mobileOpen && <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg"><div className="px-4 py-3 space-y-1">{navLinks.map(link => <Link key={link.name} to={link.path} onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">{link.name}</Link>)}<Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">Admin</Link></div></div>}
      </header>
      <div className="h-[68px]" />
    </>
  );
}
