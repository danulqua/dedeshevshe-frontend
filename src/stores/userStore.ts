import { authService } from '@/api/auth';
import type { UserRole } from '@/api/types/user.dto';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

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

  const router = useRouter();

  const signIn = async (userEmail: string, userPassword: string) => {
    const { id, email, role } = await authService.signIn(userEmail, userPassword);

    user.value = {
      id,
      email,
      role,
      isAuthenticated: true
    };

    router.push({ name: 'home' });
  };

  const signOut = async () => {
    await authService.signOut();

    user.value = {
      id: null,
      email: null,
      role: null,
      isAuthenticated: false
    };

    router.push({ name: 'signIn' });
  };

  return {
    user,
    signIn,
    signOut
  };
});
