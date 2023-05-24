<template>
  <div class="grid">
    <ProductListItem
      v-for="product in products"
      :key="isExternalProduct(product) ? product.ean : product.id"
      :product="product"
      :show-status="showStatuses"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { isExternalProduct } from '@/api/types/product';
import type { ProductExternal, ProductInternal } from '@/api/types/product';

import ProductListItem from '@/components/Product/List/ProductListItem.vue';

defineProps({
  products: {
    type: Array as PropType<(ProductExternal | ProductInternal)[]>,
    required: true,
  },
  showStatuses: {
    type: Boolean,
    default: false,
  },
});
</script>
