<template>
  <main class="container">
    <div class="grid row-gap-4">
      <div class="col-12 lg:col-4">
        <ProductsSearchForm
          @search="offset = 0"
        />
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

        <PPaginator
          v-if="productsStore.products.length"

          v-model="productsStore.page"
          v-model:first="offset"
          :rows="9"
          :total-records="productsStore.totalCount"
          :template="{
            '380px': 'PrevPageLink CurrentPageReport NextPageLink JumpToPageDropdown',
            '450px': 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
            default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
          }"
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
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import ProductList from '@/components/ProductList.vue';
import ProductsSearchForm from '@/components/ProductsSearchForm.vue';
import { useProductsStore } from '@/stores/productsStore';
import { useShopsStore } from '@/stores/shopsStore';
import { useUserStore } from '@/stores/userStore';
import type { PaginatorData } from '@/types/paginator';
import { onMounted, ref } from 'vue';

const offset = ref(0);

const userStore = useUserStore();
const productsStore = useProductsStore();

const handlePageChange = ({ page }: PaginatorData) => {
  productsStore.setPage(page + 1);
  offset.value = page * 9;
};

const shopsStore = useShopsStore();
onMounted(() => shopsStore.fetchShops());
</script>
