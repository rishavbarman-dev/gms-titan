import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Utensils, 
  Flame, 
  Droplets, 
  Beef, 
  Wheat,
  Plus,
  Clock,
  Trash2,
  Minus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Badge, Modal } from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { 
  fetchDietPlans, 
  createDietPlan, 
  deleteDietPlan 
} from '../features/gym/gymSlice';

const DietPlans = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { dietPlans, loading } = useSelector(state => state.gym);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    calories: 2000,
    protein: '150g',
    carbs: '200g',
    fat: '70g'
  });

  const [meals, setMeals] = useState([
    { time: 'Breakfast', menu: '' },
    { time: 'Lunch', menu: '' },
    { time: 'Dinner', menu: '' }
  ]);

  // Dynamic Water Intake state tracking with localStorage persistence per user and daily reset
  const todayStr = new Date().toISOString().split('T')[0];
  const waterIntakeKey = `water_intake_${user?.id || 'guest'}_${todayStr}`;
  const waterTargetKey = `water_target_${user?.id || 'guest'}`;

  const [waterIntake, setWaterIntake] = useState(() => {
    const saved = localStorage.getItem(waterIntakeKey);
    return saved ? parseFloat(saved) : 2.5;
  });

  const [waterTarget, setWaterTarget] = useState(() => {
    const saved = localStorage.getItem(waterTargetKey);
    return saved ? parseFloat(saved) : 4.0;
  });

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(waterTarget.toString());

  useEffect(() => {
    setTempTarget(waterTarget.toString());
  }, [waterTarget]);

  const handleLogWater = (amount) => {
    const newIntake = Math.max(0, parseFloat((waterIntake + amount).toFixed(2)));
    setWaterIntake(newIntake);
    localStorage.setItem(waterIntakeKey, newIntake.toString());
    if (amount > 0) {
      toast.success(`Water logged (+${Math.round(amount * 1000)}ml)`);
    } else {
      toast.success(`Water removed (-${Math.round(Math.abs(amount) * 1000)}ml)`);
    }
  };

  const handleSaveTarget = () => {
    const parsed = parseFloat(tempTarget);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error('Please enter a valid target');
      return;
    }
    setWaterTarget(parsed);
    localStorage.setItem(waterTargetKey, parsed.toString());
    setIsEditingTarget(false);
    toast.success(`Daily target updated to ${parsed.toFixed(1)}L`);
  };

  const percentage = waterTarget > 0 ? Math.min(100, Math.round((waterIntake / waterTarget) * 100)) : 0;

  useEffect(() => {
    dispatch(fetchDietPlans());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  const addMealRow = () => {
    setMeals(prev => [...prev, { time: 'Snack', menu: '' }]);
  };

  const removeMealRow = (index) => {
    if (meals.length === 1) return;
    setMeals(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteTrigger = (id) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const result = await dispatch(deleteDietPlan(deleteTargetId));
    setDeleteTargetId(null);
    if (deleteDietPlan.fulfilled.match(result)) {
      toast.success('Diet plan deleted successfully');
    } else {
      toast.error(result.payload || 'Failed to delete diet plan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validMeals = meals.filter(m => m.menu.trim() !== '');
    if (validMeals.length === 0) {
      toast.error('Please enter menu items for at least one meal');
      return;
    }

    const payload = {
      name: formData.name,
      calories: parseInt(formData.calories) || 2000,
      macros: {
        protein: formData.protein,
        carbs: formData.carbs,
        fat: formData.fat
      },
      meals: validMeals
    };

    const result = await dispatch(createDietPlan(payload));
    if (createDietPlan.fulfilled.match(result)) {
      toast.success('New diet plan logged successfully!');
      setIsModalOpen(false);
      setFormData({
        name: '',
        calories: '',
        protein: '40%',
        carbs: '30%',
        fat: '30%'
      });
      setMeals([
        { time: 'Breakfast', menu: '' },
        { time: 'Lunch', menu: '' },
        { time: 'Dinner', menu: '' }
      ]);
    } else {
      toast.error(result.payload || 'Failed to create diet plan');
    }
  };

  const isMember = user?.role === 'member';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic">FUEL SYSTEM</h1>
          <p className="text-white/40 mt-1 uppercase tracking-[0.2em] text-xs">Precision nutrition for peak results</p>
        </div>
        {!isMember && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Create Diet Plan
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {dietPlans.map((plan) => (
            <Card key={plan.id} title={plan.name} subtitle="Optimized for muscle maintenance" className="relative group">
              {!isMember && (
                <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDeleteTrigger(plan.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors cursor-pointer"
                    title="Delete Plan"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-brand/5 p-4 rounded-2xl border border-brand/10">
                  <div className="flex items-center gap-2 text-brand mb-2">
                    <Flame size={16} />
                    <span className="text-[10px] font-black uppercase">Calories</span>
                  </div>
                  <p className="text-2xl font-black italic">{plan.calories}</p>
                </div>
                <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                  <div className="flex items-center gap-2 text-blue-500 mb-2">
                    <Beef size={16} />
                    <span className="text-[10px] font-black uppercase">Protein</span>
                  </div>
                  <p className="text-2xl font-black italic">{plan.macros.protein}</p>
                </div>
                <div className="bg-yellow-500/5 p-4 rounded-2xl border border-yellow-500/10">
                  <div className="flex items-center gap-2 text-yellow-500 mb-2">
                    <Wheat size={16} />
                    <span className="text-[10px] font-black uppercase">Carbs</span>
                  </div>
                  <p className="text-2xl font-black italic">{plan.macros.carbs}</p>
                </div>
                <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                  <div className="flex items-center gap-2 text-red-500 mb-2">
                    <Droplets size={16} />
                    <span className="text-[10px] font-black uppercase">Fats</span>
                  </div>
                  <p className="text-2xl font-black italic">{plan.macros.fat}</p>
                </div>
              </div>

              <div className="mt-10 space-y-6">
                <p className="text-xs font-black uppercase tracking-widest text-white/40 italic">Daily Schedule</p>
                <div className="space-y-4">
                  {plan.meals.map((meal, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                      <div className="p-3 rounded-xl bg-white/5 text-white/40 group-hover:text-brand transition-colors">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-brand font-black uppercase tracking-[0.2em] mb-1">{meal.time}</p>
                        <p className="font-bold">{meal.menu}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
          {dietPlans.length === 0 && (
            <p className="text-white/30 italic text-center py-12 bg-white/5 rounded-3xl border border-white/5">No diet plans logged</p>
          )}
        </div>

        <div className="space-y-8">
          <Card title="Quick Macros">
            <div className="space-y-6 mt-6">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-bold inline-block text-brand uppercase">Water Intake</span>
                  </div>
                  <div className="text-right">
                    {isEditingTarget ? (
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          step="0.1" 
                          min="0.5" 
                          max="10"
                          value={tempTarget} 
                          onChange={(e) => setTempTarget(e.target.value)}
                          className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-center text-xs font-bold text-brand focus:outline-none focus:border-brand"
                        />
                        <button 
                          onClick={handleSaveTarget}
                          className="text-[10px] bg-brand text-black px-1.5 py-0.5 rounded font-black uppercase cursor-pointer hover:bg-brand/80"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span 
                        className="text-xs font-black inline-block text-brand cursor-pointer hover:underline"
                        onClick={() => setIsEditingTarget(true)}
                        title="Click to edit daily target"
                      >
                        {waterIntake.toFixed(1)} / {waterTarget.toFixed(1)} L
                      </span>
                    )}
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-white/5">
                  <div style={{ width: `${percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand transition-all duration-300"></div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handleLogWater(0.25)}
                  >
                    <Plus size={14} className="mr-1 inline" /> 250ml
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handleLogWater(0.5)}
                  >
                    <Plus size={14} className="mr-1 inline" /> 500ml
                  </Button>
                </div>
                <div className="flex gap-2 justify-between items-center text-xs text-white/30">
                  <span>Stay hydrated for optimal performance and recovery.</span>
                  {waterIntake > 0 && (
                    <button 
                      type="button"
                      onClick={() => handleLogWater(-0.25)}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold transition-colors whitespace-nowrap flex items-center gap-0.5 bg-transparent border-0 p-0 cursor-pointer"
                    >
                      <Minus size={10} /> 250ml
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Supplements">
            <div className="space-y-4 mt-6">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-sm font-bold">Whey Isolate</span>
                <Badge variant="brand">2 Scoops</Badge>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-sm font-bold">Creatine Monohydrate</span>
                <Badge variant="brand">5g</Badge>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-sm font-bold">Multivitamins</span>
                <Badge variant="brand">1 Tab</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create Nutrition Plan"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input 
            label="Plan Name" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. High Protein Bulk" 
            required 
          />
          <Input 
            label="Target Calories (kcal)" 
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleInputChange}
            placeholder="e.g. 2800" 
            required 
            min="0"
          />

          <div className="grid grid-cols-3 gap-2">
            <Input 
              label="Protein (%)" 
              name="protein"
              value={formData.protein}
              onChange={handleInputChange}
              placeholder="40%" 
              required 
            />
            <Input 
              label="Carbs (%)" 
              name="carbs"
              value={formData.carbs}
              onChange={handleInputChange}
              placeholder="30%" 
              required 
            />
            <Input 
              label="Fat (%)" 
              name="fat"
              value={formData.fat}
              onChange={handleInputChange}
              placeholder="30%" 
              required 
            />
          </div>

          <div className="border-t border-white/10 pt-4 mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-white/40">Meals Schedule</label>
              <Button type="button" variant="outline" size="sm" onClick={addMealRow} className="gap-1 px-2.5 py-1 text-xs">
                <Plus size={14} /> Add Meal
              </Button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {meals.map((meal, index) => (
                <div key={index} className="flex gap-2 items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-24">
                    <input 
                      type="text"
                      value={meal.time}
                      onChange={(e) => handleMealChange(index, 'time', e.target.value)}
                      placeholder="e.g. Breakfast" 
                      className="bg-transparent text-sm w-full outline-none border-b border-white/10 focus:border-brand/40 py-1 font-bold text-brand"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text"
                      value={meal.menu}
                      onChange={(e) => handleMealChange(index, 'menu', e.target.value)}
                      placeholder="e.g. Oats with milk & protein" 
                      className="bg-transparent text-sm w-full outline-none border-b border-white/10 focus:border-brand/40 py-1"
                      required
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeMealRow(index)}
                    className="p-1 text-red-500 hover:bg-white/5 rounded-lg"
                    disabled={meals.length === 1}
                  >
                    <Minus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" isLoading={loading} className="w-full mt-6">
            Log Plan
          </Button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Diet Plan"
        message="Are you sure you want to delete this precision nutrition diet plan? This will permanently remove this preset from the athlete diet library."
        confirmText="Delete"
        loading={loading}
      />
    </div>
  );
};

export default DietPlans;
