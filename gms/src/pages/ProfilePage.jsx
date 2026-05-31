import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Mail, 
  Shield, 
  Award, 
  Activity, 
  Dumbbell, 
  Utensils, 
  Cpu, 
  Lock, 
  TrendingUp, 
  Scale, 
  Ruler, 
  Sparkles,
  Save,
  CheckCircle2,
  Camera
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { updateProfile } from '../features/auth/authSlice';
import api from '../services/api';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Harley',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Titan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Warrior',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Champion',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Rishav',
];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    
    setIsUpdating(true);
    try {
      await api.put('/auth/profile', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Security credentials updated successfully!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update security credentials.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectAvatar = async (avatarUrl) => {
    try {
      await api.put('/auth/profile', { avatar: avatarUrl });
      dispatch(updateProfile({ avatar: avatarUrl }));
      toast.success("Profile avatar updated successfully!");
      setShowAvatarPicker(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile avatar.");
    }
  };

  const isMember = user?.role === 'member';
  const isTrainer = user?.role === 'trainer';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-4xl font-black italic uppercase">
          {isAdmin ? 'ADMIN COMMAND CONTROL' : isTrainer ? 'COACH ARCHIVE' : 'ATHLETE PROFILE'}
        </h1>
        <p className="text-white/40 mt-1 uppercase tracking-[0.2em] text-xs">
          Manage your personal credentials & credentials details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Role Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="flex flex-col items-center text-center p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="relative mb-6 group/avatar">
              <button 
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-brand/20 p-1 bg-surface relative block cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-none"
              >
                <img 
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`} 
                  alt="" 
                  className="w-full h-full object-cover rounded-xl" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-black uppercase tracking-wider transition-opacity duration-300 rounded-xl">
                  <Camera size={20} className="text-brand mb-1" />
                  Change
                </div>
              </button>
              <div className="absolute -bottom-2 -right-2 bg-brand text-surface text-[10px] font-black px-2 py-1 rounded-md neon-glow">
                {user?.role.toUpperCase()}
              </div>
            </div>

            {showAvatarPicker && (
              <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-4 space-y-3 text-left">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Select Avatar Preset</p>
                <div className="grid grid-cols-3 gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAvatar(preset)}
                      className={`p-1 rounded-xl bg-surface hover:border-brand/50 border transition-all cursor-pointer ${
                        user?.avatar === preset ? 'border-brand ring-1 ring-brand/30' : 'border-white/5'
                      }`}
                    >
                      <img src={preset} alt="" className="w-full h-auto object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">{user?.name}</h3>
            <p className="text-brand text-xs font-black tracking-widest uppercase mt-1">
              {isAdmin ? 'System Administrator' : isTrainer ? 'Elite Fitness Trainer' : 'Gold Arena Member'}
            </p>

            <div className="w-full space-y-4 mt-8 pt-6 border-t border-white/5 text-left text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-white/40">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold">Registration ID</p>
                  <p className="font-mono font-bold text-white/80">{user?.id || 't-501'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-white/40">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold">Email Address</p>
                  <p className="font-semibold text-white/85">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-white/40">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold">Role Authorization</p>
                  <p className="font-semibold text-brand uppercase tracking-tighter text-xs">
                    Level {isAdmin ? '0 (Admin Root)' : isTrainer ? '1 (Coach)' : '2 (Athlete)'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Columns: Scoped Details & Security Update */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Member stats & metrics */}
          {isMember && (
            <Card title="My Fitness Arsenal" subtitle="Personal physical indicators">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-brand/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-brand/10 text-brand rounded-xl">
                      <Scale size={20} />
                    </div>
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Perfect</span>
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Weight Indicator</h4>
                  <p className="text-2xl font-black italic mt-1 text-white">78.5 kg</p>
                  <p className="text-xs text-white/40 mt-1">Target: 75.0 kg</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-brand/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-brand/10 text-brand rounded-xl">
                      <Ruler size={20} />
                    </div>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Locked</span>
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Height Scale</h4>
                  <p className="text-2xl font-black italic mt-1 text-white">182 cm</p>
                  <p className="text-xs text-white/40 mt-1">BMI Score: 23.7</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-brand/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-brand/10 text-brand rounded-xl">
                      <Activity size={20} />
                    </div>
                    <span className="text-[10px] text-brand font-bold uppercase tracking-wider">Optimal</span>
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Target Body Fat</h4>
                  <p className="text-2xl font-black italic mt-1 text-white">13.4%</p>
                  <p className="text-xs text-white/40 mt-1">Daily Burn: ~2,400 kcal</p>
                </div>
              </div>
            </Card>
          )}

          {/* 2. Trainer specs & stats */}
          {isTrainer && (
            <Card title="Professional Accreditations" subtitle="Specialization details & reviews">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <h4 className="text-xs font-black text-brand uppercase tracking-widest">COACH EXPERTISE</h4>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="brand">Hypertrophy specialist</Badge>
                    <Badge variant="brand">Pro Card Coach</Badge>
                    <Badge variant="brand">Nutrition Master</Badge>
                    <Badge variant="brand">HIIT Cardio Specialist</Badge>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <h4 className="text-xs font-black text-brand uppercase tracking-widest">PERFORMANCE SUMMARY</h4>
                  <div className="space-y-2 text-sm text-white/70">
                    <p>🏆 Active Trainees: <strong className="text-white">12 Athl.</strong></p>
                    <p>⭐ Client Rating: <strong className="text-white">4.8 / 5.0 Rating</strong></p>
                    <p>⚡ Workweek Shift: <strong className="text-white">Morning Shift (06am - 02pm)</strong></p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 3. Admin specs */}
          {isAdmin && (
            <Card title="System Environment Parameters" subtitle="Core security & backend indicators">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                  <div className="p-2.5 bg-brand/10 text-brand rounded-xl w-fit mb-4">
                    <Cpu size={20} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Backend Server</h4>
                  <p className="text-sm font-bold mt-1 text-white">Live Node.js Server</p>
                  <p className="text-xs text-white/40 mt-1">Port 5000 API</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                  <div className="p-2.5 bg-brand/10 text-brand rounded-xl w-fit mb-4">
                    <Shield size={20} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Authorization Scope</h4>
                  <p className="text-sm font-bold mt-1 text-brand">requireRole RBAC</p>
                  <p className="text-xs text-white/40 mt-1">Token-based verification</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                  <div className="p-2.5 bg-brand/10 text-brand rounded-xl w-fit mb-4">
                    <Award size={20} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Gym Database</h4>
                  <p className="text-sm font-bold mt-1 text-white">Persistent Schema</p>
                  <p className="text-xs text-white/40 mt-1">Synchronized JSON File</p>
                </div>
              </div>
            </Card>
          )}

          {/* Security details (Actionable change password form) */}
          <Card title="Update Security Credentials" subtitle="Ensure your account remains fully fortified">
            <form className="space-y-4 mt-6" onSubmit={handlePasswordSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input 
                  label="Current Password" 
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••" 
                  required
                />
                
                <Input 
                  label="New Password" 
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••" 
                  required
                />

                <Input 
                  label="Confirm Password" 
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••" 
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={isUpdating} className="gap-2">
                  <Save size={16} /> Save Security Keys
                </Button>
              </div>
            </form>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
