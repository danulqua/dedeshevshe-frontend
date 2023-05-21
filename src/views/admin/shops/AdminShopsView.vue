<template>
  <h2 class="mb-4">Супермаркети {{ totalCount ? `(${totalCount})` : '' }}</h2>
  <RouterLink :to="{ name: 'adminShopCreate' }">
    <PButton class="mb-4" icon="pi pi-plus" label="Додати супермаркет" />
  </RouterLink>

  <AdminShopSearchForm class="mb-4" @search="handleSearch" />

  <PDataTable
    v-model:sort-order="sortOrder"
    v-model:sort-field="searchParams.sortBy"
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
            @click="handleEdit(data)"
          />
          <PButton
            size="small"
            icon="pi pi-trash"
            :severity="data.isExternal ? 'secondary' : 'danger'"
            text
            rounded
            :disabled="data.isExternal"
            @click="handleDelete(data)"
          />
        </div>
      </template>
    </PColumn>
  </PDataTable>

  <CPaginator
    :page="searchParams.page!"
    :rows="10"
    :total-records="totalCount"
    @page-change="searchParams.page = $event"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import type { ShopDTO, ShopSearchParams } from '@/api/types/shop';
import { shopService } from '@/api/shop';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { formatDate } from '@/utilities/formatDate';
import CPaginator from '@/components/common/CPaginator.vue';
import AdminShopSearchForm from '@/components/Admin/Shop/AdminShopSearchForm.vue';
import { useRouter } from 'vue-router';

const isLoading = ref(false);

const shops = ref<ShopDTO[]>([]);
const searchParams = ref<ShopSearchParams>({
  page: 1,
  sortBy: 'createdAt',
  order: 'desc',
  limit: 10
});
const totalPages = ref(0);
const totalCount = ref(0);
const rowsPerPage = ref(10);

const sortOrder = ref(-1);

const order = computed(() => {
  if (sortOrder.value === 0) return null;
  if (sortOrder.value === 1) return 'asc';
  return 'desc';
});

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const handleSearch = (event: { title?: string; source?: 'internal' | 'external' }) => {
  searchParams.value = {
    ...searchParams.value,
    ...event,
    page: 1
  };
  fetchShops(searchParams.value);
};

const handleDelete = (shop: ShopDTO) => {
  confirm.require({
    message: `Ви дійсно бажаєте видалити супермаркет #${shop.id}?`,
    header: 'Підтвердження видалення',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    acceptIcon: 'pi pi-trash',
    accept: () => deleteShop(shop.id)
  });
};

const deleteShop = async (shopId: number) => {
  try {
    isLoading.value = true;

    await shopService.deleteShop(shopId.toString());
    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Супермаркет успішно видалено',
      life: 3000
    });
    fetchShops(searchParams.value);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося видалити супермаркет',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

const handleEdit = (shop: ShopDTO) => {
  router.push({ name: 'adminShopEdit', params: { id: shop.id.toString() } });
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

watch(
  [() => searchParams.value.page, () => searchParams.value.sortBy, order],
  ([newPage, newSortBy, newOrder]) => {
    fetchShops({
      ...searchParams.value,
      page: newPage,
      sortBy: newSortBy || undefined,
      order: newOrder || undefined
    });
  }
);

onMounted(() => fetchShops(searchParams.value));
</script>

<style scoped lang="scss"></style>
