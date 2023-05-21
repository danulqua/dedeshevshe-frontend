import { apiClient } from '@/api/apiClient';
import type {
  CreateProductDTO,
  ProductExternal,
  ProductInternal,
  ProductListDTO,
  ProductsSearchParams
} from '@/api/types/product';

class ProductsService {
  async getProducts<T = ProductInternal | ProductExternal>(
    globally: boolean,
    searchParams: ProductsSearchParams
  ) {
    const endpoint = globally ? '/api/product/global' : '/api/product/all';
    const response = await apiClient<ProductListDTO<T>>(endpoint, {
      params: {
        title: searchParams.title,
        shopId: searchParams.shopId,
        maxPrice: searchParams.maxPrice || undefined,
        discountsOnly: searchParams.discountsOnly || undefined,
        status: searchParams.status || undefined,
        limit: searchParams.limit,
        page: searchParams.page,
        sortBy: searchParams.sortBy || undefined,
        order: searchParams.order || undefined
      }
    });

    return response.data;
  }

  async getMyRequests() {
    const response = await apiClient<ProductListDTO<ProductInternal>>('/api/product/request/my');
    return response.data;
  }

  async createRequest(product: CreateProductDTO) {
    const response = await apiClient.post<ProductInternal>('/api/product/request', product);
    return response.data;
  }

  async deleteProduct(productId: string) {
    const response = await apiClient.delete(`/api/product/${productId}`);
    return response.data;
  }

  // async createProduct(product: CreateProductDTO) {
  //   const response = await apiClient.post<ProductInternal>('/api/product/request')
  // }
}

export const productsService = new ProductsService();
