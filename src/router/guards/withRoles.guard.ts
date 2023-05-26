import type { UserRole } from '@/api/types/user';
import { userService } from '@/api/user';
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'primevue/usetoast';

export const withRoles =
  (...roles: UserRole[]) =>
  async () => {
    const userStore = useUserStore();
    const toast = useToast();

    try {
      const user = await userService.getMyProfile();
      userStore.setUser(user);

      if (!userStore.user.isAuthenticated) {
        toast.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Помилка авторизації',
          life: 3000,
        });

        return { name: 'signIn' };
      }

      if (!roles.includes(userStore.user.role!)) {
        toast.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'У вас немає доступу до цієї сторінки',
          life: 3000,
        });

        return { name: 'home' };
      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: 'Помилка авторизації',
        life: 3000,
      });

      userStore.clearUser();
      return { name: 'signIn' };
    }
  };
