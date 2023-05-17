import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { isAuthenticated } from '@/router/guards/isAuthenticated.guard';

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
      component: () => import('@/views/profile/ProfileView.vue'),
      beforeEnter: isAuthenticated
    },
    {
      path: '/profile/edit',
      name: 'editProfile',
      component: () => import('@/views/profile/EditProfile.vue'),
      beforeEnter: isAuthenticated
    },
    {
      path: '/createProductRequest',
      name: 'createProductRequest',
      component: () => import('@/views/ProductRequestView.vue'),
      beforeEnter: isAuthenticated
    }
  ]
});

export default router;
