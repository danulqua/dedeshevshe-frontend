<template>
  <div class="grid row-gap-4">
    <div class="col-12 lg:col-4">
      <UserProfile />
    </div>
    <div class="col-12 lg:col-8">
      <h2 class="mb-4">Запити на додавання {{ products.length ? `(${products.length})` : '' }}</h2>

      <div v-if="isProductsLoading" class="flex justify-content-center">
        <PProgressSpinner />
      </div>

      <ProductList v-else-if="products.length" :products="products" :show-statuses="true" />

      <p v-else-if="!isError" class="flex flex-column gap-1 align-items-center text-lg">
        <span class="text-center">У вас немає запитів на додавання.</span>
        <span class="text-center">Бажаєте створити запит на додавання продукту у систему?</span>
        <RouterLink :to="{ name: 'createProductRequest' }">
          <PButton class="mt-4" label="Запит" icon="pi pi-plus" severity="success" />
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { productsService } from '@/api/products';
import type { ProductInternal } from '@/api/types/product';
import ProductList from '@/components/Product/List/ProductList.vue';
import { useToast } from 'primevue/usetoast';
import UserProfile from '@/components/User/UserProfile.vue';

const toast = useToast();

const products = ref<ProductInternal[]>([]);
const isProductsLoading = ref(false);
const isError = ref(false);

onMounted(async () => {
  isProductsLoading.value = true;

  try {
    products.value = (await productsService.getMyRequests()).items;
  } catch {
    isError.value = true;

    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося завантажити запити на додавання продуктів',
      life: 3000
    });
  } finally {
    isProductsLoading.value = false;
  }
});
</script>

<style scoped></style>
