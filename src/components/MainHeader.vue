<template>
  <header class="p-4 surface-50 shadow-1">
    <div class="container flex justify-content-between">
      <h1>
        <RouterLink to="/" class="no-underline ml-2 text-color">Grocify</RouterLink>
      </h1>
      <RouterLink v-if="!userStore.user.isAuthenticated" :to="{ name: 'signIn' }">
        <PButton label="Увійти" size="small"></PButton>
      </RouterLink>
      <PButton v-else label="Вийти" size="small" @click="signOut"></PButton>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore';
import { RouterLink, useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const signOut = () => {
  userStore.signOut();
  router.push({ name: 'signIn' });
};
</script>
