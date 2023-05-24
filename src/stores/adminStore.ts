import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAdminStore = defineStore('admin', () => {
  const isMenuVisible = ref(false);

  const setIsMenuVisible = (value: boolean) => (isMenuVisible.value = value);
  const toggleMenu = () => (isMenuVisible.value = !isMenuVisible.value);

  return {
    isMenuVisible,
    setIsMenuVisible,
    toggleMenu,
  };
});
