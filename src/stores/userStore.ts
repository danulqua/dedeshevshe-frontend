import { authService } from '@/api/auth';
import type { UserRole } from '@/api/types/user';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

interface UserStore {
  id: number | null;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

export const useUserStore = defineStore('user', () => {
  const user = useLocalStorage<UserStore>('user', {
    id: null,
    name: null,
    email: null,
    role: null,
    isAuthenticated: false
  });

  const router = useRouter();

  const signIn = async (userEmail: string, userPassword: string) => {
    const { id, name, email, role } = await authService.signIn(userEmail, userPassword);

    user.value = {
      id,
      name,
      email,
      role,
      isAuthenticated: true
    };

    router.push({ name: 'home' });
  };

  const clearUser = () => {
    user.value = {
      id: null,
      name: null,
      email: null,
      role: null,
      isAuthenticated: false
    };
  };

  const setUser = ({ id, name, email, role }: Omit<UserStore, 'isAuthenticated'>) => {
    user.value = {
      id,
      name,
      email,
      role,
      isAuthenticated: true
    };
  };

  const signOut = async () => {
    await authService.signOut();
    clearUser();
    router.push({ name: 'signIn' });
  };

  return {
    user,
    signIn,
    signOut,
    clearUser,
    setUser
  };
});
