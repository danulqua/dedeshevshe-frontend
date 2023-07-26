import axios from 'axios';
import router from '@/router';
import app from '@/main';
import { useUserStore } from '@/stores/userStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if ([401, 403].includes(error.response?.status)) {
      const userStore = useUserStore();
      userStore.clearUser();

      app.config.globalProperties.$toast.removeAllGroups();
      app.config.globalProperties.$toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: 'Помилка авторизації',
        life: 3000,
      });

      router.push({ name: 'signIn' });
    }

    return Promise.reject(error);
  },
);

export { apiClient };
