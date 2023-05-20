<template>
  <header class="py-4 surface-50 shadow-1">
    <div class="container flex justify-content-between">
      <h1>
        <RouterLink to="/" class="no-underline text-color">Grocify</RouterLink>
      </h1>
      <RouterLink v-if="!userStore.user.isAuthenticated" :to="{ name: 'signIn' }">
        <PButton label="Увійти" icon="pi pi-sign-in" size="small"></PButton>
      </RouterLink>
      <div v-else class="flex gap-2">
        <RouterLink :to="{ name: 'createProductRequest' }">
          <PButton label="Запит" icon="pi pi-plus" size="small" severity="success"></PButton>
        </RouterLink>
        <UserMenu />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import UserMenu from '@/components/user/UserMenu.vue';
import { useUserStore } from '@/stores/userStore';
import { RouterLink } from 'vue-router';

const userStore = useUserStore();
</script>
