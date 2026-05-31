import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Helper to format date with offset (subDays mock equivalent)
function getSubDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

// Generate the initial seed data
function getSeedData() {
  const passwordHash = '$2b$10$vtlFmaoVb/qeH1DOSoGb9eTVDcL5NfzIGxI7zGenxfcNLeNy0RqTO'; // hash of 'password123'
  
  const users = [
    { id: '1', name: 'Admin User', email: 'admin@titan.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', password: passwordHash },
    { id: '2', name: 'John Trainer', email: 'john@titan.com', role: 'trainer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', password: passwordHash },
    { id: '3', name: 'Sarah Member', email: 'sarah@titan.com', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', password: passwordHash },
  ];

  const trainers = [
    { id: 't1', name: 'John Doe', email: 'john@titan.com', specialization: 'Bodybuilding', experience: '8 years', rating: 4.8, members: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { id: 't2', name: 'Jane Smith', email: 'jane@titan.com', specialization: 'Yoga & Pilates', experience: '5 years', rating: 4.9, members: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
    { id: 't3', name: 'Mike Ross', email: 'mike@titan.com', specialization: 'CrossFit', experience: '6 years', rating: 4.7, members: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { id: 't4', name: 'Elena Gilbert', email: 'elena@titan.com', specialization: 'Zumba', experience: '4 years', rating: 4.6, members: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
    { id: 't5', name: 'David Gandy', email: 'david@titan.com', specialization: 'Powerlifting', experience: '10 years', rating: 5.0, members: 20, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  ];

  const plans = [
    { id: 'p1', name: 'Basic', price: 29, duration: '1 Month', features: ['Gym Access', 'Locker Room'] },
    { id: 'p2', name: 'Pro', price: 79, duration: '3 Months', features: ['Gym Access', 'Locker Room', 'Group Classes'] },
    { id: 'p3', name: 'Elite', price: 250, duration: '12 Months', features: ['Gym Access', 'Locker Room', 'Group Classes', 'Personal Trainer'] },
  ];

  const members = Array.from({ length: 25 }).map((_, i) => {
    const planObj = plans[Math.floor(Math.random() * plans.length)];
    const trainerObj = trainers[Math.floor(Math.random() * trainers.length)];
    return {
      id: `m${i + 1}`,
      name: `Member ${i + 1}`,
      email: `member${i + 1}@example.com`,
      phone: `+1 555-010${i}`,
      joinDate: getSubDate(Math.floor(Math.random() * 365)),
      plan: planObj.name,
      expiryDate: getSubDate(-Math.floor(Math.random() * 30)),
      trainer: trainerObj.name,
      status: Math.random() > 0.2 ? 'Active' : 'Inactive',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Member${i + 1}`,
    };
  });

  const payments = Array.from({ length: 40 }).map((_, i) => {
    const randomMember = members[Math.floor(Math.random() * members.length)];
    return {
      id: `pay${i + 1}`,
      memberId: randomMember.id,
      memberName: randomMember.name,
      amount: [29, 79, 250][Math.floor(Math.random() * 3)],
      date: getSubDate(Math.floor(Math.random() * 90)),
      method: ['Credit Card', 'PayPal', 'Cash'][Math.floor(Math.random() * 3)],
      status: Math.random() > 0.1 ? 'Paid' : 'Pending',
    };
  });

  const attendance = Array.from({ length: 60 }).map((_, i) => {
    const randomMember = members[Math.floor(Math.random() * members.length)];
    return {
      id: `att${i + 1}`,
      memberId: randomMember.id,
      memberName: randomMember.name,
      date: getSubDate(Math.floor(Math.random() * 15)),
      checkIn: '08:00 AM',
      checkOut: '09:30 AM',
      status: 'Present',
    };
  });

  const workoutPlans = [
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

  const dietPlans = [
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

  return {
    users,
    trainers,
    plans,
    members,
    payments,
    attendance,
    workoutPlans,
    dietPlans
  };
}

// Read database file
function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = getSeedData();
    writeDb(seed);
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading JSON database, recreating seed:', error);
    const seed = getSeedData();
    writeDb(seed);
    return seed;
  }
}

// Write to database file
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database:', error);
  }
}

// DB utility module export
const db = {
  getCollection: (name) => {
    const data = readDb();
    return data[name] || [];
  },

  setCollection: (name, list) => {
    const data = readDb();
    data[name] = list;
    writeDb(data);
  },

  getAll: () => readDb(),

  find: (collectionName, queryFn) => {
    const list = db.getCollection(collectionName);
    return list.filter(queryFn);
  },

  findOne: (collectionName, queryFn) => {
    const list = db.getCollection(collectionName);
    return list.find(queryFn);
  },

  insert: (collectionName, doc) => {
    const list = db.getCollection(collectionName);
    
    // Generate simple sequential id based on collection type
    let prefix = 'id';
    if (collectionName === 'members') prefix = 'm';
    else if (collectionName === 'trainers') prefix = 't';
    else if (collectionName === 'payments') prefix = 'pay';
    else if (collectionName === 'attendance') prefix = 'att';
    else if (collectionName === 'workoutPlans') prefix = 'wp';
    else if (collectionName === 'dietPlans') prefix = 'dp';
    
    // Find highest numerical index
    let maxNum = 0;
    list.forEach(item => {
      const match = item.id ? String(item.id).match(new RegExp(`^${prefix}(\\d+)$`)) : null;
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxNum) maxNum = num;
      }
    });
    
    const newId = `${prefix}${maxNum + 1}`;
    const newDoc = { id: newId, ...doc };
    list.unshift(newDoc); // add to top
    db.setCollection(collectionName, list);
    return newDoc;
  },

  update: (collectionName, id, updates) => {
    const list = db.getCollection(collectionName);
    const index = list.findIndex(item => String(item.id) === String(id));
    if (index === -1) return null;
    
    list[index] = { ...list[index], ...updates };
    db.setCollection(collectionName, list);
    return list[index];
  },

  delete: (collectionName, id) => {
    const list = db.getCollection(collectionName);
    const filtered = list.filter(item => String(item.id) !== String(id));
    db.setCollection(collectionName, filtered);
    return true;
  }
};

export default db;
