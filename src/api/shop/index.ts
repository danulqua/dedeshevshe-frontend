import { apiClient } from '@/api/apiClient';
import type {
  CreateShopDTO,
  ShopDTO,
  ShopListDTO,
  ShopSearchParams,
  UpdateShopDTO,
} from '@/api/types/shop';

class ShopService {
  async getAllShops(searchParams: ShopSearchParams = {}) {
    const response = await apiClient.get<ShopListDTO>('/api/shop/all', {
      params: searchParams,
    });

    return response.data;
  }

  async getShop(shopId: string) {
    const response = await apiClient.get<ShopDTO>(`/api/shop/${shopId}`);
    return response.data;
  }

  async createShop(data: CreateShopDTO) {
    const response = await apiClient.post<ShopDTO>('/api/shop', data);
    return response.data;
  }

  async updateShop(shopId: string, data: UpdateShopDTO) {
    const response = await apiClient.patch<ShopDTO>(`/api/shop/${shopId}`, data);
    return response.data;
  }

  async deleteShop(shopId: string) {
    const response = await apiClient.delete<ShopDTO>(`/api/shop/${shopId}`);
    return response.data;
  }
}

export const shopService = new ShopService();
