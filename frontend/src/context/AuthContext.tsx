'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../services/api';

export interface User {
  id?: string;
  employee_id: string;
  name: string;
  department: string;
  role: 'ENGINEERING' | 'TRACTION' | 'SIGNAL_TELECOM' | string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (employeeId: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (action: 'CREATE' | 'EDIT' | 'DELETE', recordDepartment: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  hasRole: () => false,
  hasPermission: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load session from localStorage on app start
    const savedUser = localStorage.getItem('railopt_user');
    const savedToken = localStorage.getItem('railopt_token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem('railopt_user');
        localStorage.removeItem('railopt_token');
      }
    } else {
      // Default initial session for SIH presentation
      const defaultUser: User = {
        employee_id: 'ENG001',
        name: 'Demo Engineering Officer',
        department: 'Engineering / P-Way',
        role: 'ENGINEERING'
      };
      setUser(defaultUser);
      setToken('demo_token_eng001');
    }
    setIsLoading(false);
  }, []);

  const login = async (employeeId: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await loginUser(employeeId, password);
      if (res && res.user && res.access_token) {
        setUser(res.user);
        setToken(res.access_token);
        localStorage.setItem('railopt_user', JSON.stringify(res.user));
        localStorage.setItem('railopt_token', res.access_token);
        setIsLoading(false);
        router.push('/dashboard');
        return true;
      }
    } catch (e) {
      console.error("Login failed", e);
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('railopt_user');
    localStorage.removeItem('railopt_token');
    router.push('/login');
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    return user.role.toUpperCase() === role.toUpperCase();
  };

  const hasPermission = (action: 'CREATE' | 'EDIT' | 'DELETE', recordDepartment: string) => {
    if (!user) return false;
    const userDept = user.department.toLowerCase();
    const recDept = recordDepartment.toLowerCase();

    if (userDept.includes('engineering') || userDept.includes('p-way')) {
      return recDept.includes('engineering') || recDept.includes('p-way');
    }
    if (userDept.includes('traction') || userDept.includes('ohe') || userDept.includes('trd')) {
      return recDept.includes('traction') || recDept.includes('ohe') || recDept.includes('trd');
    }
    if (userDept.includes('signal') || userDept.includes('telecom') || userDept.includes('s&t')) {
      return recDept.includes('signal') || recDept.includes('telecom') || recDept.includes('s&t');
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
