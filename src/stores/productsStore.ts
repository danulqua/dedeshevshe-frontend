import { productsService } from '@/api/products';
import type { ProductExternal, ProductInternal, ProductsSearchParams } from '@/api/types/product';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductsStore = defineStore('products', () => {
  const products = ref<(ProductInternal | ProductExternal)[]>([]);

  const page = ref(1);
  const totalPages = ref(0);
  const totalCount = ref(0);
  const isLoading = ref(false);
  const isError = ref(false);
  const isFirstLoad = ref(true);

  const searchProducts = async (searchParams: ProductsSearchParams) => {
    try {
      isError.value = false;
      isLoading.value = true;
      const fetchedProducts = await productsService.getProducts(true, searchParams);

      products.value = fetchedProducts.items;
      totalPages.value = fetchedProducts.totalPages;
      totalCount.value = fetchedProducts.totalCount;
    } catch (error) {
      isError.value = true;
      console.log(error);
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
    page,
    totalPages,
    totalCount,
    isLoading,
    isError,
    isFirstLoad,
    searchProducts,
    setPage,
  };
});
