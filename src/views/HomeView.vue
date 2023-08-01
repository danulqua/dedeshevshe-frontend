<template>
  <div class="grid row-gap-4">
    <div class="col-12 lg:col-4">
      <ProductsSearchForm />
    </div>
    <div class="col-12 lg:col-8">
      <ProductList
        :products="productsStore.products"
        :show-statuses="false"
        :show-skeleton="productsStore.isLoading"
        :skeleton-count="6"
      />

      <CPaginator
        v-if="productsStore.products.length"
        :page="productsStore.page"
        :total-records="productsStore.totalCount"
        :rows="9"
        @page-change="productsStore.setPage($event)"
      />

      <ProductSearchEmptyState v-if="productsStore.isFirstLoad" />
      <ProductSearchResultMessage v-else />
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
import ProductSearchEmptyState from '../components/Product/Search/ProductSearchEmptyState.vue';

const productsStore = useProductsStore();

const shopsStore = useShopsStore();
onMounted(() => shopsStore.fetchShops());
</script>
