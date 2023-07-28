<template>
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
        :show-statuses="false"
      />

      <CPaginator
        v-if="productsStore.products.length"
        :page="productsStore.page"
        :total-records="productsStore.totalCount"
        :rows="9"
        @page-change="productsStore.setPage($event)"
      />

      <ProductSearchResultMessage />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductList from '@/components/Product/List/ProductList.vue';
import ProductSearchResultMessage from '@/components/Product/Search/ProductSearchResultMessage.vue';
import ProductsSearchForm from '@/components/Product/Search/ProductsSearchForm.vue';
import CPaginator from '@/components/common/CPaginator.vue';
import { useProductsStore } from '@/stores/productsStore';
import { useShopsStore } from '@/stores/shopsStore';
import { onMounted } from 'vue';

const productsStore = useProductsStore();

const shopsStore = useShopsStore();
onMounted(() => shopsStore.fetchShops());
</script>
