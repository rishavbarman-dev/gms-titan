import React from 'react';
import { useSelector } from 'react-redux';
import { Bell, Search, Menu } from 'lucide-react';
import { cn } from '../ui/Button';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useSelector(state => state.auth);

  return (
    <header className="h-20 glass border-b-white/10 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-white/5 rounded-lg lg:hidden">
          <Menu size={24} />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand/50 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors group">
          <Bell size={20} className="text-white/60 group-hover:text-white" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full neon-glow" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{user?.name}</p>
            <p className="text-[10px] text-brand uppercase font-black tracking-widest mt-1">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-white/5">
            <img 
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
