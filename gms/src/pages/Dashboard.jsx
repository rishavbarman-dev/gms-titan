import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, 
  UserCheck, 
  UserSquare2, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  LogOut,
  User,
  Zap,
  Activity,
  Dumbbell,
  Utensils
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { toast } from 'react-hot-toast';
import { Card } from '../components/ui/Input';
import { Badge } from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { 
  fetchMembers, 
  fetchTrainers, 
  fetchPayments, 
  fetchDashboardAnalytics,
  fetchAttendance,
  checkInMember,
  checkOutMember,
  fetchWorkoutPlans,
  fetchDietPlans
} from '../features/gym/gymSlice';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, isBrand }) => (
  <Card className={`flex flex-col relative overflow-hidden ${isBrand ? 'bg-brand text-surface border-none' : ''}`}>
    <div className="flex items-center justify-between mb-4 z-10">
      <div className={`p-2.5 rounded-xl ${isBrand ? 'bg-surface/10 text-surface' : 'bg-brand/10 text-brand'}`}>
        <Icon size={20} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold ${isBrand ? 'text-surface/80' : trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </div>
      )}
    </div>
    <h3 className={`text-sm font-medium uppercase tracking-wider z-10 ${isBrand ? 'text-surface/60' : 'text-white/50'}`}>{title}</h3>
    <p className="text-3xl font-black italic mt-1 z-10">{value}</p>
    {isBrand && (
      <div className="absolute -right-4 -bottom-4 opacity-10 text-surface pointer-events-none">
        <Icon size={120} />
      </div>
    )}
  </Card>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { members, trainers, payments, analytics, attendance, workoutPlans, dietPlans, loading } = useSelector(state => state.gym);

  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchTrainers());
    dispatch(fetchAttendance());
    dispatch(fetchWorkoutPlans());
    dispatch(fetchDietPlans());
    
    if (user?.role === 'admin') {
      dispatch(fetchPayments());
    }
    
    if (user?.role !== 'member') {
      dispatch(fetchDashboardAnalytics());
    }
  }, [dispatch, user]);

  const { stats, charts } = analytics;

  // Handle Member self-check-in / out
  const todayStr = new Date().toISOString().split('T')[0];
  const activeSession = attendance.find(log => log.date === todayStr && log.checkOut === '--:--');

  const handleSelfCheckIn = async () => {
    const result = await dispatch(checkInMember({}));
    if (checkInMember.fulfilled.match(result)) {
      toast.success('Check-in successful! Welcome to the arena!');
      dispatch(fetchAttendance());
    } else {
      toast.error(result.payload || 'Check-in failed');
    }
  };

  const handleSelfCheckOut = async () => {
    if (!activeSession) return;
    const result = await dispatch(checkOutMember(activeSession.id));
    if (checkOutMember.fulfilled.match(result)) {
      toast.success('Check-out successful! Outstanding session today!');
      dispatch(fetchAttendance());
    } else {
      toast.error(result.payload || 'Check-out failed');
    }
  };

  // ------------------ 1. MEMBER PORTAL ------------------
  if (user?.role === 'member') {
    // Resolve personal records
    const memberProfile = members.find(m => m.email === user.email) || {
      id: 'm-loading',
      plan: 'Basic',
      status: 'Active',
      joinDate: 'N/A',
      expiryDate: 'N/A',
      trainer: 'Jane Smith'
    };

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black italic">ATHLETE COMMAND</h1>
            <p className="text-white/40 mt-1 uppercase tracking-[0.2em] text-xs">Personal arena portal for {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={memberProfile.status === 'Active' ? 'success' : 'danger'}>Membership {memberProfile.status}</Badge>
            <div className="text-right">
              <p className="text-xs text-white/40 uppercase font-bold">Local Time</p>
              <p className="text-sm font-bold">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Neon digital membership card */}
          <div className="lg:col-span-2">
            <div className="relative glass border border-white/10 rounded-3xl p-8 overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/0 shadow-2xl flex flex-col justify-between h-[300px] group hover:border-brand/20 transition-all duration-500">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 rounded-full blur-[80px] group-hover:bg-brand/10 transition-all duration-500 pointer-events-none" />
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-black tracking-[0.25em] text-brand uppercase italic">TITAN GOLD CLUB</h3>
                  <p className="text-[10px] text-white/30 uppercase mt-0.5">Status: Authorized Athlete</p>
                </div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center neon-glow">
                  <Zap size={22} className="text-brand" />
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Athlete Name</p>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mt-1">{user?.name}</h2>
                  <div className="flex gap-6 mt-4">
                    <div>
                      <p className="text-[9px] text-white/30 uppercase font-bold">Athlete ID</p>
                      <p className="text-xs font-mono font-bold mt-0.5 text-white/70">{memberProfile.id}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/30 uppercase font-bold">Level Plan</p>
                      <p className="text-xs font-bold mt-0.5 text-brand">{memberProfile.plan}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/30 uppercase font-bold">Expires</p>
                      <p className="text-xs font-mono font-bold mt-0.5 text-white/70">{memberProfile.expiryDate}</p>
                    </div>
                  </div>
                </div>

                {/* Mock QR Code widget */}
                <div className="flex flex-col items-center gap-1.5 bg-white p-2.5 rounded-2xl shadow-lg shadow-brand/10 border border-brand/20 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-20 h-20 bg-surface flex flex-wrap items-center justify-center p-1 rounded-lg">
                    {/* Retro-futuristic mock QR elements */}
                    <div className="grid grid-cols-4 gap-1 w-full h-full">
                      <div className="bg-white rounded-sm" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-transparent" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-transparent" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-transparent" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-transparent" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-transparent" />
                      <div className="bg-white rounded-sm" />
                    </div>
                  </div>
                  <p className="text-[7px] text-surface font-mono font-bold uppercase tracking-wider">MEMBER PASS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Self Check-in Widget */}
          <Card title="Attendance Desk" subtitle="Instant facility check-in">
            <div className="mt-6 flex flex-col justify-center items-center text-center p-4 border border-white/5 bg-white/[0.02] rounded-2xl">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${activeSession ? 'bg-green-500/10 text-green-500 animate-pulse' : 'bg-brand/10 text-brand'}`}>
                <Activity size={24} />
              </div>
              
              <h4 className="text-base font-bold">{activeSession ? 'Active Session Live' : 'Not Checked In'}</h4>
              <p className="text-xs text-white/40 mt-1 max-w-[200px]">
                {activeSession 
                  ? `Checked in at ${activeSession.checkIn}. Have an excellent workout!` 
                  : 'Arrived at the gym? Check in below to log your session.'}
              </p>

              {activeSession ? (
                <Button 
                  onClick={handleSelfCheckOut} 
                  variant="outline" 
                  className="w-full mt-6 bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                >
                  <LogOut size={16} /> End Session (Checkout)
                </Button>
              ) : (
                <Button 
                  onClick={handleSelfCheckIn} 
                  className="w-full mt-6 neon-glow"
                  isLoading={loading}
                >
                  <UserCheck size={16} /> Check In Now
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Member routine and diet shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2" title="My Active Regimen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Workout shortcut */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between group hover:border-brand/20 transition-all duration-300">
                <div>
                  <div className="p-3 bg-brand/10 text-brand w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                    <Dumbbell size={20} />
                  </div>
                  <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Workout Schedule</h4>
                  <h3 className="text-xl font-bold mt-1 uppercase italic">{workoutPlans[0]?.name || 'Routine Unassigned'}</h3>
                  <p className="text-xs text-white/40 mt-2">{workoutPlans[0]?.level || 'N/A'} • {workoutPlans[0]?.exercises.length || 0} Heavy Exercises</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-xs text-white/30">Assigned Coach: {memberProfile.trainer}</span>
                  <Badge variant="brand">Active</Badge>
                </div>
              </div>

              {/* Diet shortcut */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between group hover:border-brand/20 transition-all duration-300">
                <div>
                  <div className="p-3 bg-yellow-500/10 text-yellow-500 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                    <Utensils size={20} />
                  </div>
                  <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Nutrition Arsenal</h4>
                  <h3 className="text-xl font-bold mt-1 uppercase italic">{dietPlans[0]?.name || 'Diet Unassigned'}</h3>
                  <p className="text-xs text-white/40 mt-2">Target Calories: {dietPlans[0]?.calories || 0} kcal • High Protein</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-xs text-white/30">Macros: {dietPlans[0]?.macros?.protein || '40%'} Pro</span>
                  <Badge variant="brand">Active</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Roster detail */}
          <Card title="Trainer Information">
            <div className="mt-6 flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(memberProfile.trainer)}`} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-sm">{memberProfile.trainer}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Assigned Fitness Coach</p>
                <p className="text-xs text-brand font-bold mt-2 hover:underline cursor-pointer">Message Trainer</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ------------------ 2. ADMIN & TRAINER VISUAL DASHBOARDS ------------------
  const isTrainer = user?.role === 'trainer';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase">{isTrainer ? 'COACH HUB' : 'COMMAND CENTER'}</h1>
          <p className="text-white/40 mt-1 uppercase tracking-[0.2em] text-xs">
            {isTrainer ? `Roster Overview for Coach ${user?.name}` : `Performance Overview for ${user?.name}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="brand" className="px-4 py-2">System Live</Badge>
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase font-bold">Current Date</p>
            <p className="text-sm font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={isTrainer ? "My Trainees" : "Total Members"} value={stats.totalMembers} icon={Users} trend="up" trendValue="+12%" />
        <StatCard title="Active Members" value={stats.activeMembers} icon={UserCheck} trend="up" trendValue="+5%" />
        <StatCard 
          title={isTrainer ? "Coach Rating" : "Trainers"} 
          value={isTrainer ? `${stats.totalTrainers.toFixed(1)} ★` : stats.totalTrainers} 
          icon={UserSquare2} 
        />
        <StatCard 
          title={isTrainer ? "Roster Revenue" : "Total Revenue"} 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend="up" 
          trendValue="+18%" 
          isBrand={!isTrainer}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2" title={isTrainer ? "Trainee Activity" : "Revenue Overview"} subtitle={isTrainer ? "Aggregated trainee metrics" : "Monthly earnings report"}>
          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4ff00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d4ff00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff40', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff40', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1e1e', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#d4ff00" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Growth Chart */}
        <Card title="Attendance" subtitle="Weekly distribution">
          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.attendance}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff40', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ 
                    backgroundColor: '#1e1e1e', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {charts.attendance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#d4ff00' : '#ffffff20'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic lower dashboard modules */}
        {isTrainer ? (
          /* Trainer-scoped recent roster check-ins */
          <Card title="Recent Trainee Check-Ins">
            <div className="space-y-4 mt-6">
              {attendance.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold text-sm">
                      {log.memberName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{log.memberName}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{log.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-green-500">Check In: {log.checkIn}</p>
                    <p className="text-[10px] text-white/30">{log.checkOut === '--:--' ? 'Active Session' : `Checked Out: ${log.checkOut}`}</p>
                  </div>
                </div>
              ))}
              {attendance.length === 0 && (
                <p className="text-white/30 italic text-center py-4">No recent trainee attendance logged</p>
              )}
            </div>
          </Card>
        ) : (
          /* Admin-scoped payment cards */
          <Card title="Recent Payments">
            <div className="space-y-4 mt-6">
              {payments.slice(0, 5).map((pay) => (
                <div key={pay.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{pay.memberName}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{pay.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand italic">₹{pay.amount}</p>
                    <p className="text-[10px] text-white/30">{pay.method}</p>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <p className="text-white/30 italic text-center py-4">No recent payments logged</p>
              )}
            </div>
          </Card>
        )}

        <Card title={isTrainer ? "My Athlete Roster" : "New Members"}>
          <div className="space-y-4 mt-6">
            {members.slice(0, 5).map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{member.name}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Joined {member.joinDate}</p>
                  </div>
                </div>
                <Badge variant={member.status === 'Active' ? 'success' : 'danger'}>{member.status}</Badge>
              </div>
            ))}
            {members.length === 0 && (
              <p className="text-white/30 italic text-center py-4">No registered members yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
