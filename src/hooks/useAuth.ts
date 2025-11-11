import { useState, useEffect } from 'react';
import { apiCall } from '../lib/supabase';

interface User {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  regu_id: string | null;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    
    console.log('🔐 Auth Check:', {
      hasToken: !!token,
      hasUser: !!userStr
    });
    
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
  }, []);

  const register = async (fullName: string, phone: string, city: string, reguId?: string) => {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          phone,
          city,
          reguId
        })
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const sendOTP = async (phone: string) => {
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
        console.log('🆔 User ID:', response.user?.id);
        console.log('🔑 Access Token:', response.access_token);

        if (!response.user?.id) {
          console.error('❌ CRITICAL: User ID is missing from response!');
          throw new Error('User ID tidak ditemukan dalam response. Silakan hubungi admin.');
        }

        console.log('💾 Saving to localStorage...');
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        console.log('✅ Saved to localStorage');
        console.log('🔍 Verifying localStorage save...');
        
        const savedUser = localStorage.getItem('user');
        const parsedSavedUser = savedUser ? JSON.parse(savedUser) : null;
        console.log('📦 Saved user from localStorage:', parsedSavedUser);
        console.log('🆔 Saved user ID:', parsedSavedUser?.id);

        // IMPORTANT: Update state immediately
        setAccessToken(response.access_token);
        setUser(response.user);
        
        console.log('✅ State updated');
        
        // Force a small delay to ensure state propagates
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return response;
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
  };

  return {
    user,
    loading,
    accessToken,
    register,
    sendOTP,
    verifyOTP,
    logout,
    isAuthenticated: !!user
  };
}