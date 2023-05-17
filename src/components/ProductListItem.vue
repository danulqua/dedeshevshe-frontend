<template>
  <div class="col-4">
    <a :href="product.url" class="no-underline" target="_blank">
      <PCard class="h-full relative">
        <template #header>
          <img
            :alt="product.title"
            :src="
              isExternalProduct(product) ? product.imageUrl : getInternalImageUrl(product.image.url)
            "
            class="w-full"
          />
          <PTag v-if="!product.isExternal" class="absolute" :style="{ right: '5px', top: '5px' }"
            >Користувацький</PTag
          >
        </template>
        <template #title>
          <h2 class="text-lg">{{ product.title }}</h2>
        </template>
        <template #content>
          <div :style="{ height: '70px' }">
            <p class="font-bold">{{ product.weight ? 'Вага' : 'Обʼєм' }}</p>
            <span>{{ product.weight ? product.weight + ' гр' : product.volume + ' мл' }}</span>
          </div>
        </template>
        <template #subtitle>{{
          isExternalProduct(product) ? product.shop : product.shop?.title
        }}</template>
        <template #footer>
          <div class="absolute card-footer">
            <div v-if="product.discount">
              <div v-if="isExternalProduct(product)" class="flex align-items-center gap-2">
                <PTag severity="danger" :value="`-${product.discount.value}%`" />
              </div>
              <div v-else class="flex align-items-center gap-2">
                <PTag severity="danger" :value="`-${product.discount}%`" />
              </div>
            </div>
            <div class="flex align-items-end gap-2 mt-1">
              <span class="text-xl">{{ formatPrice(product.price) }}</span>
              <span v-if="product.discount" class="line-through text-500 text-sm">{{
                formatPrice(
                  isExternalProduct(product) ? product.discount.oldPrice : product.oldPrice!
                )
              }}</span>
            </div>
          </div>
        </template>
      </PCard>
    </a>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import {
  isExternalProduct,
  isInternalProduct,
  type ProductExternal,
  type ProductInternal
} from '@/api/types/product';
import { getInternalImageUrl } from '@/utilities/getInternalImageUrl';
import { formatPrice } from '@/utilities/formatPrice';

defineProps({
  product: {
    type: Object as PropType<ProductExternal | ProductInternal>,
    required: true
  }
});
</script>

<style scoped lang="scss">
.card-footer {
  position: absolute;
  bottom: 20px;
}
</style>
