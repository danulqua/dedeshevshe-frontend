<template>
  <div class="grid">
    <template v-if="!showSkeleton">
      <ProductListItem
        v-for="product in products"
        :key="isExternalProduct(product) ? product.ean : product.id"
        :product="product"
        :show-status="showStatuses"
      />
    </template>

    <template v-else>
      <ProductListSkeleton v-for="(_, index) in fakeArray" :key="index" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { isExternalProduct } from '@/api/types/product';
import type { ProductExternal, ProductInternal } from '@/api/types/product';

import ProductListItem from '@/components/Product/List/ProductListItem.vue';
import ProductListSkeleton from './ProductListSkeleton.vue';

const props = defineProps({
  products: {
    type: Array as PropType<(ProductExternal | ProductInternal)[]>,
    required: true,
  },
  showStatuses: {
    type: Boolean,
    default: false,
  },
  showSkeleton: {
    type: Boolean,
    default: false,
  },
  skeletonCount: {
    type: Number,
    default: 3,
  },
});

const fakeArray = Array.from({ length: props.skeletonCount });
</script>
