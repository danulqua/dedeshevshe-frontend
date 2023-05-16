<template>
  <header class="p-4 surface-50 shadow-1">
    <div class="container flex justify-content-between">
      <h1>
        <RouterLink to="/" class="no-underline text-color">Grocify</RouterLink>
      </h1>
      <RouterLink v-if="!userStore.user.isAuthenticated" :to="{ name: 'signIn' }">
        <PButton label="Увійти" size="small"></PButton>
      </RouterLink>
      <PButton v-else label="Вийти" size="small" @click="userStore.signOut"></PButton>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore';
import { RouterLink } from 'vue-router';

const userStore = useUserStore();
</script>
