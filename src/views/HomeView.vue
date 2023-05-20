<template>
  <div class="grid row-gap-4">
    <div class="col-12 lg:col-4">
      <ProductsSearchForm @search="offset = 0" />
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
        @page-change="(event) => productsStore.setPage(event)"
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
import type { PaginatorData } from '@/types/paginator';
import { onMounted, ref } from 'vue';

const offset = ref(0);

const productsStore = useProductsStore();

const handlePageChange = ({ page }: PaginatorData) => {
  productsStore.setPage(page + 1);
  offset.value = page * 9;
};

const shopsStore = useShopsStore();
onMounted(() => shopsStore.fetchShops());
</script>
