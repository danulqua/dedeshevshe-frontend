import type { UserRole } from '@/api/types/user';
import { userService } from '@/api/user';
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'primevue/usetoast';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const withRoles =
  (...roles: UserRole[]) =>
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
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

        next({ name: 'signIn' });
      } else if (!roles.includes(userStore.user.role!)) {
        toast.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'У вас немає доступу до цієї сторінки',
          life: 3000,
        });

        next({ name: 'home' });
      } else {
        next();
      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: 'Помилка авторизації',
        life: 3000,
      });

      userStore.clearUser();
      next({ name: 'signIn' });
    }
  };
