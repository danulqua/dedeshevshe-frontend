<template>
  <PPaginator
    :first="offset"
    :value="page"
    :rows="rows"
    :total-records="totalRecords"
    :template="{
      '380px': 'PrevPageLink CurrentPageReport NextPageLink JumpToPageDropdown',
      '450px': 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
      default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
    }"
    @page="handlePageChange"
  />
</template>

<script setup lang="ts">
import type { PaginatorData } from '@/types/paginator';
import { computed } from 'vue';

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  rows: {
    type: Number,
    required: true,
  },
  totalRecords: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits<{
  (event: 'page-change', page: number): void;
}>();

const offset = computed(() => (props.page - 1) * props.rows);

const handlePageChange = ({ page }: PaginatorData) => {
  emit('page-change', page + 1);
};
</script>
