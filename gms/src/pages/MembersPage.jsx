import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Search, Filter, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import { Card, Input } from '../components/ui/Input';
import Table from '../components/ui/Table';
import { Badge, Modal } from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { 
  fetchMembers, 
  createMember, 
  editMember, 
  removeMember,
  fetchTrainers
} from '../features/gym/gymSlice';

const MembersPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { members, trainers, loading } = useSelector(state => state.gym);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Basic',
    trainer: '',
    status: 'Active'
  });

  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchTrainers());
  }, [dispatch]);

  // Set default trainer when trainers are loaded
  useEffect(() => {
    if (trainers.length > 0 && !formData.trainer) {
      setFormData(prev => ({ ...prev, trainer: trainers[0].name }));
    }
  }, [trainers, formData.trainer]);

  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.phone && m.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.plan && m.plan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.trainer && m.trainer.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesTab = activeTab === 'All' || m.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleDeleteTrigger = (id) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const result = await dispatch(removeMember(deleteTargetId));
    setDeleteTargetId(null);
    if (removeMember.fulfilled.match(result)) {
      toast.success('Member deleted successfully');
    } else {
      toast.error(result.payload || 'Failed to delete member');
    }
  };

  const handleOpenAddModal = () => {
    setEditMode(false);
    setSelectedMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      plan: 'Basic',
      trainer: trainers.length > 0 ? trainers[0].name : 'John Doe',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setEditMode(true);
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      plan: member.plan,
      trainer: member.trainer,
      status: member.status
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please enter name and email');
      return;
    }

    if (editMode && selectedMember) {
      // Edit
      const result = await dispatch(editMember({ id: selectedMember.id, memberData: formData }));
      if (editMember.fulfilled.match(result)) {
        toast.success('Membership updated successfully!');
        setIsModalOpen(false);
      } else {
        toast.error(result.payload || 'Failed to update member');
      }
    } else {
      // Create
      const result = await dispatch(createMember(formData));
      if (createMember.fulfilled.match(result)) {
        toast.success('New member registered successfully!');
        setIsModalOpen(false);
      } else {
        toast.error(result.payload || 'Registration failed');
      }
    }
  };

  const columns = [
    {
      header: 'Member Details',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <img src={row.avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-bold">{row.name}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">{row.email}</p>
          </div>
        </div>
      )
    },
    { header: 'Join Date', accessor: 'joinDate' },
    { 
      header: 'Plan', 
      render: (row) => (
        <Badge variant="brand">{row.plan}</Badge>
      )
    },
    { header: 'Trainer', accessor: 'trainer' },
    { 
      header: 'Status', 
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'danger'}>{row.status}</Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenEditModal(row)}
            className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => handleDeleteTrigger(row.id)}
            className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/60 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const tableColumns = user?.role === 'admin' 
    ? columns 
    : columns.filter(c => c.header !== 'Actions');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic">MEMBERSHIP ROSTER</h1>
          <p className="text-white/40 mt-1 uppercase tracking-[0.2em] text-xs">Manage your athletes and their progress</p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={handleOpenAddModal}>
            <Plus size={20} />
            Add Member
          </Button>
        )}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email, plan, phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand/50 w-full md:w-80 transition-all"
              />
            </div>
            {/* Status Tab Filters */}
            <div className="flex rounded-xl bg-white/[0.02] border border-white/5 p-1 w-fit">
              {['All', 'Active', 'Inactive'].map((tab) => (
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={16} />
              Filter
            </Button>
          </div>
        </div>
        <Table columns={tableColumns} data={filteredMembers} />
      </Card>

      {/* Register / Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editMode ? "Modify Membership" : "Register New Member"}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input 
            label="Full Name" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="John Doe" 
            required 
          />
          <Input 
            label="Email Address" 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com" 
            required 
            disabled={editMode}
          />
          <Input 
            label="Phone" 
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 555-0000" 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/60 ml-1">Plan Tier</label>
              <select 
                name="plan"
                value={formData.plan}
                onChange={handleInputChange}
                className="input-field appearance-none bg-surface-lighter w-full"
              >
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Elite">Elite</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/60 ml-1">Assigned Trainer</label>
              <select 
                name="trainer"
                value={formData.trainer}
                onChange={handleInputChange}
                className="input-field appearance-none bg-surface-lighter w-full"
              >
                {trainers.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
                {trainers.length === 0 && <option value="John Doe">John Doe</option>}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/60 ml-1">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-field appearance-none bg-surface-lighter w-full"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <Button type="submit" isLoading={loading} className="w-full mt-6">
            {editMode ? "Save Changes" : "Create Membership"}
          </Button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Termination"
        message="Are you sure you want to terminate this user's gym membership? This action will permanently remove their records from active rosters."
        confirmText="Terminate"
        loading={loading}
      />
    </div>
  );
};

export default MembersPage;
