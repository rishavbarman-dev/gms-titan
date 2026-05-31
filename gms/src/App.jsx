import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchCurrentUser } from './features/auth/authSlice';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/Dashboard';
import MembersPage from './pages/MembersPage';
import TrainersPage from './pages/TrainersPage';
import AttendancePage from './pages/AttendancePage';
import PaymentsPage from './pages/PaymentsPage';
import WorkoutPlans from './pages/WorkoutPlans';
import DietPlans from './pages/DietPlans';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { 
            background: '#171717', 
            color: '#fff', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            fontFamily: 'Outfit, sans-serif'
          } 
        }} 
      />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<div className="text-center"><h2 className="text-2xl font-bold mb-4">Reset Password</h2><p className="text-white/40 mb-6">Enter your email to receive a reset link.</p><input className="input-field mb-4" placeholder="email@example.com" /><button className="btn btn-primary w-full">Send Reset Link</button></div>} />
        </Route>

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route 
            path="/members" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'trainer']}>
                <MembersPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/trainers" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TrainersPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/attendance" element={<AttendancePage />} />
          
          <Route 
            path="/payments" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'member']}>
                <PaymentsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/workout-plans" element={<WorkoutPlans />} />
          <Route path="/diet-plans" element={<DietPlans />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<div className="glass-card p-10"><h1 className="text-4xl font-black italic mb-4">SETTINGS</h1><p className="text-white/40">System settings coming soon...</p></div>} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
