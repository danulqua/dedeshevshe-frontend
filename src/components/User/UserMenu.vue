<template>
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
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';

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

<style scoped></style>
