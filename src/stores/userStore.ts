import { authService } from '@/api/auth';
import type { UserRole } from '@/api/types/user.dto';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

interface UserStore {
  id: number | null;
  email: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

export const useUserStore = defineStore('user', () => {
  const user = useLocalStorage<UserStore>('user', {
    id: null,
    email: null,
    role: null,
    isAuthenticated: false
  });

  const signIn = async (userEmail: string, userPassword: string) => {
    const { id, email, role } = await authService.signIn(userEmail, userPassword);

    user.value = {
      id,
      email,
      role,
      isAuthenticated: true
    };
  };

  const signOut = () => {
    user.value = {
      id: null,
      email: null,
      role: null,
      isAuthenticated: false
    };
  };

  return {
    user,
    signIn,
    signOut
  };
});
