import { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/types/admin';

const STORAGE_KEY = 'diom_admin_users';

const getInitialUsers = (): User[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  // Sample data for demo
  const sampleUsers: User[] = [
    {
      id: 'super-1',
      email: 'superadmin@diom.com',
      name: 'Super Admin',
      role: 'super_admin',
      phone: '+234 800 000 0001',
      createdAt: '2024-01-01T10:00:00Z',
      isActive: true,
    },
    {
      id: 'admin-1',
      email: 'admin@diom.com',
      name: 'Admin User',
      role: 'admin',
      phone: '+234 800 000 0002',
      createdAt: '2024-03-15T10:00:00Z',
      isActive: true,
    },
    {
      id: 'admin-2',
      email: 'operations@diom.com',
      name: 'Operations Manager',
      role: 'admin',
      phone: '+234 800 000 0003',
      createdAt: '2024-05-20T10:00:00Z',
      isActive: true,
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleUsers));
  return sampleUsers;
};

export const useAdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUsers(getInitialUsers());
    setIsLoading(false);
  }, []);

  const saveUsers = useCallback((newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
  }, []);

  const createUser = useCallback((userData: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const newUsers = [newUser, ...users];
    saveUsers(newUsers);
    return newUser;
  }, [users, saveUsers]);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    const newUsers = users.map(user => {
      if (user.id !== userId) return user;
      return { ...user, ...updates };
    });

    saveUsers(newUsers);
  }, [users, saveUsers]);

  const deleteUser = useCallback((userId: string) => {
    const newUsers = users.filter(u => u.id !== userId);
    saveUsers(newUsers);
  }, [users, saveUsers]);

  const toggleUserStatus = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateUser(userId, { isActive: !user.isActive });
    }
  }, [users, updateUser]);

  const changeUserRole = useCallback((userId: string, newRole: UserRole) => {
    updateUser(userId, { role: newRole });
  }, [updateUser]);

  const getUsersByRole = useCallback((role: UserRole) => {
    return users.filter(u => u.role === role);
  }, [users]);

  return {
    users,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    changeUserRole,
    getUsersByRole,
  };
};
