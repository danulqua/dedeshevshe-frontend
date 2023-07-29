<template>
  <div class="col-12 sm:col-6 xl:col-4">
    <a :href="product.url" class="no-underline product-link" target="_blank">
      <PCard class="h-full relative overflow-hidden product-card">
        <template #header>
          <img
            :alt="product.title"
            :src="isExternalProduct(product) ? product.imageUrl : product.image.url"
            class="w-full h-14rem"
            :style="{ objectFit: 'contain' }"
          />
          <PTag v-if="!product.isExternal" class="absolute product-source"> Користувацький </PTag>

          <div v-if="product.discount" class="product-discount">
            <div v-if="isExternalProduct(product)" class="flex align-items-center gap-2">
              <PTag severity="danger" :value="`-${product.discount.value}%`" class="text-sm" />
            </div>
            <div v-else class="flex align-items-center gap-2">
              <PTag severity="danger" :value="`-${product.discount}%`" class="text-sm" />
            </div>
          </div>
        </template>

        <template #title>
          <h2 class="text-lg product-title" :title="product.title">{{ product.title }}</h2>
        </template>

        <template #content>
          <div>
            <p class="font-bold">{{ !product.volume ? 'Вага' : 'Обʼєм' }}</p>
            <span>{{ !product.volume ? product.weight + ' г' : product.volume + ' мл' }}</span>
          </div>
        </template>

        <template #subtitle>
          <div class="flex flex-column">
            <img
              v-if="product.shop.image"
              :src="product.shop.image.url"
              :alt="product.shop.title"
              class="w-6rem max-h-3rem"
              :style="{ objectFit: 'contain' }"
            />
            <span v-else>{{ product.shop.title }}</span>
          </div>
        </template>

        <template #footer>
          <div class="absolute card-footer">
            <div class="flex align-items-end gap-2 mt-1">
              <span class="text-xl" :class="{ 'text-red-500': product.discount }">{{
                formatPrice(product.price)
              }}</span>
              <span v-if="product.discount" class="line-through text-500 text-sm">{{
                formatPrice(
                  isExternalProduct(product) ? product.discount.oldPrice : product.oldPrice!,
                )
              }}</span>
            </div>
          </div>
        </template>
      </PCard>
    </a>
    <PTag v-if="showStatus && tagData" class="w-full mt-1" :severity="tagData.severity">
      {{ tagData.label }}
    </PTag>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import {
  isExternalProduct,
  isInternalProduct,
  type ProductExternal,
  type ProductInternal,
} from '@/api/types/product';
import { formatPrice } from '@/utilities/formatPrice';
import { getProductStatusTagData } from '@/utilities/formatProductStatus';

const props = defineProps({
  product: {
    type: Object as PropType<ProductExternal | ProductInternal>,
    required: true,
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
});

const tagData = computed(
  () => isInternalProduct(props.product) && getProductStatusTagData(props.product.status),
);
</script>

<style scoped lang="scss">
.product-link {
  outline: none;
  display: block;
  border-radius: 8px;

  .product-card {
    position: relative;

    &::after {
      content: 'Перейти на сайт';
      color: transparent;
      position: absolute;
      inset: 0;
      background-color: rgba(0 0 0 / 0.5);
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      backdrop-filter: blur(1px);
    }
  }

  &:hover,
  &:focus-visible {
    box-shadow: 0 0 0 4px rgba(59 130 246 / 0.5);

    & .product-card::after {
      opacity: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
}

.product-source {
  top: 10px;
  right: 10px;
}

.product-discount {
  position: absolute;
  top: 10px;
  left: 10px;
}

.product-title {
  height: 45px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  position: absolute;
  bottom: 20px;
}
</style>
