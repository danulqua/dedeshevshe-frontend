<template>
  <div class="flex flex-column gap-3">
    <div>
      <div class="p-inputgroup flex-1">
        <PInputText
          v-model="productTitle"
          name="productTitle"
          placeholder="Назва продукту..."
          :class="{ 'p-invalid': errorProductTitle }"
          @keydown.enter="searchProducts"
        />
        <PButton
          icon="pi pi-search"
          :disabled="!isValid || productsStore.isLoading"
          :loading="productsStore.isLoading"
          @click="searchProducts"
        />
      </div>
      <small v-if="errorProductTitle" class="p-error">{{ errorProductTitle }}</small>
    </div>

    <div class="flex flex-column gap-2">
      <span>Супермаркет</span>
      <PDropdown
        v-model="selectedShopId"
        :options="shops"
        option-label="title"
        option-value="id"
        show-clear
        placeholder="Обрати..."
        class="w-full"
        :disabled="initialLoading"
        :loading="initialLoading"
      />
    </div>

    <div>
      <div class="flex flex-column gap-2">
        <label for="maxPrice">Макс. ціна</label>
        <PInputNumber
          v-model="maxPrice"
          input-id="maxPrice"
          name="maxPrice"
          prefix="₴"
          placeholder="Введіть ціну..."
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          :class="{ 'p-invalid': errorMaxPrice }"
        />
      </div>
      <small v-if="errorMaxPrice" class="p-error">{{ errorMaxPrice }}</small>
    </div>

    <div class="flex align-items-center gap-2">
      <PCheckbox
        v-model="discountsOnly"
        input-id="discountsOnly"
        name="discountsOnly"
        value="discountsOnly"
        binary
      />
      <label for="discountsOnly">Тільки зі знижками</label>
    </div>

    <PButton
      v-if="productTitle && isFiltersChanged"
      label="Прийняти фільтри"
      icon="pi pi-filter"
      class="align-self-start"
      @click="handleApplyFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { shopService } from '@/api/shop';
import type { ShopDTO } from '@/api/types/shop';
import { useToast } from 'primevue/usetoast';
import { useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { productTitleSchema } from '@/schemas/searchProducts.schema';
import { useProductsStore } from '@/stores/productsStore';

const toast = useToast();
const initialLoading = ref(true);
const shops = ref<ShopDTO[]>([]);
const productsStore = useProductsStore();

const { value: productTitle, errorMessage: errorProductTitle } = useField(
  'productTitle',
  toTypedSchema(productTitleSchema),
  { initialValue: productsStore.title }
);
const { value: maxPrice, errorMessage: errorMaxPrice } = useField(
  'maxPrice',
  toTypedSchema(z.number().min(0.01, 'Ціна не може бути 0').nullable()),
  { initialValue: productsStore.maxPrice }
);
const selectedShopId = ref<number | null>(null);
const discountsOnly = ref(productsStore.discountsOnly);

const isValid = computed(() => {
  return productTitle.value && !errorProductTitle.value && !errorMaxPrice.value;
});

onMounted(async () => {
  try {
    const shopList = await shopService.getAllShops();
    shops.value = shopList.items;
    selectedShopId.value = productsStore.shopId;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка завантаження',
      detail: 'Не вдалося завантажити список супермаркетів',
      life: 3000
    });
  } finally {
    initialLoading.value = false;
  }
});

const searchProducts = async () => {
  if (!isValid.value || productsStore.isLoading) return;

  if (isFiltersChanged.value) {
    productsStore.page = 1;
  }

  try {
    productsStore.title = productTitle.value;
    productsStore.shopId = selectedShopId.value;
    productsStore.maxPrice = maxPrice.value;
    productsStore.discountsOnly = discountsOnly.value;

    await productsStore.searchProducts({
      title: productTitle.value,
      maxPrice: maxPrice.value || undefined,
      shopId: selectedShopId.value || undefined,
      discountsOnly: discountsOnly.value || undefined,
      limit: 10,
      page: productsStore.page
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Під час пошуку сталась помилка. Спробуйте пізніше.',
      life: 3000
    });
  }
};

const handleApplyFilters = () => {
  if (!isValid.value || productsStore.isLoading) return;

  productsStore.page = 1;
  searchProducts();
};

const paginate = async () => {
  try {
    await productsStore.searchProducts({
      title: productsStore.title,
      maxPrice: productsStore.maxPrice || undefined,
      shopId: productsStore.shopId || undefined,
      discountsOnly: productsStore.discountsOnly || undefined,
      limit: 10,
      page: productsStore.page
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Під час пошуку сталась помилка. Спробуйте пізніше.',
      life: 3000
    });
  }
};

watch(
  () => productsStore.page,
  (oldPage: number, newPage: number) => {
    if (oldPage !== newPage) {
      paginate();
    }
  }
);

const isFiltersChanged = computed(() => {
  return (
    productsStore.shopId !== selectedShopId.value ||
    productsStore.maxPrice !== maxPrice.value ||
    productsStore.discountsOnly !== discountsOnly.value
  );
});
</script>

<style scoped></style>
