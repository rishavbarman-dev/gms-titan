import { subDays, format, subMonths } from 'date-fns';

const USERS = [
  { id: '1', name: 'Admin User', email: 'admin@titan.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
  { id: '2', name: 'John Trainer', email: 'john@titan.com', role: 'trainer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  { id: '3', name: 'Sarah Member', email: 'sarah@titan.com', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
];

const TRAINERS = [
  { id: 't1', name: 'John Doe', email: 'john@titan.com', specialization: 'Bodybuilding', experience: '8 years', rating: 4.8, members: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  { id: 't2', name: 'Jane Smith', email: 'jane@titan.com', specialization: 'Yoga & Pilates', experience: '5 years', rating: 4.9, members: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
  { id: 't3', name: 'Mike Ross', email: 'mike@titan.com', specialization: 'CrossFit', experience: '6 years', rating: 4.7, members: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
  { id: 't4', name: 'Elena Gilbert', email: 'elena@titan.com', specialization: 'Zumba', experience: '4 years', rating: 4.6, members: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
  { id: 't5', name: 'David Gandy', email: 'david@titan.com', specialization: 'Powerlifting', experience: '10 years', rating: 5.0, members: 20, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
];

const PLANS = [
  { id: 'p1', name: 'Basic', price: 29, duration: '1 Month', features: ['Gym Access', 'Locker Room'] },
  { id: 'p2', name: 'Pro', price: 79, duration: '3 Months', features: ['Gym Access', 'Locker Room', 'Group Classes'] },
  { id: 'p3', name: 'Elite', price: 250, duration: '12 Months', features: ['Gym Access', 'Locker Room', 'Group Classes', 'Personal Trainer'] },
];

const MEMBERS = Array.from({ length: 25 }).map((_, i) => ({
  id: `m${i + 1}`,
  name: `Member ${i + 1}`,
  email: `member${i + 1}@example.com`,
  phone: `+1 555-010${i}`,
  joinDate: format(subDays(new Date(), Math.floor(Math.random() * 365)), 'yyyy-MM-dd'),
  plan: PLANS[Math.floor(Math.random() * PLANS.length)].name,
  expiryDate: format(subDays(new Date(), -Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
  trainer: TRAINERS[Math.floor(Math.random() * TRAINERS.length)].name,
  status: Math.random() > 0.2 ? 'Active' : 'Inactive',
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Member${i + 1}`,
}));

const PAYMENTS = Array.from({ length: 40 }).map((_, i) => ({
  id: `pay${i + 1}`,
  memberId: `m${Math.floor(Math.random() * 25) + 1}`,
  memberName: MEMBERS[Math.floor(Math.random() * 25)].name,
  amount: [29, 79, 250][Math.floor(Math.random() * 3)],
  date: format(subDays(new Date(), Math.floor(Math.random() * 90)), 'yyyy-MM-dd'),
  method: ['Credit Card', 'PayPal', 'Cash'][Math.floor(Math.random() * 3)],
  status: Math.random() > 0.1 ? 'Paid' : 'Pending',
}));

const ATTENDANCE = Array.from({ length: 60 }).map((_, i) => ({
  id: `att${i + 1}`,
  memberId: `m${Math.floor(Math.random() * 25) + 1}`,
  memberName: MEMBERS[Math.floor(Math.random() * 25)].name,
  date: format(subDays(new Date(), Math.floor(Math.random() * 15)), 'yyyy-MM-dd'),
  checkIn: '08:00 AM',
  checkOut: '09:30 AM',
  status: 'Present',
}));

const ANALYTICS = {
  revenue: [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
  ],
  growth: [
    { name: 'Week 1', value: 20 },
    { name: 'Week 2', value: 45 },
    { name: 'Week 3', value: 38 },
    { name: 'Week 4', value: 65 },
  ],
  attendance: [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 48 },
    { name: 'Thu', value: 61 },
    { name: 'Fri', value: 55 },
    { name: 'Sat', value: 40 },
    { name: 'Sun', value: 30 },
  ]
};

const WORKOUT_PLANS = [
  {
    id: 'wp1',
    name: 'Mass Gainer',
    level: 'Advanced',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 8 },
      { name: 'Bench Press', sets: 4, reps: 10 },
      { name: 'Squats', sets: 4, reps: 12 },
    ]
  },
  {
    id: 'wp2',
    name: 'Fat Shredder',
    level: 'Intermediate',
    exercises: [
      { name: 'Burpees', sets: 3, reps: 20 },
      { name: 'Mountain Climbers', sets: 3, reps: 30 },
      { name: 'Plank', sets: 3, reps: '60s' },
    ]
  }
];

const DIET_PLANS = [
  {
    id: 'dp1',
    name: 'High Protein',
    calories: 2500,
    macros: { protein: '40%', carbs: '30%', fat: '30%' },
    meals: [
      { time: 'Breakfast', menu: 'Oatmeal with Protein Powder' },
      { time: 'Lunch', menu: 'Grilled Chicken with Quinoa' },
      { time: 'Dinner', menu: 'Salmon with Asparagus' },
    ]
  }
];

export { USERS, TRAINERS, PLANS, MEMBERS, PAYMENTS, ATTENDANCE, ANALYTICS, WORKOUT_PLANS, DIET_PLANS };
