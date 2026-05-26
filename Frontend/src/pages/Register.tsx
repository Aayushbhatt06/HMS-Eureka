import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { registerUser, clearError, resetRegisterSuccess } from '../store/slices/authSlice';
import { Sun, Moon, User, KeyRound, Mail, Phone, UserCheck, ShieldAlert, Award } from 'lucide-react';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'PATIENT',
  });
  const [localError, setLocalError] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, registerSuccess, isAuthenticated } = useAppSelector((state) => state.auth);

  // Apply theme class to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (registerSuccess) {
      dispatch(resetRegisterSuccess());
      navigate('/login', { state: { info: 'Registration successful. You can now sign in.' } });
    }
  }, [registerSuccess, navigate, dispatch]);

  useEffect(() => {
    dispatch(clearError());
    setLocalError('');
  }, [dispatch, formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 4) {
      setLocalError('Password must be at least 4 characters long.');
      return;
    }

    const { confirmPassword, ...payload } = formData;
    dispatch(registerUser(payload));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background radial glowing gradients */}
      <div className="absolute top-0 left-0 -mt-24 -ml-24 w-[32rem] h-[32rem] bg-sky-500/10 dark:bg-sky-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 -mb-24 -mr-24 w-[32rem] h-[32rem] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Theme Switcher */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-200 cursor-pointer text-slate-600 dark:text-slate-300"
        title="Toggle color theme"
      >
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>

      <div className="w-full max-w-2xl my-6 animate-fade-in z-10">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 mb-3 shadow-inner">
            <UserCheck className="h-9 w-9" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Portal Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Register your clinical or patient profile in the HMS registry
          </p>
        </div>

        {/* Form Panel */}
        <div className="card-panel bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error notifications */}
            {(error || localError) && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in animate-slide-in-right">
                <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <span>{error || localError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Left Column: Credentials */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  Account Credentials
                </h3>

                {/* Username */}
                <div className="space-y-1.5">
                  <label htmlFor="username" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full pl-9 pr-3 py-2 text-sm rounded-xl"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                      <KeyRound className="h-4 w-4" />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full pl-9 pr-3 py-2 text-sm rounded-xl"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                      <KeyRound className="h-4 w-4" />
                    </span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full pl-9 pr-3 py-2 text-sm rounded-xl"
                    />
                  </div>
                </div>

                {/* User Role selection */}
                <div className="space-y-1.5">
                  <label htmlFor="role" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    User Role / Designation
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                      <Award className="h-4 w-4" />
                    </span>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="input-field w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900"
                    >
                      <option value="PATIENT">Patient</option>
                      <option value="DOCTOR">Doctor</option>
                      <option value="NURSE">Nurse</option>
                      <option value="RECEPTIONIST">Receptionist</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column: Personal Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  Personal Details
                </h3>

                {/* First Name */}
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-2 text-sm rounded-xl"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-2 text-sm rounded-xl"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full pl-9 pr-3 py-2 text-sm rounded-xl"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full pl-9 pr-3 py-2 text-sm rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-sm font-bold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 transition duration-200 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating registry profile...</span>
                </>
              ) : (
                <span>Register Portal Profile</span>
              )}
            </button>
          </form>

          {/* Redirect */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have a portal account?{' '}
            <Link 
              to="/login" 
              className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-bold transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
