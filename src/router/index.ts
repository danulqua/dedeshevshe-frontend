import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useUserStore } from '@/stores/userStore';
import { userService } from '@/api/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth/signIn',
      name: 'signIn',
      component: () => import('@/views/auth/SignInView.vue')
    },
    {
      path: '/auth/signUp',
      name: 'signUp',
      component: () => import('@/views/auth/SignUpView.vue')
    },
    {
      path: '/auth/forgotPassword',
      name: 'forgotPassword',
      component: () => import('@/views/auth/ForgotPasswordView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/profile/ProfileView.vue')
    },
    {
      path: '/createProductRequest',
      name: 'createProductRequest',
      component: () => import('@/views/ProductRequestView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore();

        try {
          await userService.getMyProfile();

          if (!userStore.user.isAuthenticated) {
            next({ name: 'signIn' });
          } else {
            next();
          }
        } catch (error) {
          userStore.clearUser();
          next({ name: 'home' });
        }
      }
    }
  ]
});

export default router;
