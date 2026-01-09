import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/admin';

interface AdminAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Demo users for development - In production, this would be authenticated via Supabase
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'superadmin@diom.com': {
    password: 'admin123',
    user: {
      id: 'super-1',
      email: 'superadmin@diom.com',
      name: 'Super Admin',
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      isActive: true,
    },
  },
  'admin@diom.com': {
    password: 'admin123',
    user: {
      id: 'admin-1',
      email: 'admin@diom.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
      isActive: true,
    },
  },
};

const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 3,
  admin: 2,
  delivery_agent: 1,
};

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('admin_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user);
      localStorage.setItem('admin_user', JSON.stringify(demoUser.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userLevel = ROLE_HIERARCHY[user.role];

    return roles.some(role => userLevel >= ROLE_HIERARCHY[role]);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
