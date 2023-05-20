<template>
  <header
    class="header px-4 flex align-items-center justify-content-between surface-50 shadow-1 relative z-5"
  >
    <div class="flex justify-content-between align-items-center">
      <h1 class="relative mr-6">
        <RouterLink :to="{ name: 'adminHome' }" class="no-underline text-color">Grocify</RouterLink>
        <PTag severity="danger" class="tag uppercase">Admin</PTag>
      </h1>
      <PButton
        icon="pi pi-list"
        severity="secondary"
        outlined
        size="small"
        class="menu-button"
        @click="adminStore.toggleMenu"
      />
    </div>
    <UserMenu />
  </header>
</template>

<script setup lang="ts">
import UserMenu from '@/components/user/UserMenu.vue';
import { useAdminStore } from '@/stores/adminStore';

const adminStore = useAdminStore();
</script>

<style scoped lang="scss">
.tag {
  position: absolute;
  right: -40px;
  top: -10px;
  rotate: 10deg;
}

.menu-button {
  display: none;

  @media (max-width: 1200px) {
    display: flex;
  }
}
</style>
