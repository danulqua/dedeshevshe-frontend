<template>
  <header class="py-4 surface-50 shadow-1">
    <div class="container flex justify-content-between">
      <h1>
        <RouterLink to="/" class="no-underline text-color">Grocify</RouterLink>
      </h1>
      <RouterLink v-if="!userStore.user.isAuthenticated" :to="{ name: 'signIn' }">
        <PButton label="Увійти" size="small"></PButton>
      </RouterLink>
      <div v-else class="flex gap-2">
        <RouterLink :to="{ name: 'createProductRequest' }">
          <PButton label="Запит" icon="pi pi-plus" size="small" severity="success"></PButton>
        </RouterLink>
        <div>
          <PButton
            icon="pi pi-user"
            size="small"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            @click="toggleUserMenu"
          />
          <PMenu id="overlay_menu" ref="userMenu" :model="userMenuItems" :popup="true" />
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const userStore = useUserStore();
const userMenu = ref();
const userMenuItems = ref([
  {
    label: 'Профіль',
    items: [
      {
        label: 'Мій профіль',
        icon: 'pi pi-user',
        to: '/profile'
      },
      {
        label: 'Вийти',
        icon: 'pi pi-sign-out',
        command: () => userStore.signOut()
      }
    ]
  }
]);

const toggleUserMenu = (event: any) => {
  userMenu.value.toggle(event);
};
</script>
