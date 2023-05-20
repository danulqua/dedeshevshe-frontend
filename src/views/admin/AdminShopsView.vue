<template>
  <h2 class="mb-4">Супермаркети {{ sortOrder }}, {{ sortBy }}, {{ totalCount }}</h2>

  <PDataTable
    v-model:sort-order="sortOrder"
    v-model:sort-field="sortBy"
    :value="shops"
    :loading="isLoading"
    :rows="rowsPerPage"
    paginator
    paginator-template
    scrollable
  >
    <PColumn field="id" header="ID" sortable />
    <PColumn field="title" header="Назва" sortable />
    <PColumn field="isExternal" header="Джерело постачання" sortable>
      <template #body="slotProps: { data: ShopDTO }">
        <PTag v-if="slotProps.data.isExternal" severity="warning">Зовнішній</PTag>
        <PTag v-else severity="success">Внутрішній</PTag>
      </template>
    </PColumn>
    <PColumn field="createdAt" header="Дата створення" sortable>
      <template #body="slotProps: { data: ShopDTO }">
        {{ formatDate(slotProps.data.createdAt, 'YYYY.MM.DD, hh:mm:ss') }}
      </template>
    </PColumn>
    <PColumn field="updatedAt" header="Дата оновлення" sortable>
      <template #body="slotProps: { data: ShopDTO }">
        {{ formatDate(slotProps.data.createdAt, 'YYYY.MM.DD, hh:mm:ss') }}
      </template>
    </PColumn>
    <PColumn>
      <template #body="{ data }: { data: ShopDTO }">
        <div class="flex align-items-center gap-1">
          <PButton
            size="small"
            icon="pi pi-pencil"
            :severity="data.isExternal ? 'secondary' : 'info'"
            text
            rounded
            :disabled="data.isExternal"
            @click="handleEdit(data.id)"
          />
          <PButton
            size="small"
            icon="pi pi-trash"
            :severity="data.isExternal ? 'secondary' : 'danger'"
            text
            rounded
            :disabled="data.isExternal"
            @click="handleClickDelete(data.id)"
          />
        </div>
      </template>
    </PColumn>
  </PDataTable>

  <CPaginator
    :page="page"
    :rows="10"
    :total-records="totalCount"
    @page-change="(event) => (page = event)"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import type { ShopDTO, ShopSearchParams } from '@/api/types/shop';
import { shopService } from '@/api/shop';
import { useToast } from 'primevue/usetoast';
import { formatDate } from '@/utilities/formatDate';
import CPaginator from '@/components/common/CPaginator.vue';
import { watch } from 'vue';

const isLoading = ref(false);

const shops = ref<ShopDTO[]>([]);
const searchParams = ref<ShopSearchParams>({});
const oldSearchParams = ref<ShopSearchParams>({});
const totalPages = ref(0);
const totalCount = ref(0);

const sortOrder = ref(0);
const sortBy = ref(null);
const rowsPerPage = ref(10);
const page = ref(1);

const order = computed(() => (sortOrder.value === 1 ? 'asc' : 'desc'));

const toast = useToast();

const handleClickDelete = (id: number) => {
  console.log(id);
};

const handleDelete = (id: number) => {
  console.log('deleting', id);
};

const handleEdit = (id: number) => {
  console.log('editing');
};

const fetchShops = async (searchParams: ShopSearchParams = {}) => {
  shops.value = [];

  try {
    isLoading.value = true;

    const data = await shopService.getAllShops({ ...searchParams, limit: rowsPerPage.value });
    shops.value = data.items;
    totalPages.value = data.totalPages;
    totalCount.value = data.totalCount;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося завантажити список супермаркетів',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

watch([page, sortBy, order], ([newPage, newSortBy, newOrder]) => {
  fetchShops({
    ...oldSearchParams.value,
    page: newPage,
    sortBy: newSortBy || undefined,
    order: newOrder || undefined
  });
});

onMounted(fetchShops);
</script>

<style scoped lang="scss"></style>
