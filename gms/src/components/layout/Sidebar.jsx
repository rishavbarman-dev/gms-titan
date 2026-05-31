import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  CalendarCheck, 
  CreditCard, 
  Dumbbell, 
  Utensils, 
  LogOut,
  Settings,
  User,
  Menu,
  X
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import { cn } from '../ui/Button';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'trainer', 'member'] },
    { name: 'Members', path: '/members', icon: Users, roles: ['admin', 'trainer'] },
    { name: 'Trainers', path: '/trainers', icon: UserSquare2, roles: ['admin'] },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck, roles: ['admin', 'trainer', 'member'] },
    { name: 'Payments', path: '/payments', icon: CreditCard, roles: ['admin', 'member'] },
    { name: 'Workout Plans', path: '/workout-plans', icon: Dumbbell, roles: ['admin', 'trainer', 'member'] },
    { name: 'Diet Plans', path: '/diet-plans', icon: Utensils, roles: ['admin', 'trainer', 'member'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 glass border-r-white/10 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center neon-glow">
              <Dumbbell className="text-surface" size={24} />
            </div>
            <h1 className="text-2xl font-display font-black tracking-tighter italic">TITAN</h1>
            <button className="ml-auto lg:hidden" onClick={toggleSidebar}>
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                  isActive 
                    ? "bg-brand text-surface shadow-lg shadow-brand/20 scale-[1.02]" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-2 pt-6 border-t border-white/10">
            <NavLink
              to="/profile"
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <User size={20} />
              <span>Profile</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-300 font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
