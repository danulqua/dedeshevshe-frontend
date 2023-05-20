<template>
  <div
        v-if="
          !productsStore.isFirstLoad && !productsStore.isLoading && !productsStore.products.length
        "
        class="w-9 mx-auto"
      >
        <p class="flex flex-column gap-1 align-items-center text-lg">
          <span class="text-center">Продукт не знайдено!</span>
          
          <div v-if="!userStore.user.isAuthenticated" class="flex flex-column gap-1 align-items-center">
            <span class="text-center">
              Ви можете створити запит на додавання продукту у систему. Для цього треба увійти в обліковий запис.
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
        </p>
      </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '@/stores/productsStore';
import { useUserStore } from '@/stores/userStore';

const productsStore = useProductsStore();
const userStore = useUserStore();
</script>

<style scoped>

</style>