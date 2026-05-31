import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { signupUser } from '../../features/auth/authSlice';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const resultAction = await dispatch(signupUser(data));
    setLoading(false);

    if (signupUser.fulfilled.match(resultAction)) {
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } else {
      toast.error(resultAction.payload || 'Sign up failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Join TITAN</h2>
        <p className="text-white/50 text-sm">Start your fitness journey today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/60 ml-1">Role</label>
            <select 
              className="input-field appearance-none bg-surface-lighter"
              {...register('role')}
            >
              <option value="member">Member</option>
              <option value="trainer">Trainer</option>
            </select>
          </div>
          <Input
            label="Phone"
            placeholder="+1 555-0000"
            {...register('phone')}
          />
        </div>

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password', { 
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' }
          })}
          error={errors.password?.message}
        />

        <Button type="submit" isLoading={loading} className="w-full mt-4">
          <UserPlus size={20} />
          Create Account
        </Button>
      </form>

      <div className="text-center pt-4">
        <p className="text-sm text-white/40">
          Already have an account? <Link to="/login" className="text-brand hover:underline font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
