import { apiClient } from '@/api/apiClient';
import type { ProductListDTO } from '@/api/types/product';

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
  public async getProducts(searchParams: ProductsSearchParams) {
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
}

export const productsService = new ProductsService();
