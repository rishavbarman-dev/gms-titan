import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Star, Mail, Phone, Trash2, Clock, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import { Card, Input } from '../components/ui/Input';
import { Badge, Modal } from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { 
  fetchTrainers, 
  createTrainer, 
  removeTrainer 
} from '../features/gym/gymSlice';

const TrainerCard = ({ trainer, onDelete, onViewProfile }) => {
  const { user } = useSelector(state => state.auth);
  
  return (
    <Card className="relative group overflow-hidden">
      {user?.role === 'admin' && (
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onDelete(trainer.id)}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500 cursor-pointer"
            title="Terminate Contract"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
      
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-brand/20 p-1 bg-white/5 mb-4">
          <img 
            src={trainer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trainer.name)}`} 
            alt={trainer.name} 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <h3 className="text-xl font-bold uppercase italic">{trainer.name}</h3>
        <p className="text-brand text-xs font-black tracking-widest uppercase mt-1">{trainer.specialization}</p>

        <div className="grid grid-cols-3 w-full gap-4 mt-8 pt-6 border-t border-white/5">
          <div className="text-center">
            <p className="text-white/40 text-[10px] uppercase font-bold">Experience</p>
            <p className="text-sm font-bold mt-1">{trainer.experience}</p>
          </div>
          <div className="text-center border-x border-white/5 px-2">
            <p className="text-white/40 text-[10px] uppercase font-bold">Clients</p>
            <p className="text-sm font-bold mt-1">{trainer.members}</p>
          </div>
          <div className="text-center">
            <p className="text-white/40 text-[10px] uppercase font-bold">Rating</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star size={12} className="fill-brand text-brand" />
              <p className="text-sm font-bold">{trainer.rating}</p>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 mt-8">
          <a href={`mailto:${trainer.email}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              <Mail size={16} />
            </Button>
          </a>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => toast.success(`Contacting Coach Hotline (+91 9988776655)...`)}
          >
            <Phone size={16} />
          </Button>
        </div>
        
        <Button 
          className="w-full mt-3 py-2.5 text-xs"
          onClick={() => onViewProfile(trainer)}
        >
          View Profile
        </Button>
      </div>
    </Card>
  );
};

const TrainersPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { trainers, loading } = useSelector(state => state.gym);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: 'Bodybuilding',
    experience: '3 years'
  });

  useEffect(() => {
    dispatch(fetchTrainers());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteTrigger = (id) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const result = await dispatch(removeTrainer(deleteTargetId));
    setDeleteTargetId(null);
    if (removeTrainer.fulfilled.match(result)) {
      toast.success('Trainer record removed successfully');
    } else {
      toast.error(result.payload || 'Failed to remove trainer');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createTrainer(formData));
    if (createTrainer.fulfilled.match(result)) {
      toast.success('Trainer hired and onboarded successfully!');
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        specialization: 'Bodybuilding',
        experience: '3 years'
      });
    } else {
      toast.error(result.payload || 'Failed to onboard trainer');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic">ELITE SQUAD</h1>
          <p className="text-white/40 mt-1 uppercase tracking-[0.2em] text-xs">Certified experts driving results</p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Hire Trainer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {trainers.map((trainer) => (
          <TrainerCard 
            key={trainer.id} 
            trainer={trainer} 
            onDelete={handleDeleteTrigger} 
            onViewProfile={setSelectedTrainer} 
          />
        ))}
        {trainers.length === 0 && (
          <p className="text-white/30 italic col-span-full text-center py-12">No trainers currently listed</p>
        )}
      </div>

      {/* Hire Trainer Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Hire Expert Trainer"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input 
            label="Trainer Name" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Trainer's Full Name" 
            required 
          />
          <Input 
            label="Email Address" 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="trainer@titan.com" 
            required 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/60 ml-1">Specialization</label>
              <select 
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="input-field appearance-none bg-surface-lighter w-full"
              >
                <option value="Bodybuilding">Bodybuilding</option>
                <option value="Cardio & HIIT">Cardio & HIIT</option>
                <option value="Yoga & Mobility">Yoga & Mobility</option>
                <option value="Powerlifting">Powerlifting</option>
              </select>
            </div>
            
            <Input 
              label="Experience" 
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="e.g. 5 years" 
              required 
            />
          </div>

          <Button type="submit" isLoading={loading} className="w-full mt-6">
            Hire & Onboard
          </Button>
        </form>
      </Modal>

      {/* Trainer Detail Modal */}
      <Modal 
        isOpen={selectedTrainer !== null} 
        onClose={() => setSelectedTrainer(null)}
        title="Trainer Profile Archive"
      >
        {selectedTrainer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-brand/20 p-1 bg-white/5">
                <img 
                  src={selectedTrainer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedTrainer.name)}`} 
                  alt="" 
                  className="w-full h-full object-cover rounded-xl" 
                />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase italic text-white">{selectedTrainer.name}</h3>
                <p className="text-brand text-xs font-black tracking-widest uppercase mt-1">
                  {selectedTrainer.specialization}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="brand">{selectedTrainer.experience}</Badge>
                  <div className="flex items-center gap-1 text-xs text-white/70 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    <Star size={10} className="fill-brand text-brand" />
                    <span className="font-bold">{selectedTrainer.rating} Rating</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-brand tracking-widest">Active Schedule & Availability</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between">
                  <span className="text-white/40">Mon - Fri:</span>
                  <span className="font-bold">06:00 AM - 02:00 PM</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between">
                  <span className="text-white/40">Saturday:</span>
                  <span className="font-bold">08:00 AM - 12:00 PM</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/5">
              <Button 
                variant="outline" 
                className="w-full text-xs" 
                onClick={() => toast.success(`Calling hotline for Coach ${selectedTrainer.name}...`)}
              >
                Call Hotline
              </Button>
              <a href={`mailto:${selectedTrainer.email}`} className="w-full">
                <Button className="w-full text-xs">
                  Direct Message
                </Button>
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Terminate Coach Contract"
        message="Are you sure you want to terminate this trainer's professional contract? This action will permanently remove their records from active coaching rosters."
        confirmText="Terminate"
        loading={loading}
      />
    </div>
  );
};

export default TrainersPage;
