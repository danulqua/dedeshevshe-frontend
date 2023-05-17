<template>
  <div class="container">
    <div class="grid row-gap-4">
      <div class="col-12 lg:col-4">
        <h2 class="mb-4">Профіль користувача</h2>
        <div class="flex flex-column gap-2">
          <div class="flex gap-2">
            <span class="font-bold">Ім'я:</span>
            <span>{{ userStore.user.name }}</span>
          </div>

          <div class="flex gap-2">
            <span class="font-bold">Email:</span>
            <span>{{ userStore.user.email }}</span>
          </div>

          <div class="flex align-items-center gap-2">
            <span class="font-bold">Роль:</span>
            <PTag :severity="userStore.user.role === 'ADMIN' ? 'danger' : 'info'">
              {{ userStore.user.role }}
            </PTag>
          </div>
        </div>
        <RouterLink :to="{ name: 'editProfile' }">
          <PButton class="mt-3" label="Редагувати" icon="pi pi-pencil" size="small" outlined />
        </RouterLink>
      </div>
      <div class="col-12 lg:col-8">
        <h2 class="mb-4">Запити на додавання</h2>

        <div v-if="isProductsLoading" class="flex justify-content-center">
          <PProgressSpinner />
        </div>
        <ProductList v-else-if="products.length" :products="products" :show-statuses="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { productsService } from '@/api/products';
import type { ProductInternal } from '@/api/types/product';
import ProductList from '@/components/ProductList.vue';
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'primevue/usetoast';

const userStore = useUserStore();
const toast = useToast();

const products = ref<ProductInternal[]>([]);
const isProductsLoading = ref(false);

onMounted(async () => {
  isProductsLoading.value = true;

  try {
    products.value = (await productsService.getMyRequests()).items;
  } catch {
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
