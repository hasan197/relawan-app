import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

// Determine the current backend type
const CURRENT_BACKEND = process.env.VITE_BACKEND || 'convex';

// Create a Convex client
const convex = new ConvexHttpClient(process.env.VITE_CONVEX_URL || '');

// This adapter makes Convex look like Supabase
export const convexClient = {
  // Auth methods
  auth: {
    signInWithPassword: async ({ email, phone, otp }: { email?: string; phone?: string; otp?: string }) => {
      try {
        if (!phone || !otp) {
          throw new Error('Phone and OTP are required');
        }
        
        const result = await convex.mutation(api.auth.login, { phone, otp });
        
        if (!result) {
          return { data: null, error: { message: 'Authentication failed' } };
        }
        
        // Store the token in localStorage
        if (result.token) {
          localStorage.setItem('convex_token', result.token);
        }
        
        return { 
          data: { 
            user: result.user, 
            session: { 
              access_token: result.token,
              user: result.user
            } 
          }, 
          error: null 
        };
      } catch (error: any) {
        console.error('Login error:', error);
        return { 
          data: null, 
          error: { 
            message: error.message || 'Authentication failed' 
          } 
        };
      }
    },
    
    signUp: async (userData: { email?: string; password?: string; fullName: string; phone: string; city: string }) => {
      try {
        const { fullName, phone, city } = userData;
        const result = await convex.mutation(api.auth.register, { 
          fullName, 
          phone, 
          city 
        });
        
        if (!result) {
          return { data: null, error: { message: 'Registration failed' } };
        }
        
        // Store the token in localStorage
        if (result.token) {
          localStorage.setItem('convex_token', result.token);
        }
        
        return { 
          data: { 
            user: result.user, 
            session: { 
              access_token: result.token,
              user: result.user
            } 
          }, 
          error: null 
        };
      } catch (error: any) {
        console.error('Signup error:', error);
        return { 
          data: null, 
          error: { 
            message: error.message || 'Registration failed' 
          } 
        };
      }
    },
    
    signOut: async () => {
      try {
        await convex.mutation(api.auth.logout);
        localStorage.removeItem('convex_token');
        return { error: null };
      } catch (error) {
        console.error('Logout error:', error);
        return { error };
      }
    },
    
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // This is a simplified version. In a real app, you'd set up proper event listeners
      const handleAuthChange = async () => {
        try {
          const token = localStorage.getItem('convex_token');
          if (token) {
            const user = await convex.query(api.auth.getCurrentUser);
            if (user) {
              callback('SIGNED_IN', { 
                access_token: token,
                user 
              });
              return;
            }
          }
          callback('SIGNED_OUT', null);
        } catch (error) {
          console.error('Auth state check error:', error);
          callback('SIGNED_OUT', null);
        }
      };

      // Check initial auth state
      handleAuthChange();

      // Set up a poll to check for auth changes
      const interval = setInterval(handleAuthChange, 60000);

      // Return unsubscribe function
      return () => clearInterval(interval);
    },
    
    // Add other auth methods as needed
    getSession: async () => {
      const token = localStorage.getItem('convex_token');
      if (!token) return { data: { session: null }, error: null };
      
      try {
        const user = await convex.query(api.auth.getCurrentUser);
        if (!user) {
          localStorage.removeItem('convex_token');
          return { data: { session: null }, error: null };
        }
        
        return { 
          data: { 
            session: { 
              access_token: token,
              user 
            } 
          }, 
          error: null 
        };
      } catch (error) {
        console.error('Session check error:', error);
        localStorage.removeItem('convex_token');
        return { data: { session: null }, error };
      }
    },
  },

  // Database methods
  from: (table: string) => {
    return {
      select: (columns: string) => ({
        eq: async (column: string, value: any) => {
          try {
            const result = await convex.query(api.database.queryDocuments, { 
              table, 
              column, 
              value 
            });
            const data = result.map((item: any) => item.data);
            return { data, error: null };
          } catch (error: any) {
            console.error('Query error:', error);
            return { data: null, error: { message: error.message } };
          }
        },
      }), 
      
      update: (values: any) => ({
        eq: (column: string, value: any) => ({
          data: async () => {
            try {
              const result = await convex.mutation(api.database.update, {
                table,
                column,
                value,
                updates: values
              });
              return { data: result, error: null };
            } catch (error: any) {
              console.error('Update error:', error);
              return { data: null, error: { message: error.message } };
            }
          }
        })
      }),
      
      delete: () => ({
        eq: (column: string, value: any) => ({
          data: async () => {
            try {
              const result = await convex.mutation(api.database.remove, {
                table,
                column,
                value
              });
              return { data: result, error: null };
            } catch (error: any) {
              console.error('Delete error:', error);
              return { data: null, error: { message: error.message } };
            }
          }
        })
      })
    })
  }),
  
  // Add other Supabase client methods as needed
  rpc: (fnName: string, params: any) => ({
    data: async () => {
      const response = await fetch(`/api/rpc/${fnName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await response.json();
      return { data, error: null };
    }
  })
};

// Export the appropriate client based on the backend type
const getClient = () => {
  if (CURRENT_BACKEND === 'convex') {
    return convexClient as any; // Type assertion since we're matching Supabase's interface
  }
  // Default to Supabase if available
  if (typeof window !== 'undefined' && (window as any).supabase) {
    return (window as any).supabase;
  }
  throw new Error('No valid client available');
};

export const db = getClient();
export const auth = getClient().auth;
