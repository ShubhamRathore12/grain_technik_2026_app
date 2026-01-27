import { apiService } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Utility function to safely store values in AsyncStorage
const safeStoreItem = async (key: string, value: any) => {
  if (value === null || value === undefined || value === 'undefined') {
    await AsyncStorage.removeItem(key);
    return;
  }
  
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  await AsyncStorage.setItem(key, stringValue);
};

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  getFullLoginResponse: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true

  const getFullLoginResponse = async () => {
    try {
      const response = await AsyncStorage.getItem('full_login_response');
      return response && response !== 'undefined' ? JSON.parse(response) : null;
    } catch (error) {
      console.error('Error getting full login response:', error);
      return null;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && token !== 'undefined' && userData && userData !== 'undefined') {
        // Simply check if we have stored auth data
        setIsAuthenticated(true);
        try {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
          // Clear corrupted data
          await AsyncStorage.multiRemove(['auth_token', 'user_data', 'full_login_response']);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear any corrupted data
      await AsyncStorage.multiRemove(['auth_token', 'user_data', 'full_login_response']);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    setLoading(true);
    
    try {
      // Call the API login endpoint
      const response = await apiService.login(credentials);
      
      // Extract token and user data from response
      const { token, user: userData } = response;
      
      // If no token exists, try to use firstName from user data as token equivalent
      const authValue = token || (userData && (userData as any)?.firstName) || (userData && (userData as any)?.name) || null;
      
      if (!authValue) {
        throw new Error('Login failed: No authentication token or user identifier received from server');
      }
      
      // Store auth data in AsyncStorage using safe storage
      await safeStoreItem('auth_token', authValue);
      await safeStoreItem('user_data', userData);
      // Store the complete login response
      await safeStoreItem('full_login_response', response);
      
      // Update state
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error: any) {
      console.error('Login error:', error);
      // Throw the error to be caught by the UI
      if (error.message.includes('401') || error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('unauthorized')) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.message.includes('Network Error')) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Get the current token to call logout API
      const token = await AsyncStorage.getItem('auth_token');
      
      // Note: No validate token API available
      // Proceed with local logout only
      
      // Clear stored data
      await AsyncStorage.multiRemove(['auth_token', 'user_data', 'full_login_response']);
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage
      await AsyncStorage.multiRemove(['auth_token', 'user_data', 'full_login_response']);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, getFullLoginResponse }}>
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