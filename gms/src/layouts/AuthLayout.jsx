import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dumbbell } from 'lucide-react';

const AuthLayout = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px] animate-pulse-slow" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center neon-glow mb-6 rotate-12">
            <Dumbbell className="text-surface" size={32} />
          </div>
          <h1 className="text-4xl font-display font-black tracking-tighter italic">TITAN</h1>
          <p className="text-white/40 font-medium tracking-widest uppercase text-xs mt-2">Elevate Your Performance</p>
        </div>
        
        <div className="glass p-8 lg:p-10 rounded-3xl border-white/10 shadow-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
