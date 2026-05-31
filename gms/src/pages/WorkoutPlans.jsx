import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Dumbbell, 
  Flame, 
  Clock, 
  ChevronRight, 
  Plus,
  Zap,
  Target,
  Trash2,
  Minus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Badge, Modal } from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { 
  fetchWorkoutPlans, 
  createWorkoutPlan, 
  deleteWorkoutPlan 
} from '../features/gym/gymSlice';

const WorkoutPlans = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { workoutPlans, loading } = useSelector(state => state.gym);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 'Intermediate',
  });
  
  // Dynamic exercises list in the form
  const [exercises, setExercises] = useState([
    { name: '', sets: 4, reps: 10 }
  ]);

  useEffect(() => {
    dispatch(fetchWorkoutPlans());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const addExerciseRow = () => {
    setExercises(prev => [...prev, { name: '', sets: 3, reps: 10 }]);
  };

  const removeExerciseRow = (index) => {
    if (exercises.length === 1) return;
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteTrigger = (id) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const result = await dispatch(deleteWorkoutPlan(deleteTargetId));
    setDeleteTargetId(null);
    if (deleteWorkoutPlan.fulfilled.match(result)) {
      toast.success('Workout plan deleted successfully');
    } else {
      toast.error(result.payload || 'Failed to delete plan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter empty exercises
    const validExercises = exercises.filter(ex => ex.name.trim() !== '');
    if (validExercises.length === 0) {
      toast.error('Please add at least one exercise');
      return;
    }

    const payload = {
      ...formData,
      exercises: validExercises
    };

    const result = await dispatch(createWorkoutPlan(payload));
    if (createWorkoutPlan.fulfilled.match(result)) {
      toast.success('New workout routine created!');
      setIsModalOpen(false);
      setFormData({ name: '', level: 'Intermediate' });
      setExercises([{ name: '', sets: 4, reps: 10 }]);
    } else {
      toast.error(result.payload || 'Failed to create plan');
    }
  };

  const isMember = user?.role === 'member';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic">WORKOUT ARSENAL</h1>
          <p className="text-white/40 mt-1 uppercase tracking-[0.2em] text-xs">Curated routines for maximum impact</p>
        </div>
        {!isMember && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Create Routine
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {workoutPlans.map((plan) => (
          <Card key={plan.id} className="relative group overflow-hidden border-white/5 hover:border-brand/20 transition-all">
            {!isMember && (
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDeleteTrigger(plan.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors cursor-pointer"
                  title="Delete Routine"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
            
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <Dumbbell size={120} />
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="brand" className="mb-4">{plan.level}</Badge>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">{plan.name}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40 uppercase font-bold tracking-[0.2em]">Intensity</p>
                <div className="flex gap-1 mt-1">
                  <Zap size={14} className="text-brand fill-brand" />
                  <Zap size={14} className="text-brand fill-brand" />
                  <Zap size={14} className="text-brand fill-brand" />
                  <Zap size={14} className="text-white/10" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 py-4 border-y border-white/5">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-white/40" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Goal</p>
                  <p className="text-xs font-bold uppercase">{plan.level === 'Advanced' ? 'Hypertrophy' : 'Endurance'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-white/40" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Duration</p>
                  <p className="text-xs font-bold uppercase">60 Min</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-white/40" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Burn</p>
                  <p className="text-xs font-bold uppercase">~450 kcal</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-white/40">Exercise Breakdown</p>
              <div className="space-y-3">
                {plan.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-sm font-bold">{ex.name}</span>
                    <span className="text-xs font-mono text-brand">{ex.sets} SETS × {ex.reps} REPS</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full mt-8 group" onClick={() => toast.success(`Starting workout session: ${plan.name}`)}>
              Start Workout <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        ))}
        {workoutPlans.length === 0 && (
          <p className="text-white/30 italic col-span-full text-center py-12">No workout plans available</p>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create Training Routine"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input 
            label="Routine Name" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Mass Gainer" 
            required 
          />
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/60 ml-1">Difficulty Level</label>
            <select 
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="input-field appearance-none bg-surface-lighter w-full"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="border-t border-white/10 pt-4 mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-white/40">Exercises Builder</label>
              <Button type="button" variant="outline" size="sm" onClick={addExerciseRow} className="gap-1 px-2.5 py-1 text-xs">
                <Plus size={14} /> Add Exercise
              </Button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {exercises.map((ex, index) => (
                <div key={index} className="flex gap-2 items-center bg-white/5 p-3 rounded-xl border border-white/5 relative">
                  <div className="flex-1">
                    <input 
                      type="text"
                      value={ex.name}
                      onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                      placeholder="Exercise Name (e.g. Squat)" 
                      className="bg-transparent text-sm w-full outline-none border-b border-white/10 focus:border-brand/40 py-1"
                      required
                    />
                  </div>
                  <div className="w-16">
                    <input 
                      type="number"
                      value={ex.sets}
                      onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 0)}
                      placeholder="Sets" 
                      className="bg-transparent text-sm text-center w-full outline-none border-b border-white/10 focus:border-brand/40 py-1"
                      required
                      min="1"
                    />
                  </div>
                  <div className="w-16">
                    <input 
                      type="text"
                      value={ex.reps}
                      onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                      placeholder="Reps" 
                      className="bg-transparent text-sm text-center w-full outline-none border-b border-white/10 focus:border-brand/40 py-1"
                      required
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeExerciseRow(index)}
                    className="p-1 text-red-500 hover:bg-white/5 rounded-lg ml-1"
                    disabled={exercises.length === 1}
                  >
                    <Minus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" isLoading={loading} className="w-full mt-6">
            Create Routine
          </Button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Workout Plan"
        message="Are you sure you want to delete this workout routine? This will permanently remove this preset from the athlete training library."
        confirmText="Delete"
        loading={loading}
      />
    </div>
  );
};

export default WorkoutPlans;
