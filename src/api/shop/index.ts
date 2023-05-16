import { apiClient } from '@/api/apiClient';
import type { ShopListDTO } from '@/api/types/shop';

class ShopService {
  async getAllShops() {
    const response = await apiClient.get<ShopListDTO>('/api/shop/all');
    return response.data;
  }
}

export const shopService = new ShopService();
