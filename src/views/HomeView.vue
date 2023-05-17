<template>
  <main class="container">
    <div class="grid row-gap-4">
      <div class="col-12 lg:col-4">
        <ProductsSearchForm />
      </div>
      <div class="col-12 lg:col-8">
        <div v-if="productsStore.isLoading" class="flex justify-content-center">
          <PProgressSpinner />
        </div>
        <ProductList
          v-else-if="productsStore.products.length"
          :products="productsStore.products"
          :show-statuses="true"
        />

        <PPaginator
          v-if="productsStore.products.length"
          v-model="productsStore.page"
          :rows="10"
          :total-records="productsStore.totalCount"
          @page="handlePageChange"
        />

        <div
          v-if="
            !productsStore.isFirstLoad && !productsStore.isLoading && !productsStore.products.length
          "
          class="w-9 mx-auto"
        >
          <p class="flex flex-column gap-1 align-items-center text-lg">
            <span class="text-center">Продукт не знайдено!</span>
            <span class="text-center">Бажаєте створити запит на додавання продукту у систему?</span>
            <RouterLink :to="{ name: 'createProductRequest' }">
              <PButton class="mt-4" label="Запит" icon="pi pi-plus" severity="success" />
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import ProductList from '@/components/ProductList.vue';
import ProductsSearchForm from '@/components/ProductsSearchForm.vue';
import { useProductsStore } from '@/stores/productsStore';
import { useShopsStore } from '@/stores/shopsStore';
import type { PaginatorData } from '@/types/paginator';
import { onMounted } from 'vue';

const productsStore = useProductsStore();

const handlePageChange = ({ page }: PaginatorData) => {
  productsStore.setPage(page + 1);
};

const shopsStore = useShopsStore();
onMounted(() => shopsStore.fetchShops());
</script>
