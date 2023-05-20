import { apiClient } from '@/api/apiClient';
import type { ShopListDTO, ShopSearchParams } from '@/api/types/shop';

class ShopService {
  async getAllShops(searchParams: ShopSearchParams = {}) {
    const response = await apiClient.get<ShopListDTO>('/api/shop/all', {
      params: searchParams
    });

    return response.data;
  }

  async deleteShop(shopId: number) {
    const response = await apiClient.delete(`/api/shop/${shopId}`);
    return response.data;
  }
}

export const shopService = new ShopService();
