import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  DollarSign, 
  Download, 
  CreditCard, 
  ArrowUpRight,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Input } from '../components/ui/Input';
import Table from '../components/ui/Table';
import { Badge, Modal } from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { 
  fetchPayments, 
  createPayment, 
  fetchMembers 
} from '../features/gym/gymSlice';

const PaymentsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { payments, members, loading } = useSelector(state => state.gym);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New transaction form state
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    method: 'Credit Card',
    status: 'Paid'
  });

  useEffect(() => {
    dispatch(fetchPayments());
    dispatch(fetchMembers());
  }, [dispatch]);

  // Set default member in dropdown
  useEffect(() => {
    if (members.length > 0 && !formData.memberId) {
      setFormData(prev => ({ ...prev, memberId: members[0].id }));
    }
  }, [members, formData.memberId]);

  const isMember = user?.role === 'member';

  // Compute Stats
  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const outstanding = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payments.filter(p => p.status === 'Pending').length;
  const activePlansCount = members.filter(m => m.status === 'Active').length;

  // Resolve personal member details if they are a member
  const memberProfile = isMember 
    ? members.find(m => m.email === user.email) 
    : null;

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.amount).toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTab = activeTab === 'All' || p.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!formData.memberId || !formData.amount) {
      toast.error('All fields are required');
      return;
    }

    const result = await dispatch(createPayment(formData));
    if (createPayment.fulfilled.match(result)) {
      toast.success('Transaction logged successfully!');
      setIsModalOpen(false);
      setFormData({
        memberId: members.length > 0 ? members[0].id : '',
        amount: '',
        method: 'Credit Card',
        status: 'Paid'
      });
    } else {
      toast.error(result.payload || 'Failed to log transaction');
    }
  };

  const columns = [
    {
      header: 'Transaction ID',
      render: (row) => <span className="font-mono text-xs text-white/40 uppercase">{row.id}</span>
    },
    {
      header: 'Member',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand" />
          <span className="font-bold text-sm">{row.memberName}</span>
        </div>
      )
    },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Amount',
      render: (row) => <span className="font-black italic text-brand">₹{row.amount}</span>
    },
    {
      header: 'Method',
      render: (row) => (
        <div className="flex items-center gap-2 text-white/60">
          <CreditCard size={14} />
          <span className="text-xs uppercase font-bold tracking-tighter">{row.method}</span>
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'Paid' ? 'success' : 'warning'}>{row.status}</Badge>
      )
    },
    {
      header: 'Receipt',
      render: (row) => (
        <button 
          onClick={() => toast.success(`Receipt printed for transaction ${row.id}`)}
          className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
        >
          <Download size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic">{isMember ? 'MY PAYMENTS' : 'FINANCIALS'}</h1>
          <p className="text-white/40 mt-1 uppercase tracking-[0.2em] text-xs">
            {isMember ? 'Personal transaction history & subscription ledger' : 'Revenue tracking & invoices'}
          </p>
        </div>
        {!isMember && (
          <Button onClick={() => setIsModalOpen(true)}>
            <DollarSign size={20} />
            New Transaction
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-brand text-surface relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <DollarSign size={160} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            {isMember ? 'My Total Spent' : 'Total Revenue'}
          </p>
          <h2 className="text-4xl font-black italic mt-2">₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          <div className="flex items-center gap-1 text-[10px] font-bold mt-4 bg-surface/10 w-fit px-2 py-1 rounded-md">
            <ArrowUpRight size={12} />
            Computed Live
          </div>
        </Card>

        <Card className="relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            {isMember ? 'My Pending Balance' : 'Outstanding'}
          </p>
          <h2 className="text-4xl font-black italic mt-2 text-yellow-500">₹{outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          <p className="text-xs text-white/30 mt-4">
            {isMember ? 'Invoice Due Balance' : `${pendingCount} Pending Payments`}
          </p>
        </Card>

        <Card className="relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            {isMember ? 'Current Plan' : 'Subscriptions'}
          </p>
          <h2 className="text-4xl font-black italic mt-2 text-brand">
            {isMember ? (memberProfile?.plan || 'Basic') : activePlansCount}
          </h2>
          <p className="text-xs text-white/30 mt-4">
            {isMember ? `Status: ${memberProfile?.status || 'Active'}` : 'Active Plans'}
          </p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden" title={isMember ? "My Transactions Ledger" : "Transaction Ledger"}>
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                placeholder={isMember ? "Filter transactions by ID..." : "Filter by member name, method, ID..."} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand/50 w-full md:w-80 transition-all"
              />
            </div>
            {/* Status Tab Filters */}
            <div className="flex rounded-xl bg-white/[0.02] border border-white/5 p-1 w-fit">
              {['All', 'Paid', 'Pending'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab 
                      ? 'bg-brand text-white shadow-md shadow-brand/20' 
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={16} />
            Date Range
          </Button>
        </div>
        <Table columns={columns} data={filteredPayments} />
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Record New Transaction"
      >
        <form className="space-y-4" onSubmit={handleNewTransactionSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/60 ml-1">Payee Member</label>
            <select 
              name="memberId"
              value={formData.memberId}
              onChange={handleInputChange}
              className="input-field appearance-none bg-surface-lighter w-full text-sm"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
              ))}
              {members.length === 0 && <option value="">No members registered</option>}
            </select>
          </div>

          <Input 
            label="Transaction Amount (₹)" 
            type="number" 
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="e.g. 79" 
            required 
            min="0"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/60 ml-1">Payment Method</label>
              <select 
                name="method"
                value={formData.method}
                onChange={handleInputChange}
                className="input-field appearance-none bg-surface-lighter w-full"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/60 ml-1">Payment Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-field appearance-none bg-surface-lighter w-full"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <Button type="submit" isLoading={loading} className="w-full mt-6">
            Log Transaction
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentsPage;
