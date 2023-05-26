import { userService } from '@/api/user';
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'primevue/usetoast';

export const notForAuthenticated = async () => {
  const userStore = useUserStore();
  const toast = useToast();

  if (!userStore.user.isAuthenticated) return;

  try {
    const user = await userService.getMyProfile();
    userStore.setUser(user);

    if (userStore.user.isAuthenticated) {
      toast.add({
        severity: 'warn',
        summary: 'Увага',
        detail: 'Ви вже авторизовані',
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
