import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true }
});

const WorkoutPlanSchema = new mongoose.Schema({
  id: { type: String }, // support migrating local custom id
  name: { type: String, required: true },
  level: { type: String, required: true },
  exercises: [ExerciseSchema]
});

export default mongoose.model('WorkoutPlan', WorkoutPlanSchema);
