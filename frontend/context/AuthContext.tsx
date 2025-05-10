import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../core/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (data: { access: string; refresh: string; user?: any }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean; 
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const userInfo = await AsyncStorage.getItem('userInfo');

      if (accessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setIsAuthenticated(true);
        if (userInfo) {
          setUser(JSON.parse(userInfo));
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  const login = async (data: { access: string; refresh: string; user?: any }) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('accessToken', data.access),
        AsyncStorage.setItem('refreshToken', data.refresh),
        data.user ? AsyncStorage.setItem('userInfo', JSON.stringify(data.user)) : Promise.resolve(),
      ]);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      setIsAuthenticated(true);
      setUser(data.user || null);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userInfo');
      delete api.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const contextValue = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
