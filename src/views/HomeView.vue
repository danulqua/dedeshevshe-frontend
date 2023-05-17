<template>
  <main class="container">
    <div class="grid">
      <div class="col-4">
        <ProductsSearchForm />
      </div>
      <div class="col-8">
        <div v-if="productsStore.isLoading" class="flex justify-content-center">
          <PProgressSpinner />
        </div>
        <ProductList
          v-else-if="productsStore.products.length"
          :products="productsStore.products"
          :show-statuses="true"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import ProductList from '@/components/ProductList.vue';
import ProductsSearchForm from '@/components/ProductsSearchForm.vue';
import { useProductsStore } from '@/stores/productsStore';

const productsStore = useProductsStore();
</script>
