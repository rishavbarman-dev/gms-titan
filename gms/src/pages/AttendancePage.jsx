import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  CheckCircle2, 
  Clock, 
  Search,
  ArrowRight,
  UserCheck,
  LogOut
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Input } from '../components/ui/Input';
import Table from '../components/ui/Table';
import { Badge } from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { 
  fetchAttendance, 
  checkInMember, 
  checkOutMember,
  fetchMembers
} from '../features/gym/gymSlice';

const AttendancePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { attendance, members, loading } = useSelector(state => state.gym);
  
  const [scanInput, setScanInput] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');

  useEffect(() => {
    dispatch(fetchAttendance());
    dispatch(fetchMembers());
  }, [dispatch]);

  // Set default selected member
  useEffect(() => {
    if (members.length > 0 && !selectedMemberId) {
      setSelectedMemberId(members[0].id);
    }
  }, [members, selectedMemberId]);

  const isMember = user?.role === 'member';

  // Compute stats dynamically from attendance
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAttendance = attendance.filter(log => log.date === todayStr);
  const presentCount = todaysAttendance.length;
  
  // Dynamic stats calculation
  const totalActiveMembers = members.filter(m => m.status === 'Active').length || 20;
  const absentCount = Math.max(0, totalActiveMembers - presentCount);
  const presentPercentage = Math.round((presentCount / totalActiveMembers) * 100) || 0;

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    // Check if input matches an ID or a member name
    const member = members.find(
      m => String(m.id).toLowerCase() === scanInput.trim().toLowerCase() ||
           m.name.toLowerCase().includes(scanInput.trim().toLowerCase())
    );

    const checkInData = member 
      ? { memberId: member.id }
      : { memberName: scanInput.trim() };

    const result = await dispatch(checkInMember(checkInData));
    if (checkInMember.fulfilled.match(result)) {
      toast.success(`Successfully checked in ${result.payload.memberName}!`);
      setScanInput('');
    } else {
      toast.error(result.payload || 'Check in failed');
    }
  };

  const handleManualCheckIn = async () => {
    if (!selectedMemberId) return;
    
    const result = await dispatch(checkInMember({ memberId: selectedMemberId }));
    if (checkInMember.fulfilled.match(result)) {
      toast.success(`Checked in ${result.payload.memberName}!`);
    } else {
      toast.error(result.payload || 'Check in failed');
    }
  };

  const handleCheckout = async (id) => {
    const result = await dispatch(checkOutMember(id));
    if (checkOutMember.fulfilled.match(result)) {
      toast.success('Successfully checked out athlete!');
    } else {
      toast.error(result.payload || 'Check out failed');
    }
  };

  const columns = [
    {
      header: 'Member',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold text-xs">
            {row.memberName.charAt(0)}
          </div>
          <span className="font-bold text-sm">{row.memberName}</span>
        </div>
      )
    },
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Time In', 
      render: (row) => (
        <div className="flex items-center gap-2 text-green-500">
          <Clock size={14} />
          <span className="text-sm font-medium">{row.checkIn}</span>
        </div>
      )
    },
    { 
      header: 'Time Out', 
      render: (row) => (
        <div className="flex items-center gap-2 text-white/40">
          <Clock size={14} />
          <span className="text-sm font-medium">{row.checkOut}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      render: (row) => (
        <Badge variant={row.checkOut === '--:--' ? 'brand' : 'success'}>
          {row.checkOut === '--:--' ? 'Active Session' : 'Completed'}
        </Badge>
      )
    },
    {
      header: 'Action',
      render: (row) => (
        row.checkOut === '--:--' ? (
          <button 
            onClick={() => handleCheckout(row.id)}
            className="flex items-center gap-1.5 px-3 py-1 hover:bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-brand hover:text-white transition-all uppercase"
          >
            <LogOut size={12} /> Checkout
          </button>
        ) : (
          <span className="text-xs text-white/20 italic">Done</span>
        )
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic">{isMember ? 'MY ATTENDANCE' : 'TRACKER'}</h1>
          <p className="text-white/40 mt-1 uppercase tracking-[0.2em] text-xs">
            {isMember ? 'Personal history & active facility sessions' : 'Real-time attendance & engagement'}
          </p>
        </div>
        {!isMember && (
          <form onSubmit={handleCheckInSubmit} className="flex items-center gap-4">
            <Input 
              placeholder="Scan ID or Type Name (e.g. m1)" 
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="w-64" 
            />
            <Button type="submit" isLoading={loading}>Check In</Button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {!isMember && (
          <div className="lg:col-span-1 space-y-6">
            <Card title="Today's Stats">
              <div className="space-y-6 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm">Present</span>
                  <span className="text-xl font-bold italic">{presentCount}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${presentPercentage}%` }} className="bg-brand h-full transition-all duration-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm">Absent</span>
                  <span className="text-xl font-bold italic">{absentCount}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${100 - presentPercentage}%` }} className="bg-white/10 h-full transition-all duration-500" />
                </div>
              </div>
            </Card>

            <Card title="Quick Action">
              <p className="text-sm text-white/40 mb-4">Manual entry for registered athletes.</p>
              <div className="space-y-3">
                <select 
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="input-field bg-surface-lighter text-sm"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                  ))}
                </select>
                <Button 
                  onClick={handleManualCheckIn} 
                  variant="outline" 
                  className="w-full text-xs py-2.5 flex items-center justify-center gap-1.5"
                >
                  <UserCheck size={14} /> Manual Override
                </Button>
              </div>
            </Card>
          </div>
        )}

        <Card className={`${isMember ? 'lg:col-span-4' : 'lg:col-span-3'} p-0 overflow-hidden`} title={isMember ? "My Session Ledger" : "Live History"}>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="brand">{isMember ? 'Verified Pass' : 'Real-Time'}</Badge>
              <p className="text-xs text-white/30 uppercase font-bold tracking-widest">
                {isMember ? 'Active & completed check-ins' : 'Showing latest checks'}
              </p>
            </div>
          </div>
          <Table columns={columns} data={attendance} />
        </Card>
      </div>
    </div>
  );
};

export default AttendancePage;
