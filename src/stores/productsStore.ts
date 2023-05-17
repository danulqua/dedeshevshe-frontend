import { productsService, type ProductsSearchParams } from '@/api/products';
import type { ProductExternal, ProductInternal } from '@/api/types/product';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductsStore = defineStore('products', () => {
  const products = ref<(ProductInternal | ProductExternal)[]>([]);
  const isFirstLoad = ref(true);

  const title = ref('');
  const shopId = ref<number | null>(null);
  const maxPrice = ref<number | null>(null);
  const discountsOnly = ref(false);
  const page = ref(1);
  const totalPages = ref(0);
  const totalCount = ref(0);
  const isLoading = ref(false);

  const searchProducts = async (searchParams: ProductsSearchParams) => {
    try {
      isLoading.value = true;
      const fetchedProducts = await productsService.getProducts(searchParams);

      products.value = fetchedProducts.items;
      totalPages.value = fetchedProducts.totalPages;
      totalCount.value = fetchedProducts.totalCount;
    } finally {
      isLoading.value = false;
      isFirstLoad.value = false;
    }
  };

  const setPage = (newPage: number) => {
    page.value = newPage;
  };

  return {
    products,
    title,
    shopId,
    maxPrice,
    discountsOnly,
    page,
    totalPages,
    totalCount,
    isLoading,
    isFirstLoad,
    searchProducts,
    setPage
  };
});
