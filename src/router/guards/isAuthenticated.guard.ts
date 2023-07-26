import { useUserStore } from '@/stores/userStore';
import { useToast } from 'primevue/usetoast';

export const isAuthenticated = async () => {
  const userStore = useUserStore();
  const toast = useToast();

  try {
    if (!userStore.user.isAuthenticated) {
      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: 'Помилка авторизації',
        life: 3000,
      });

      return { name: 'signIn' };
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
