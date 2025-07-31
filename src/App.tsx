import React, { useState, useEffect } from 'react';
import { User, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

// Demo Mode Configuration - This won't work in Claude artifacts due to CORS restrictions
// For real authentication, run this code locally or deploy to a web server
const DEMO_MODE = true; // Set to false when running locally

// Supabase configuration (for local use)
const SUPABASE_URL = 'https://ngsxqocwaujhorjjffjr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nc3hxb2N3YXVqaG9yampmZmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MzA5MTAsImV4cCI6MjA2OTQwNjkxMH0.QNkG9uOqIK67MUBEu_vwTTyjucVi5JLH4z4G8q7fKK0';

// Create Supabase client
const createSupabaseClient = () => {
  if (DEMO_MODE) {
    // Demo implementation for Claude artifacts
    return {
      auth: {
        signUp: async ({ email, password }) => {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          if (email === 'test@error.com') {
            return { data: null, error: { message: 'User already registered' } };
          }
          
          return { 
            data: { 
              user: { id: 'demo-123', email, email_confirmed_at: null }, 
              session: null 
            }, 
            error: null 
          };
        },

        signInWithPassword: async ({ email, password }) => {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          if (password === 'wrongpassword') {
            return { data: null, error: { message: 'Invalid login credentials' } };
          }
          
          const userData = { id: 'demo-123', email };
          const sessionData = { access_token: 'demo-token', user: userData };
          
          return { data: { user: userData, session: sessionData }, error: null };
        },

        signInWithOAuth: async ({ provider }) => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { data: { url: `https://demo.com/oauth/${provider}` }, error: null };
        },

        signOut: async () => {
          return { error: null };
        },

        getSession: async () => {
          return { data: { session: null }, error: null };
        },

        onAuthStateChange: (callback) => {
          return {
            data: {
              subscription: {
                unsubscribe: () => {}
              }
            }
          };
        }
      }
    };
  }

  // Real Supabase implementation (for local development)
  const apiUrl = `${SUPABASE_URL}/auth/v1`;
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  };

  return {
    auth: {
      signUp: async ({ email, password }) => {
        try {
          const response = await fetch(`${apiUrl}/signup`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email, password })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            return { data: null, error: { message: data.msg || data.error_description || 'Signup failed' } };
          }
          
          return { data: { user: data.user, session: data.session }, error: null };
        } catch (error) {
          return { data: null, error: { message: 'Network error during signup' } };
        }
      },

      signInWithPassword: async ({ email, password }) => {
        try {
          const response = await fetch(`${apiUrl}/token?grant_type=password`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email, password })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            return { data: null, error: { message: data.msg || data.error_description || 'Login failed' } };
          }
          
          return { data: { user: data.user, session: data }, error: null };
        } catch (error) {
          return { data: null, error: { message: 'Network error during login' } };
        }
      },

      signInWithOAuth: async ({ provider, options = {} }) => {
        try {
          const redirectTo = options.redirectTo || `${window.location.origin}`;
          const oauthUrl = `${apiUrl}/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
          
          window.open(oauthUrl, '_blank', 'width=500,height=600');
          
          return { data: { url: oauthUrl }, error: null };
        } catch (error) {
          return { data: null, error: { message: `Failed to authenticate with ${provider}` } };
        }
      },

      signOut: async () => {
        return { error: null };
      },

      getSession: async () => {
        return { data: { session: null }, error: null };
      },

      onAuthStateChange: (callback) => {
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        };
      }
    }
  };
};

const SignupDemo = () => {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);

  // Initialize Supabase client
  const supabase = createSupabaseClient();

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (event === 'SIGNED_IN') {
          setSuccess('Successfully signed in!');
          setError('');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleEmailAuth = async () => {
    if (authMode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setAuthLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      
      if (authMode === 'signup') {
        result = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (result.error) throw result.error;
        
        if (result.data.user && !result.data.session) {
          setSuccess('Please check your email to confirm your account!');
        } else {
          setSuccess('Account created successfully!');
          setUser(result.data.user);
        }
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (result.error) throw result.error;
        setSuccess('Signed in successfully!');
        setUser(result.data.user);
      }
    } catch (error) {
      setError(error.message || 'An error occurred during authentication.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setError('');
    setSuccess('');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}`
        }
      });

      if (error) throw error;
      
      setSuccess(`Opening ${provider} authentication in new window...`);
      
    } catch (error) {
      setError(error.message || `Failed to authenticate with ${provider}`);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError('Error signing out');
    } else {
      setUser(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSuccess('Signed out successfully');
    }
  };

  // If user is authenticated, show a simple dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        {/* Background remains the same */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full opacity-10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  background: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)],
                  animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-6 shadow-2xl shadow-emerald-500/25 relative">
                  <CheckCircle className="w-10 h-10 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl blur opacity-50 animate-pulse"></div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
                <p className="text-slate-300">You are successfully signed in</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8">
                <div className="text-center">
                  <div className="mb-6">
                    <p className="text-slate-300 mb-2">Signed in as:</p>
                    <p className="text-white font-semibold">{user.email}</p>
                    <p className="text-slate-400 text-sm mt-1">User ID: {user.id}</p>
                  </div>
                  
                  {success && (
                    <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
                      <p className="text-emerald-400 text-sm flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {success}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(120deg); }
            66% { transform: translateY(5px) rotate(240deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                background: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)],
                animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mr-4 shadow-2xl shadow-blue-500/25 relative">
              <User className="w-6 h-6 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur opacity-50 animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Supabase Auth Demo
            </h1>
          </div>
        </div>

        {/* Auth Form */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25 relative">
                <User className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-50 animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {authMode === 'login' ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-slate-300">
                {authMode === 'login' ? 'Sign in to continue your journey' : 'Create an account to save your progress'}
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
                  <p className="text-emerald-400 text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {success}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password - Only shown during signup */}
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full p-3 bg-slate-900/50 border rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 transition-all duration-200 ${
                          confirmPassword && password !== confirmPassword
                            ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
                            : confirmPassword && password === confirmPassword
                            ? 'border-emerald-500/50 focus:ring-emerald-500/50 focus:border-emerald-500/50'
                            : 'border-slate-600/50 focus:ring-blue-500/50 focus:border-blue-500/50'
                        }`}
                        placeholder="Confirm your password"
                        required
                      />
                      {confirmPassword && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {password === confirmPassword ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Passwords do not match
                      </p>
                    )}
                    {confirmPassword && password === confirmPassword && (
                      <p className="mt-2 text-sm text-emerald-400 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Passwords match
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleEmailAuth}
                  disabled={authLoading || (authMode === 'signup' && password !== confirmPassword)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {authLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      {authMode === 'login' ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    authMode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800/50 text-slate-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleOAuthSignIn('google')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-slate-600/50 rounded-lg bg-slate-700/50 text-sm font-medium text-slate-300 hover:bg-slate-600/50 transition-colors duration-200"
                  >
                    Google
                  </button>
                  <button 
                    onClick={() => handleOAuthSignIn('github')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-slate-600/50 rounded-lg bg-slate-700/50 text-sm font-medium text-slate-300 hover:bg-slate-600/50 transition-colors duration-200"
                  >
                    GitHub
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setPassword('');
                    setConfirmPassword('');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>

              {/* Demo Notice */}
              {DEMO_MODE && (
                <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <h4 className="text-amber-400 font-medium mb-2">Demo Mode Active</h4>
                  <div className="text-amber-300 text-sm space-y-1">
                    <p>• This is running in Claude's artifact environment</p>
                    <p>• For real authentication, copy this code and run it locally</p>
                    <p>• Try any email/password to test the UI flow</p>
                    <p>• Use "test@error.com" to simulate an error</p>
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
};

export default SignupDemo;