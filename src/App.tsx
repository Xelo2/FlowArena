import React, { useState, useEffect } from 'react';
import { User, Eye, EyeOff, CheckCircle, AlertCircle, Home, LogIn, UserPlus, Github } from 'lucide-react';

// Google Icon Component (since it's not in Lucide)
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// Simple Router Component
const Router = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname;
    console.log('Initial path:', path);
    return path || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const newPath = window.location.pathname || '/';
      console.log('Path changed to:', newPath);
      setCurrentPath(newPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    console.log('Navigating to:', path);
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return React.Children.map(children, child =>
    React.cloneElement(child, { currentPath, navigate })
  );
};

// Navigation Component
const Navigation = ({ navigate, currentPath, user, onSignOut }) => {
  return (
    <nav className="container mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mr-4 shadow-2xl shadow-blue-500/25 relative">
            <User className="w-6 h-6 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur opacity-50 animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            N8N Auth
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentPath === '/' 
                ? 'bg-blue-500/20 text-blue-300' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </button>
          
          {user ? (
            <>
              <div className="flex items-center px-4 py-2 text-slate-300">
                <User className="w-4 h-4 mr-2" />
                {user.email}
              </div>
              <button
                onClick={onSignOut}
                className="flex items-center px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200"
              >
                <LogIn className="w-4 h-4 mr-2 rotate-180" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth/signin')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentPath === '/auth/signin' 
                    ? 'bg-blue-500/20 text-blue-300' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth/signup')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentPath === '/auth/signup' 
                    ? 'bg-blue-500/20 text-blue-300' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Home Component
const Home = ({ user, navigate }) => {
  console.log('Home component rendering with user:', user);
  
  if (user) {
    // Authenticated user view
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25 relative">
              <User className="w-10 h-10 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-50 animate-pulse"></div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
              Welcome back, {user.email?.split('@')[0]}!
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              You're successfully authenticated. Here's your account overview and quick actions.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Account Information Card */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <User className="w-6 h-6 mr-3 text-blue-400" />
                    Account Information
                  </h2>
                  <div className="flex items-center px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                    <span className="text-emerald-400 text-sm font-medium">Active</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-slate-400 font-medium">Email Address</span>
                    <span className="text-slate-200">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-slate-400 font-medium">User ID</span>
                    <span className="text-slate-200 font-mono text-sm bg-slate-700/50 px-2 py-1 rounded">
                      {user.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-slate-400 font-medium">Account Type</span>
                    <span className="text-blue-400 font-medium">Standard User</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-400 font-medium">Last Sign In</span>
                    <span className="text-slate-200">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-purple-400" />
                  Quick Actions
                </h3>
                
                <div className="space-y-3">
                  <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 text-left">
                    <div className="font-medium">Update Profile</div>
                    <div className="text-sm text-slate-400">Manage your account settings</div>
                  </button>
                  
                  <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 text-left">
                    <div className="font-medium">Security Settings</div>
                    <div className="text-sm text-slate-400">Change password & 2FA</div>
                  </button>
                  
                  <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 text-left">
                    <div className="font-medium">API Keys</div>
                    <div className="text-sm text-slate-400">Manage integration keys</div>
                  </button>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-emerald-400" />
                  Activity
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Sessions Today</span>
                    <span className="text-emerald-400 font-bold">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Logins</span>
                    <span className="text-blue-400 font-bold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Account Age</span>
                    <span className="text-purple-400 font-bold">7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Home className="w-5 h-5 mr-2 text-blue-400" />
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-slate-200 font-medium">Successful sign in</div>
                      <div className="text-slate-400 text-sm">Authentication completed</div>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm">Just now</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mr-4">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-slate-200 font-medium">Account accessed</div>
                      <div className="text-slate-400 text-sm">Viewed dashboard</div>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm">2 min ago</span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center mr-4">
                      <LogIn className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-slate-200 font-medium">Profile updated</div>
                      <div className="text-slate-400 text-sm">Settings synchronized</div>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Non-authenticated user view (original design with background)
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-8 shadow-2xl shadow-blue-500/25 relative">
          <User className="w-12 h-12 text-white" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl blur opacity-50 animate-pulse"></div>
        </div>
        
        <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
          Welcome to N8N Auth
        </h1>
        
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          A modern authentication system with Supabase integration. 
          Sign up to create your account or sign in to access your dashboard.
        </p>
        
        <div className="text-slate-400 mb-8">
          <p>This is the home page. Please sign in or create an account to get started.</p>
        </div>

        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => navigate('/auth/signin')}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/auth/signup')}
            className="px-8 py-3 border border-slate-600 text-slate-300 font-semibold rounded-xl hover:bg-slate-700/50 transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

// Supabase Configuration and Client
const supabaseUrl = 'https://your-project-ref.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// Simple Supabase client implementation
const createSupabaseClient = (url, key) => {
  return {
    auth: {
      signUp: async ({ email, password }) => {
        try {
          // Simulate API call with mock data
          console.log('Mock signup for:', email);
          
          // Mock successful response
          return { 
            data: { 
              user: { id: 'mock-user-id', email }, 
              session: null 
            }, 
            error: null 
          };
        } catch (error) {
          return { data: null, error: { message: error.message } };
        }
      },

      signInWithPassword: async ({ email, password }) => {
        try {
          // Simulate API call with mock data
          console.log('Mock signin for:', email);
          
          // Mock successful response
          const mockUser = { id: 'mock-user-id', email };
          const mockSession = { user: mockUser, access_token: 'mock-token' };
          
          return { 
            data: { session: mockSession }, 
            error: null 
          };
        } catch (error) {
          return { data: null, error: { message: error.message } };
        }
      },

      signInWithOAuth: async ({ provider, options = {} }) => {
        try {
          const redirectTo = options.redirectTo || window.location.origin;
          
          // Store current path to redirect back after auth (optional)
          localStorage.setItem('pre_auth_path', window.location.pathname);
          
          // Construct the OAuth URL with proper parameters
          const params = new URLSearchParams({
            provider: provider,
            redirect_to: redirectTo
          });
          
          const oauthUrl = `${url}/auth/v1/authorize?${params.toString()}`;
          
          console.log('Redirecting to OAuth URL:', oauthUrl);
          
          // Redirect to OAuth provider
          window.location.href = oauthUrl;
          
          return { data: null, error: null };
        } catch (error) {
          console.error('OAuth error:', error);
          return { data: null, error: { message: error.message } };
        }
      },

      resetPasswordForEmail: async ({ email }) => {
        try {
          console.log('Mock password reset for:', email);
          
          // Mock successful response
          return { 
            data: {}, 
            error: null 
          };
        } catch (error) {
          return { data: null, error: { message: error.message } };
        }
      },

      getSession: async () => {
        // First check for OAuth callback parameters
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const errorCode = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        // Handle OAuth errors
        if (errorCode) {
          console.error('OAuth error:', errorCode, errorDescription);
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          return { data: { session: null }, error: { message: errorDescription || 'Authentication failed' } };
        }
        
        if (accessToken) {
          try {
            // Get user data with the access token
            const response = await fetch(`${url}/auth/v1/user`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'apikey': key
              }
            });
            
            if (response.ok) {
              const user = await response.json();
              
              // Store tokens
              localStorage.setItem('supabase_token', accessToken);
              if (refreshToken) {
                localStorage.setItem('supabase_refresh_token', refreshToken);
              }
              
              // Clean up URL parameters
              window.history.replaceState({}, document.title, window.location.pathname);
              
              return { 
                data: { 
                  session: { user, access_token: accessToken },
                  isOAuthCallback: true
                }, 
                error: null 
              };
            } else {
              console.error('Failed to get user data after OAuth');
              // Clean up URL
              window.history.replaceState({}, document.title, window.location.pathname);
              return { data: { session: null }, error: { message: 'Failed to authenticate user' } };
            }
          } catch (error) {
            console.error('Error processing OAuth callback:', error);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return { data: { session: null }, error: { message: 'Authentication error' } };
          }
        }
        
        // Check for existing token in localStorage
        const token = localStorage.getItem('supabase_token');
        if (!token) return { data: { session: null }, error: null };
        
        try {
          const response = await fetch(`${url}/auth/v1/user`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'apikey': key
            }
          });
          
          if (response.ok) {
            const user = await response.json();
            return { 
              data: { 
                session: { user, access_token: token } 
              }, 
              error: null 
            };
          } else {
            // Token might be expired, remove it
            localStorage.removeItem('supabase_token');
            localStorage.removeItem('supabase_refresh_token');
            return { data: { session: null }, error: null };
          }
        } catch (error) {
          console.error('Error validating existing session:', error);
          return { data: { session: null }, error };
        }
      },

      signOut: async () => {
        const token = localStorage.getItem('supabase_token');
        
        // Call Supabase logout endpoint if we have a token
        if (token) {
          try {
            await fetch(`${url}/auth/v1/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': key
              }
            });
          } catch (error) {
            console.error('Error during logout:', error);
          }
        }
        
        // Clear all auth-related localStorage items
        localStorage.removeItem('supabase_token');
        localStorage.removeItem('supabase_refresh_token');
        localStorage.removeItem('pre_auth_path');
        
        return { error: null };
      }
    }
  };
};

const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Supabase Auth Hook
const useSupabaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [oauthLoading, setOauthLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          // You might want to show this error to the user
          return;
        }
        
        if (data.session) {
          setUser(data.session.user);
          
          // If this was an OAuth callback, optionally redirect to stored path
          if (data.isOAuthCallback) {
            const preAuthPath = localStorage.getItem('pre_auth_path');
            if (preAuthPath && preAuthPath !== '/' && preAuthPath !== window.location.pathname) {
              localStorage.removeItem('pre_auth_path');
              window.history.replaceState({}, document.title, preAuthPath);
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    
    checkSession();
  }, []);

  const signUp = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        console.error('Sign up error:', error);
        return { 
          success: false, 
          message: error.message || 'Sign up failed. Please try again.' 
        };
      }
      
      console.log('Sign up successful:', data);
      return { 
        success: true, 
        message: 'Account created successfully! You can now sign in.' 
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        return { 
          success: false, 
          message: error.message || 'Sign in failed. Please check your credentials.' 
        };
      }
      
      if (data.session) {
        setUser(data.session.user);
        localStorage.setItem('supabase_token', data.session.access_token);
      }
      
      console.log('Sign in successful:', data);
      return { success: true, message: 'Signed in successfully!' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider) => {
    setOauthLoading(true);
    try {
      console.log(`Starting ${provider} OAuth...`);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error(`${provider} OAuth error:`, error);
        setOauthLoading(false);
        return { 
          success: false, 
          message: `${provider} sign in failed. Please try again.` 
        };
      }
      
      // The function will redirect, so we don't need to set loading to false
      // or return success message as the page will redirect
      return { success: true, message: `Redirecting to ${provider}...` };
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      setOauthLoading(false);
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      return { success: true, message: 'Signed out successfully!' };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, message: 'Sign out failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail({ email });
      
      if (error) {
        console.error('Password reset error:', error);
        return { 
          success: false, 
          message: error.message || 'Password reset failed. Please try again.' 
        };
      }
      
      console.log('Password reset successful:', data);
      return { 
        success: true, 
        message: 'Password reset email sent! Please check your inbox.' 
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, oauthLoading, signUp, signIn, signInWithOAuth, signOut, resetPassword };
};

// Auth Form Component
const AuthForm = ({ mode, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  const { loading, oauthLoading, signUp, signIn, signInWithOAuth, resetPassword } = useSupabaseAuth();

  const handleSubmit = async () => {
    setMessage('');
    
    if (mode === 'signup' && password !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.');
      setMessageType('error');
      return;
    }

    if (!email || !password) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    const result = mode === 'signup' 
      ? await signUp(email, password)
      : await signIn(email, password);

    if (result.success) {
      setMessage(result.message);
      setMessageType('success');
      // Navigate to home after successful auth
      setTimeout(() => navigate('/'), 2000);
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
  };

  const handleResetPassword = async () => {
    setMessage('');
    
    if (!email) {
      setMessage('Please enter your email address first.');
      setMessageType('error');
      return;
    }

    const result = await resetPassword(email);
    
    if (result.success) {
      setMessage(result.message);
      setMessageType('success');
      setShowResetPassword(false);
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setMessage('');
    const result = await signInWithOAuth(provider);
    
    if (!result.success) {
      setMessage(result.message);
      setMessageType('error');
    } else {
      setMessage(result.message);
      setMessageType('success');
      // Navigate to home after OAuth success
      setTimeout(() => navigate('/'), 2500);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25 relative">
            <User className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-50 animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p className="text-slate-300">
            {mode === 'signin' ? 'Sign in to continue your journey' : 'Create an account to save your progress'}
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center ${
              messageType === 'success' 
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleOAuthSignIn('google')}
                disabled={loading || oauthLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-slate-600/50 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {oauthLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-transparent mr-3"></div>
                ) : (
                  <GoogleIcon className="w-5 h-5 mr-3" />
                )}
                Continue with Google
              </button>
              
              <button
                onClick={() => handleOAuthSignIn('github')}
                disabled={loading || oauthLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-slate-600/50 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {oauthLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-transparent mr-3"></div>
                ) : (
                  <Github className="w-5 h-5 mr-3" />
                )}
                Continue with GitHub
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800/50 text-slate-400">Or continue with email</span>
                </div>
              </div>
            </div>
          </div>

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
              {mode === 'signin' && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {mode === 'signup' && (
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
              onClick={handleSubmit}
              disabled={loading || oauthLoading || (mode === 'signup' && password !== confirmPassword)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(mode === 'signin' ? '/auth/signup' : '/auth/signin')}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Password Reset Modal */}
          {showResetPassword && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Reset Password</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowResetPassword(false)}
                    className="flex-1 py-2 px-4 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      </div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
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
        <Router>
          <AppContent />
        </Router>
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

// App Content with Routing Logic
const AppContent = ({ currentPath, navigate }) => {
  const { user, signOut } = useSupabaseAuth();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/');
    }
  };

  // Debug: Log current path and user state
  console.log('Current path:', currentPath, 'User:', user);

  return (
    <>
      <Navigation 
        navigate={navigate} 
        currentPath={currentPath} 
        user={user}
        onSignOut={handleSignOut}
      />
      
      {/* Always show Home component for root path */}
      {currentPath === '/' && <Home user={user} navigate={navigate} />}
      
      {/* Show auth forms only for unauthenticated users */}
      {currentPath === '/auth/signin' && !user && <AuthForm mode="signin" navigate={navigate} />}
      {currentPath === '/auth/signup' && !user && <AuthForm mode="signup" navigate={navigate} />}
      
      {/* Redirect authenticated users away from auth pages */}
      {user && (currentPath === '/auth/signin' || currentPath === '/auth/signup') && (
        <div className="container mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Already Signed In</h2>
          <p className="text-slate-300 mb-6">You're already authenticated. Redirecting to home...</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      )}
      
      {/* 404 fallback */}
      {!['/', '/auth/signin', '/auth/signup'].includes(currentPath) && (
        <div className="container mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-slate-300 mb-6">The page you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      )}
      

    </>
  );
};

export default App;
