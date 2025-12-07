import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export interface User {
  id: string;
  mobile: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  name?: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  email?: string;
  profilePicUrl: string;
  userUUID?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  userUUID?: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
    isAuthenticated: false,
    userUUID: undefined,
  });

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('userData'),
      ]);

      if (token && userData) {
        setAuthState({
          user: JSON.parse(userData),
          token,
          loading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          token: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      setAuthState({
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (token: string, user: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('authToken', token),
        AsyncStorage.setItem('userData', JSON.stringify(user)),
      ]);

      setAuthState({
        user,
        token,
        loading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('authToken'),
        AsyncStorage.removeItem('userData'),
      ]);

      setAuthState({
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    ...authState,
    login,
    logout,
    refresh: loadAuthData,
  };
}