import { userService } from '@/api/user';
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'primevue/usetoast';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const notForAuthenticated = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userStore = useUserStore();
  const toast = useToast();

  if (['signIn', 'signUp', 'forgotPassword', 'resetPassword'].includes(to.name as string)) {
    return next();
  }

  try {
    const user = await userService.getMyProfile();
    userStore.setUser(user);

    if (userStore.user.isAuthenticated) {
      toast.add({
        severity: 'warn',
        summary: 'Увага',
        detail: 'Ви вже авторизовані',
        life: 3000
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
      life: 3000
    });

    userStore.clearUser();
    next({ name: 'signIn' });
  }
};
