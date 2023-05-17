import { apiClient } from '@/api/apiClient';
import type { ProductInternal, ProductListDTO } from '@/api/types/product';

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
}

export const productsService = new ProductsService();
