import { useState, useEffect } from 'react';
import { apiCall } from '../lib/supabase';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

// Add type for Vite environment variables
declare global {
  interface ImportMetaEnv {
    VITE_BACKEND?: 'supabase' | 'convex';
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// User type that matches Convex schema
interface ConvexUser {
  _id: Id<'users'>;
  _creationTime: number;
  tokenIdentifier?: string;
  fullName: string;
  phone: string;
  city: string;
  role: string;
  createdAt: number;
  regu_id?: string | null;
  regu_name?: string;
}

// Unified User type for the application
interface User {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  regu_id: string | null;
  regu_name?: string;
  role: string;
  tokenIdentifier?: string;
}

// Helper to convert Convex user to our app's User type
const toAppUser = (convexUser: ConvexUser | null): User | null => {
  if (!convexUser) return null;
  return {
    id: convexUser._id,
    full_name: convexUser.fullName,
    phone: convexUser.phone,
    city: convexUser.city,
    regu_id: convexUser.regu_id || null,
    regu_name: convexUser.regu_name,
    role: convexUser.role,
    tokenIdentifier: convexUser.tokenIdentifier
  };
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [backendType, setBackendType] = useState<'supabase' | 'convex'>(
    (import.meta.env.VITE_BACKEND as 'supabase' | 'convex') || 'supabase'
  );

  // Convex queries and mutations
  const currentUser = useQuery(api.auth.getCurrentUser);
  const loginMutation = useMutation(api.auth.login);
  const registerMutation = useMutation(api.auth.register);
  const sendOtpMutation = useMutation(api.auth.sendOtp);
  const verifyOtpMutation = useMutation(api.auth.verifyOtp as any); // Temporary type assertion
  const logoutMutation = useMutation(api.auth.logout);

  // Check auth status on mount and when backend type changes
  useEffect(() => {
    const checkAuth = async () => {
      if (backendType === 'convex') {
        // For Convex, check both currentUser query and localStorage
        setLoading(true);

        // Always prefer live data from Convex if available
        if (currentUser && '_id' in currentUser) {
          const appUser = toAppUser(currentUser as ConvexUser);
          console.log('🔐 Convex: User authenticated via query', {
            id: appUser?.id,
            name: appUser?.full_name,
            regu: appUser?.regu_name
          });
          setUser(appUser);
          setAccessToken('convex-token');

          // Update localStorage to keep it in sync
          if (appUser) {
            localStorage.setItem('user', JSON.stringify(appUser));
            localStorage.setItem('access_token', 'convex-token');
          }
        } else {
          // Fallback to localStorage while loading or if query fails
          const token = localStorage.getItem('access_token');
          const userStr = localStorage.getItem('user');

          if (token && userStr) {
            const parsedUser = JSON.parse(userStr);
            console.log('🔐 Convex: User loaded from localStorage (fallback):', {
              id: parsedUser.id,
              name: parsedUser.full_name,
              phone: parsedUser.phone
            });
            setAccessToken(token);
            setUser(parsedUser);
          } else {
            console.log('🔐 Convex: No authenticated user');
            setUser(null);
            setAccessToken(null);
          }
        }
        setLoading(false);
      } else {
        // Supabase implementation
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');

        console.log('🔐 Supabase Auth Check:', { hasToken: !!token, hasUser: !!userStr });

        if (token && userStr) {
          const parsedUser = JSON.parse(userStr);
          console.log('✅ User loaded from localStorage:', {
            id: parsedUser.id,
            name: parsedUser.full_name,
            phone: parsedUser.phone
          });
          setAccessToken(token);
          setUser(parsedUser);
        } else {
          console.log('⚠️ No user found in localStorage');
        }
        setLoading(false);
      }
    };

    checkAuth();
  }, [backendType, currentUser]);

  const register = async (fullName: string, phone: string, city: string) => {
    if (backendType === 'convex') {
      try {
        const result = await registerMutation({
          fullName,
          phone,
          city,
          role: 'relawan' // Default role
        });

        if (result) {
          // Convert Convex user to app user
          const appUser = toAppUser(result as unknown as ConvexUser);
          if (appUser) {
            setUser(appUser);
            setAccessToken('convex-token');
            return { success: true, user: appUser };
          }
        }

        return { success: false, error: 'Failed to register user' };
      } catch (error) {
        console.error('Convex register error:', error);
        throw error;
      }
    }

    // Supabase implementation
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, phone, city })
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const sendOTP = async (phone: string) => {
    if (backendType === 'convex') {
      try {
        const result = await sendOtpMutation({ phone });
        return result;
      } catch (error) {
        console.error('Convex sendOTP error:', error);
        throw error;
      }
    }

    // Supabase implementation
    try {
      const response = await apiCall('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone })
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    if (backendType === 'convex') {
      try {
        console.log('🔐 Convex: Verifying OTP for phone:', phone);
        const result = await verifyOtpMutation({ phone, otp });

        if (result && result.success) {
          console.log('✅ Convex: OTP verified successfully');

          // Store token and user data in localStorage for Convex
          if (result.access_token) {
            localStorage.setItem('access_token', result.access_token);
          }
          if (result.user) {
            localStorage.setItem('user', JSON.stringify(result.user));
            setUser(result.user);
            setAccessToken(result.access_token);
          }

          return { success: true, user: result.user };
        }

        return { success: false, error: 'Verification failed' };
      } catch (error) {
        console.error('❌ Convex verify OTP error:', error);
        throw error;
      }
    }

    // Supabase implementation
    try {
      console.log('🔐 Verifying OTP for phone:', phone);

      const response = await apiCall('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp })
      });

      console.log('📥 Verify OTP Response:', response);

      if (response.success) {
        console.log('✅ OTP Verified successfully');
        console.log('👤 User data:', response.user);

        if (!response.user?.id) {
          console.error('❌ CRITICAL: User ID is missing from response!');
          throw new Error('User ID tidak ditemukan dalam response. Silakan hubungi admin.');
        }

        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setAccessToken(response.access_token);
        setUser(response.user);
      }

      return response;
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (backendType === 'convex') {
      try {
        await logoutMutation({});
      } catch (error) {
        console.error('Convex logout error:', error);
      }
    }

    // Clear local storage and state in any case
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (backendType === 'convex') {
      // Convex automatically handles user state
      // The currentUser query will update when the user changes
      return currentUser;
    }

    // Supabase implementation
    try {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        console.log('⚠️ No user to refresh');
        return;
      }

      const currentUser = JSON.parse(userStr);
      console.log('🔄 Refreshing user data for:', currentUser.phone);

      const response = await apiCall(`/users/phone/${currentUser.phone}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.success && response.user) {
        console.log('✅ User data refreshed:', response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return response.user;
      }
    } catch (error) {
      console.error('❌ Refresh user error:', error);
      throw error;
    }
  };

  // Determine loading state based on backend
  const isLoading = backendType === 'convex'
    ? loading || (currentUser === undefined)
    : loading;

  return {
    user,
    loading: isLoading,
    accessToken,
    register,
    sendOTP,
    verifyOTP,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    backend: backendType
  };
}