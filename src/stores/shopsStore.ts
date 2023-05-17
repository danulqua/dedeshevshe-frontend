import { shopService } from '@/api/shop';
import type { ShopDTO } from '@/api/types/shop';
import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

export const useShopsStore = defineStore('shops', () => {
  const shops = ref<ShopDTO[]>([]);

  const toast = useToast();

  const isLoading = ref(false);
  const isError = ref(false);

  const fetchShops = async () => {
    isLoading.value = true;

    try {
      const shopList = await shopService.getAllShops();
      shops.value = shopList.items;
      isError.value = false;
    } catch (error) {
      isError.value = true;

      toast.add({
        severity: 'error',
        summary: 'Помилка завантаження',
        detail: 'Не вдалося завантажити список супермаркетів',
        life: 3000
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    shops,
    isLoading,
    isError,
    fetchShops
  };
});
