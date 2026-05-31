import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import { loginUser } from '../../features/auth/authSlice';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const resultAction = await dispatch(loginUser(data));
    setLoading(false);

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success(`Welcome back, ${resultAction.payload.user.name}!`);
      navigate('/dashboard');
    } else {
      toast.error(resultAction.payload || 'Invalid email or password');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-white/50 text-sm">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@titan.com"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
        />
        
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-white/40 hover:text-white transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded bg-surface-lighter border-white/10 text-brand focus:ring-brand/20" />
            Remember me
          </label>
          <Link to="/forgot-password" replace className="text-brand hover:underline font-bold">Forgot Password?</Link>
        </div>

        <Button type="submit" isLoading={loading} className="w-full mt-4">
          <LogIn size={20} />
          Sign In
        </Button>
      </form>

      <div className="text-center pt-4">
        <p className="text-sm text-white/40">
          Don't have an account? <Link to="/signup" className="text-brand hover:underline font-bold">Sign Up</Link>
        </p>
      </div>

      <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
        <p className="text-[10px] text-white/30 uppercase font-black tracking-widest text-center">Demo Accounts</p>
        <div className="grid grid-cols-1 gap-1 text-[11px] text-white/50">
          <p>Admin: <span className="text-white">admin@titan.com</span></p>
          <p>Trainer: <span className="text-white">john@titan.com</span></p>
          <p>Member: <span className="text-white">sarah@titan.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
