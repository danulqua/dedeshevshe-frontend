<template>
  <aside class="menu surface-100 p-3">
    <div class="flex flex-column gap-1 h-full">
      <RouterLink v-for="item in menu" :key="item.label" :to="item.to">
        <PButton
          :label="item.label"
          :icon="item.icon"
          text
          severity="secondary"
          class="w-full text-left"
        />
      </RouterLink>
      <RouterLink :to="{ name: 'home' }" class="mt-auto">
        <PButton
          label="На головну"
          icon="pi pi-home"
          text
          severity="secondary"
          class="w-full text-left"
          @click="adminStore.setIsMenuVisible(false)"
        />
      </RouterLink>
    </div>
  </aside>

  <PSidebar v-model:visible="adminStore.isMenuVisible" block-scroll>
    <div class="flex flex-column gap-1 h-full">
      <h2 class="mb-2">Меню</h2>
      <RouterLink v-for="item in menu" :key="item.label" :to="item.to">
        <PButton
          :label="item.label"
          :icon="item.icon"
          text
          severity="secondary"
          class="w-full text-left"
          @click="adminStore.setIsMenuVisible(false)"
        />
      </RouterLink>
      <RouterLink :to="{ name: 'home' }" class="mt-auto">
        <PButton
          label="На головну"
          icon="pi pi-home"
          text
          severity="secondary"
          class="w-full text-left"
          @click="adminStore.setIsMenuVisible(false)"
        />
      </RouterLink>
    </div>
  </PSidebar>
</template>

<script setup lang="ts">
import { useAdminStore } from '@/stores/adminStore';
import { RouterLink } from 'vue-router';

const adminStore = useAdminStore();

const menu = [
  {
    label: 'Користувачі',
    icon: 'pi pi-users',
    to: { name: 'adminUsers' }
  },
  {
    label: 'Супермаркети',
    icon: 'pi pi-building',
    to: { name: 'adminShops' }
  },
  {
    label: 'Додані продукти',
    icon: 'pi pi-shopping-cart',
    to: { name: 'adminProducts' }
  },
  {
    label: 'Запити на додавання',
    icon: 'pi pi-question-circle',
    to: { name: 'adminProductRequests' }
  }
];
</script>

<style scoped lang="scss">
.menu {
  width: 320px;
  height: calc(100vh - var(--header-height));

  @media (max-width: 1200px) {
    display: none;
  }
}
</style>
