import { apiClient } from '@/api/apiClient';
import type { CreateProductDTO, ProductInternal, ProductListDTO } from '@/api/types/product';

export interface ProductsSearchParams {
  title: string;
  shopId?: number;
  maxPrice?: number;
  discountsOnly?: boolean;
  limit: number;
  page: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

class ProductsService {
  async getProducts(searchParams: ProductsSearchParams) {
    const response = await apiClient<ProductListDTO>('/api/product/global', {
      params: {
        title: searchParams.title,
        shopId: searchParams.shopId,
        maxPrice: searchParams.maxPrice || undefined,
        discountsOnly: searchParams.discountsOnly || undefined,
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

  // async createProduct(product: CreateProductDTO) {
  //   const response = await apiClient.post<ProductInternal>('/api/product/request')
  // }
}

export const productsService = new ProductsService();
