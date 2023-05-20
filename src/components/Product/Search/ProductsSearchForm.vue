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
          :disabled="!isValid || !isFiltersChanged || productsStore.isLoading"
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
        :options="shopsStore.shops"
        option-label="title"
        option-value="id"
        show-clear
        placeholder="Обрати..."
        class="w-full"
        :disabled="shopsStore.isLoading"
        :loading="shopsStore.isLoading"
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
import { useToast } from 'primevue/usetoast';
import { useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { productTitleSchema } from '@/schemas/searchProducts.schema';
import { useProductsStore } from '@/stores/productsStore';
import { useShopsStore } from '@/stores/shopsStore';

const emit = defineEmits(['search']);

const toast = useToast();
const productsStore = useProductsStore();
const shopsStore = useShopsStore();

const itemsPerPage = 9;

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

onMounted(() => {
  selectedShopId.value = productsStore.shopId;
});

const searchProducts = async () => {
  if (!isValid.value || !isFiltersChanged.value || productsStore.isLoading) return;

  if (isFiltersChanged.value) {
    productsStore.page = 1;
    emit('search');
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
      limit: itemsPerPage,
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
      limit: 9,
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
    productsStore.title !== productTitle.value ||
    productsStore.shopId !== selectedShopId.value ||
    productsStore.maxPrice !== maxPrice.value ||
    productsStore.discountsOnly !== discountsOnly.value
  );
});
</script>

<style scoped></style>
