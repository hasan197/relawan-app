import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMuzakki } from '../hooks/useMuzakki';
import { useDonations } from '../hooks/useDonations';

interface AppContextType {
  // Auth
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  
  // Muzakki
  muzakkiList: any[];
  addMuzakki: (data: any) => Promise<any>;
  updateMuzakki: (id: string, data: any) => Promise<any>;
  deleteMuzakki: (id: string) => Promise<void>;
  
  // Donations
  donations: any[];
  addDonation: (data: any) => Promise<any>;
  getTotalDonations: () => number;
  getTotalDistributed: () => number;
  getDonationsByCategory: () => any;
  
  // Refresh
  refetchAll: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  
  // Debug: Log when user changes
  useEffect(() => {
    if (auth.user) {
      console.log('👤 AppContext - User loaded:', {
        id: auth.user.id,
        name: auth.user.full_name,
        phone: auth.user.phone
      });
    } else {
      console.log('👤 AppContext - No user');
    }
  }, [auth.user]);
  
  const muzakki = useMuzakki(auth.user?.id || null);
  const donations = useDonations(auth.user?.id || null);
  const [loading, setLoading] = useState(true);

  // Debug: Log muzakki list changes
  useEffect(() => {
    console.log('📊 AppContext - Muzakki list updated:', {
      count: muzakki.muzakkiList.length,
      loading: muzakki.loading,
      data: muzakki.muzakkiList
    });
  }, [muzakki.muzakkiList, muzakki.loading]);

  useEffect(() => {
    setLoading(auth.loading);
  }, [auth.loading]);

  const login = async (phone: string, otp: string) => {
    await auth.verifyOTP(phone, otp);
  };

  const refetchAll = async () => {
    await Promise.all([
      muzakki.refetch(),
      donations.refetch()
    ]);
  };

  const value: AppContextType = {
    // Auth
    user: auth.user,
    loading,
    isAuthenticated: auth.isAuthenticated,
    login,
    logout: auth.logout,
    
    // Muzakki
    muzakkiList: muzakki.muzakkiList,
    addMuzakki: muzakki.addMuzakki,
    updateMuzakki: muzakki.updateMuzakki,
    deleteMuzakki: muzakki.deleteMuzakki,
    
    // Donations
    donations: donations.donations,
    addDonation: donations.addDonation,
    getTotalDonations: donations.getTotalDonations,
    getTotalDistributed: donations.getTotalDistributed,
    getDonationsByCategory: donations.getDonationsByCategory,
    
    // Refresh
    refetchAll
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}