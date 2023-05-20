import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from '@/router/guards/isAuthenticated.guard';
import { notForAuthenticated } from '@/router/guards/notForAuthenticated';
import { withRoles } from '@/router/guards/withRoles.guard';
import { UserRole } from '@/api/types/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'auth/signIn',
          name: 'signIn',
          component: () => import('@/views/auth/SignInView.vue'),
          beforeEnter: notForAuthenticated
        },
        {
          path: 'auth/signUp',
          name: 'signUp',
          component: () => import('@/views/auth/SignUpView.vue'),
          beforeEnter: notForAuthenticated
        },
        {
          path: 'auth/forgotPassword',
          name: 'forgotPassword',
          component: () => import('@/views/auth/ForgotPasswordView.vue'),
          beforeEnter: notForAuthenticated
        },
        {
          path: 'auth/resetPassword',
          name: 'resetPassword',
          component: () => import('@/views/auth/ResetPasswordView.vue'),
          beforeEnter: notForAuthenticated
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/profile/ProfileView.vue'),
          beforeEnter: isAuthenticated
        },
        {
          path: 'profile/edit',
          name: 'editProfile',
          component: () => import('@/views/profile/EditProfile.vue'),
          beforeEnter: isAuthenticated
        },
        {
          path: 'createProductRequest',
          name: 'createProductRequest',
          component: () => import('@/views/ProductRequestView.vue'),
          beforeEnter: isAuthenticated
        }
      ]
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      beforeEnter: withRoles(UserRole.ADMIN),
      children: [
        {
          path: '',
          name: 'adminHome',
          component: () => import('@/views/admin/AdminHomeView.vue')
        },
        {
          path: 'users',
          name: 'adminUsers',
          component: () => import('@/views/admin/AdminUsersView.vue')
        },
        {
          path: 'shops',
          name: 'adminShops',
          component: () => import('@/views/admin/AdminShopsView.vue')
        },
        {
          path: 'shops/create',
          name: 'adminShopCreate',
          component: () => import('@/views/admin/shops/AdminShopsCreateView.vue')
        },
        {
          path: 'products',
          name: 'adminProducts',
          component: () => import('@/views/admin/AdminProductsView.vue')
        },
        {
          path: 'productRequests',
          name: 'adminProductRequests',
          component: () => import('@/views/admin/AdminProductRequestsView.vue')
        }
      ]
    }
  ]
});

export default router;
