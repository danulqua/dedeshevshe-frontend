<template>
  <div v-if="isVisible" class="w-9 mx-auto">
    <div class="flex flex-column gap-1 align-items-center text-lg">
      <span class="text-center">Продукт не знайдено!</span>

      <div v-if="!userStore.user.isAuthenticated" class="flex flex-column gap-1 align-items-center">
        <span class="text-center">
          Ви можете створити запит на додавання продукту у систему. Для цього треба увійти в
          обліковий запис.
        </span>
        <RouterLink :to="{ name: 'signIn' }">
          <PButton class="mt-4" label="Увійти" icon="pi pi-sign-in" severity="info" />
        </RouterLink>
      </div>
      <div v-else class="flex flex-column gap-1 align-items-center">
        <span class="text-center">Бажаєте створити запит на додавання продукту у систему?</span>
        <RouterLink :to="{ name: 'createProductRequest' }">
          <PButton class="mt-4" label="Запит" icon="pi pi-plus" severity="success" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '@/stores/productsStore';
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

const productsStore = useProductsStore();
const userStore = useUserStore();

const isVisible = computed(
  () => !productsStore.isFirstLoad && !productsStore.isLoading && !productsStore.products.length
);
</script>

<style scoped></style>
