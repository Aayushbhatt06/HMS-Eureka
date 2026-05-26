import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginUser, clearError } from '../store/slices/authSlice';
import { HeartPulse, Sun, Moon, KeyRound, User, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Success message passed from registration redirect
  const infoMessage = (location.state as any)?.info || '';
  const from = (location.state as any)?.from?.pathname || '/';

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
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    dispatch(clearError());
    setLocalError('');
  }, [dispatch, username, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLocalError('Please enter both username and password.');
      return;
    }
    dispatch(loginUser({ username, password }));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Premium background glowing radial designs */}
      <div className="absolute top-0 left-0 -mt-24 -ml-24 w-96 h-96 bg-sky-500/10 dark:bg-sky-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 -mb-24 -mr-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Theme Switcher */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-200 cursor-pointer text-slate-600 dark:text-slate-300"
        title="Toggle color theme"
      >
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>

      <div className="w-full max-w-md animate-fade-in z-10">
        
        {/* Portal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 mb-3.5 shadow-inner">
            <HeartPulse className="h-9 w-9 animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hospital Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Sign in to access your clinical or patient workspace
          </p>
        </div>

        {/* Informational registry notifications */}
        {infoMessage && !error && !localError && (
          <div className="mb-4 p-3.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 rounded-xl text-xs text-center font-medium flex items-center justify-center gap-2 animate-fade-in">
            <HeartPulse className="h-4 w-4 text-sky-600 dark:text-sky-400 animate-bounce" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Clean, shadow card panel */}
        <div className="card-panel bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error notifications */}
            {(error || localError) && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <span>{error || localError}</span>
              </div>
            )}

            {/* Username Input */}
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
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full pl-9 pr-3 py-2.5 text-sm rounded-xl"
                />
              </div>
            </div>

            {/* Password Input */}
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full pl-9 pr-3 py-2.5 text-sm rounded-xl"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 transition duration-200 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Workspace</span>
              )}
            </button>
          </form>

          {/* Redirection */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Need workspace access?{' '}
            <Link 
              to="/register" 
              className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-bold transition"
            >
              Create registry profile
            </Link>
          </div>
        </div>

        <div className="text-center mt-8 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
          Secure Health Portal • Authorized Personnel Only
        </div>
      </div>
    </div>
  );
};

export default Login;
