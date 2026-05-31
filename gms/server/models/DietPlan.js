import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  time: { type: String, required: true },
  menu: { type: String, required: true }
});

const DietPlanSchema = new mongoose.Schema({
  id: { type: String }, // support migrating local custom id
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  macros: {
    protein: { type: String, default: '40%' },
    carbs: { type: String, default: '30%' },
    fat: { type: String, default: '30%' }
  },
  meals: [MealSchema]
});

export default mongoose.model('DietPlan', DietPlanSchema);
