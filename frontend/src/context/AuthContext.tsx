import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Collection } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  activeCollection: string;
  setActiveCollection: (c: string) => void;
  collections: Collection[];
  refreshCollections: () => Promise<void>;
  addCollection: (newCol: Collection) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  // Quick Action Modals
  isNewOrderOpen: boolean;
  setIsNewOrderOpen: (open: boolean) => void;
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  isAddPurchaseOpen: boolean;
  setIsAddPurchaseOpen: (open: boolean) => void;
  isReceivePaymentOpen: boolean;
  setIsReceivePaymentOpen: (open: boolean) => void;
  isSettleReimbOpen: boolean;
  setIsSettleReimbOpen: (open: boolean) => void;
  isAddDropOpen: boolean;
  setIsAddDropOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_COLLECTIONS: Collection[] = [
  { id: '6afaca865e5b8049e40c4a48', name: 'Drop 01', code: 'DROP-01', subtitle: 'Ethereal Dawn', season: 'Summer 2026', status: 'archived', products_count: 3, orders_count: 6 },
  { id: '6afaca865e5b8049e40c4a49', name: 'Drop 02', code: 'DROP-02', subtitle: 'Midnight Bloom', season: 'Monsoon 2026', status: 'active', products_count: 3, orders_count: 10 },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('parvaii_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('parvaii_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      id: 1,
      name: 'Allu',
      email: 'allu@parvaii.com',
      role: 'admin',
      phone: '+91 98765 00001',
      status: 'active',
    };
  });

  // Persistent Drop Selection across all pages and reloads
  const [activeCollection, setActiveCollectionState] = useState<string>(() => {
    return localStorage.getItem('parvaii_active_drop') || 'Drop 01';
  });

  // Date range defaults to full drop lifespan so historical drops show complete metrics
  const [dateRange, setDateRange] = useState<string>('All Time (Drop Lifespan)');

  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const saved = localStorage.getItem('parvaii_collections');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_COLLECTIONS;
  });

  const setActiveCollection = (drop: string) => {
    setActiveCollectionState(drop);
    localStorage.setItem('parvaii_active_drop', drop);
  };

  // Modal triggers
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddPurchaseOpen, setIsAddPurchaseOpen] = useState(false);
  const [isReceivePaymentOpen, setIsReceivePaymentOpen] = useState(false);
  const [isSettleReimbOpen, setIsSettleReimbOpen] = useState(false);
  const [isAddDropOpen, setIsAddDropOpen] = useState(false);

  const refreshCollections = async () => {
    try {
      const res = await api.get('/collections');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCollections(res.data);
        localStorage.setItem('parvaii_collections', JSON.stringify(res.data));
      }
    } catch (e) {
      // Keep existing
    }
  };

  const addCollection = (newCol: Collection) => {
    setCollections((prev) => {
      const updated = [newCol, ...prev.filter(c => c.name !== newCol.name)];
      localStorage.setItem('parvaii_collections', JSON.stringify(updated));
      return updated;
    });
    setActiveCollection(newCol.name);
  };

  useEffect(() => {
    refreshCollections();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('parvaii_token', newToken);
    localStorage.setItem('parvaii_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('parvaii_token');
    localStorage.removeItem('parvaii_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        activeCollection,
        setActiveCollection,
        collections,
        refreshCollections,
        addCollection,
        dateRange,
        setDateRange,
        isNewOrderOpen,
        setIsNewOrderOpen,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        isAddPurchaseOpen,
        setIsAddPurchaseOpen,
        isReceivePaymentOpen,
        setIsReceivePaymentOpen,
        isSettleReimbOpen,
        setIsSettleReimbOpen,
        isAddDropOpen,
        setIsAddDropOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
