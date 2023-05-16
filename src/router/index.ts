import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

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
    }
  ]
});

export default router;
