import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useConvexAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already authenticated
  const checkAuth = useQuery(api.auth.getCurrentUser);
  const loginMutation = useMutation(api.auth.login);
  const logoutMutation = useMutation(api.auth.logout);
  const registerMutation = useMutation(api.auth.register);
  const sendOtpMutation = useMutation(api.auth.sendOtp);
  
  useEffect(() => {
    if (checkAuth !== undefined) {
      setUser(checkAuth);
      setLoading(false);
    }
  }, [checkAuth]);

  const login = async (phone: string, otp: string) => {
    try {
      setLoading(true);
      const result = await loginMutation({ phone, otp });
      if (result) {
        setUser(result.user);
        localStorage.setItem('convex_token', result.token);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (phone: string) => {
    return await sendOtpMutation({ phone });
  };

  const register = async (fullName: string, phone: string, city: string) => {
    try {
      setLoading(true);
      const result = await registerMutation({ fullName, phone, city });
      if (result) {
        setUser(result.user);
        localStorage.setItem('convex_token', result.token);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutMutation();
      setUser(null);
      localStorage.removeItem('convex_token');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    sendOtp,
  };
}
