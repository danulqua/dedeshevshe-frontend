<template>
  <div class="flex flex-column gap-3">
    <div>
      <div class="p-inputgroup flex-1">
        <PInputText
          v-model="productTitle"
          name="productTitle"
          placeholder="Назва продукту..."
          :class="{ 'p-invalid': errorProductTitle }"
        />
        <PButton icon="pi pi-search" :disabled="!isValid" />
      </div>
      <small v-if="errorProductTitle" class="p-error">{{ errorProductTitle }}</small>
    </div>

    <div class="flex flex-column gap-2">
      <span>Супермаркет</span>
      <PDropdown
        v-model="selectedShop"
        :options="shops"
        option-label="title"
        show-clear
        placeholder="Обрати..."
        class="w-full"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { shopService } from '@/api/shop';
import type { ShopDTO } from '@/api/types/shop';
import { useToast } from 'primevue/usetoast';
import { useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { productTitleSchema } from '@/schemas/searchProducts.schema';

const toast = useToast();
const initialLoading = ref(true);
const shops = ref<ShopDTO[]>([]);

const { value: productTitle, errorMessage: errorProductTitle } = useField(
  'productTitle',
  toTypedSchema(productTitleSchema)
);
const { value: maxPrice, errorMessage: errorMaxPrice } = useField(
  'maxPrice',
  toTypedSchema(z.number().min(0.01, 'Ціна не може бути 0').nullable())
);
const selectedShop = ref<number | null>(null);
const discountsOnly = ref(false);

const isValid = computed(() => {
  return productTitle.value && !errorProductTitle.value && !errorMaxPrice.value;
});

onMounted(async () => {
  try {
    const shopList = await shopService.getAllShops();
    shops.value = shopList.items;
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

const searchProducts = () => {
  console.log('searching products...');
};
</script>

<style scoped></style>
