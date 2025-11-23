import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  loginWithOtp: (email: string, otp: string) => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: (providedRefreshToken?: string) => Promise<void>;
  setDefaultStore: (userId: string, storeId: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedRefresh = localStorage.getItem('refreshToken');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      if (savedRefresh) setRefreshToken(savedRefresh);
    }
    setIsLoading(false);
  }, []);

  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const res = await apiClient.login(email, password);
    const { token, user } = res.data;
    const rt = res.data.refreshToken;
    setToken(token);
    setUser(user);
    if (rt) {
      setRefreshToken(rt);
      localStorage.setItem('refreshToken', rt);
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const register = async (email: string, username: string, password: string) => {
    await apiClient.register(email, username, password);
  };

  const requestOtp = async (email: string) => {
    await apiClient.requestOtp(email);
  };

  const loginWithOtp = async (email: string, otp: string) => {
    const res = await apiClient.loginOtp(email, otp);
    const { token, user } = res.data;
    const rt = res.data.refreshToken;
    setToken(token);
    setUser(user);
    if (rt) {
      setRefreshToken(rt);
      localStorage.setItem('refreshToken', rt);
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // Refresh auth using refresh token. If no token provided, will use stored one.
  const refreshAuth = async (providedRefreshToken?: string) => {
    const rt = providedRefreshToken ?? refreshToken ?? localStorage.getItem('refreshToken');
    if (!rt) throw new Error('No refresh token available');

    const res = await apiClient.refreshToken({refreshToken: rt});
    const newToken = res.data.token;
    // Save new token
    setToken(newToken);
    localStorage.setItem('token', newToken);

    // Fetch updated user profile from backend (so we include defaultStoreId etc.)
    if (user?.id) {
      const acc = await apiClient.getAccount(user.id);
      const updatedUser = acc.data.user ?? acc.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    // attempt revoke refresh token if we have it
    try {
      const rt = refreshToken ?? localStorage.getItem('refreshToken');
      if (rt) await apiClient.logout({refreshToken: rt});
      else await apiClient.logout();
    } catch (err) {
      // ignore
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  };

  // Convenience helper used by the UI to set the default store and refresh tokens/user
  const setDefaultStore = async (userId: string, storeId: string) => {
    await apiClient.setDefaultStore(userId, storeId);
    // Refresh auth so JWT includes new storeId claim
    await refreshAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithOtp,
        requestOtp,
        logout,
        refreshAuth,
        setDefaultStore,
        isAuthenticated: !!token,
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
