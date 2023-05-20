<template>
  <div class="flex flex-wrap gap-2">
    <PInputText
      v-model.trim="title"
      name="title"
      placeholder="Назва супермаркету..."
      @keydown.enter="searchShops"
    />
    <PDropdown
      v-model="source"
      :options="sources"
      option-label="title"
      option-value="value"
      show-clear
      placeholder="Джерело постачання..."
    />
    <PButton icon="pi pi-search" @click="searchShops" />
  </div>
</template>

<script setup lang="ts">
import type { ShopSource } from '@/api/types/shop';
import { ref } from 'vue';

const emit = defineEmits<{
  (event: 'search', params: { title?: string; source?: ShopSource }): void;
}>();

const title = ref('');
const source = ref<ShopSource>();

const sources = [
  { title: 'Внутрішній', value: 'internal' },
  { title: 'Зовнішній', value: 'external' }
];

const searchShops = () => {
  emit('search', { title: title.value || undefined, source: source.value });
};
</script>

<style scoped></style>
