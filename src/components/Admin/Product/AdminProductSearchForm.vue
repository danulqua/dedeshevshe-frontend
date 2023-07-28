<template>
  <div class="flex flex-wrap align-items-start gap-2">
    <PInputText
      v-model.trim="productTitle"
      name="productTitle"
      placeholder="Назва продукту..."
      @keydown.enter="searchProducts"
    />
    <PDropdown
      v-model="selectedShopId"
      :options="shopsStore.shops"
      option-label="title"
      option-value="id"
      show-clear
      placeholder="Супермаркет..."
      :disabled="shopsStore.isLoading"
      :loading="shopsStore.isLoading"
    >
      <template #option="{ option }: { option: ShopDTO }">
        <div class="flex align-items-center h-2rem">
          <img
            v-if="option.image"
            :alt="option.title"
            :src="option.image.url"
            class="max-w-6rem max-h-2rem mr-2"
          />
          <div v-else>{{ option.title }}</div>
        </div>
      </template>
    </PDropdown>
    <div class="flex flex-column">
      <PInputNumber
        v-model="maxPrice"
        input-id="maxPrice"
        name="maxPrice"
        prefix="₴"
        placeholder="Макс. ціна..."
        min="0"
        :min-fraction-digits="2"
        :max-fraction-digits="2"
        :class="{ 'p-invalid': errorMaxPrice }"
      />
      <small v-if="errorMaxPrice" class="p-error">{{ errorMaxPrice }}</small>
    </div>
    <div class="flex align-self-center align-items-center gap-2">
      <PCheckbox
        v-model="discountsOnly"
        input-id="discountsOnly"
        name="discountsOnly"
        value="discountsOnly"
        binary
      />
      <label for="discountsOnly">Тільки зі знижками</label>
    </div>
    <PDropdown
      v-if="props.withStatus"
      v-model="status"
      :options="statuses"
      option-label="status"
      option-value="value"
      show-clear
      placeholder="Статус..."
    />
    <PButton icon="pi pi-search" :disabled="!isValid" @click="searchProducts" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useShopsStore } from '@/stores/shopsStore';
import type { ProductStatus } from '@/api/types/product';
import type { ShopDTO } from '../../../api/types/shop';

const props = defineProps({
  withStatus: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['search']);

const shopsStore = useShopsStore();

const productTitle = ref('');
const { value: maxPrice, errorMessage: errorMaxPrice } = useField(
  'maxPrice',
  toTypedSchema(z.number().min(0.01, 'Ціна не може бути 0').nullable()),
  { initialValue: null },
);
const selectedShopId = ref<number | null>(null);
const discountsOnly = ref(false);
const status = ref<Omit<ProductStatus, 'IN_REVIEW'>>();

const isValid = computed(() => !errorMaxPrice.value);

const statuses = [
  { status: 'Активні', value: 'ACTIVE' },
  { status: 'Деактивовані', value: 'INACTIVE' },
];

const searchProducts = async () => {
  if (isValid.value) {
    emit('search', {
      title: productTitle.value || undefined,
      maxPrice: maxPrice.value || undefined,
      shopId: selectedShopId.value || undefined,
      discountsOnly: discountsOnly.value || undefined,
      status: status.value || undefined,
    });
  }
};

onMounted(shopsStore.fetchShops);
</script>

<style scoped></style>
