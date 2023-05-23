<template>
  <h2 class="mb-4">Запити на додавання {{ totalCount ? `(${totalCount})` : '' }}</h2>

  <AdminProductSearchForm class="mb-4" :with-status="false" @search="handleSearch" />

  <PDataTable
    v-model:sort-order="sortOrder"
    v-model:sort-field="searchParams.sortBy"
    :value="products"
    :loading="isLoading"
    :rows="rowsPerPage"
    paginator
    paginator-template
    scrollable
  >
    <PColumn field="id" header="ID" sortable />
    <PColumn field="title" header="Назва" sortable />
    <PColumn field="imageId" header="Зображення">
      <template #body="{ data }: { data: ProductInternal }">
        <img
          v-if="data.imageId"
          :src="data.image.url"
          :alt="data.title"
          class="w-6rem h-6rem shadow-2 border-round"
        />
        <span v-else>-</span>
      </template>
    </PColumn>
    <PColumn field="shopId" header="Супермаркет" sortable>
      <template #body="{ data }: { data: ProductInternal }">
        <img
          v-if="data.shop.image"
          :src="data.shop.image.url"
          :alt="data.shop.title"
          class="max-w-6rem max-h-6rem"
        />
        <span v-else>#{{ data.shopId }} {{ data.shop.title }}</span>
      </template>
    </PColumn>
    <PColumn field="url" header="Посилання">
      <template #body="{ data }: { data: ProductInternal }">
        <div class="white-space-nowrap overflow-hidden text-overflow-ellipsis max-w-20rem">
          <a :href="data.url" target="_blank" class="text-primary">{{ data.url }}</a>
        </div>
      </template>
    </PColumn>
    <PColumn field="price" header="Ціна" sortable>
      <template #body="{ data }: { data: ProductInternal }">
        {{ formatPrice(data.price) }}
      </template>
    </PColumn>
    <PColumn field="discount" header="Знижка" sortable>
      <template #body="{ data }: { data: ProductInternal }">
        {{ data.discount ? `${data.discount}%` : '-' }}
      </template>
    </PColumn>
    <PColumn field="oldPrice" header="Стара ціна" sortable>
      <template #body="{ data }: { data: ProductInternal }">
        <span class="text-500">{{ data.oldPrice ? formatPrice(data.oldPrice) : '-' }}</span>
      </template>
    </PColumn>
    <PColumn header="Вага/обʼєм">
      <template #body="{ data }: { data: ProductInternal }">
        <span v-if="data.weight">{{ data.weight }} г</span>
        <span v-else-if="data.volume">{{ data.volume }} мл</span>
        <span v-else>-</span>
      </template>
    </PColumn>
    <PColumn field="createdAt" header="Дата створення" sortable>
      <template #body="{ data }: { data: ProductInternal }">
        {{ formatDate(data.createdAt, 'YYYY.MM.DD, hh:mm:ss') }}
      </template>
    </PColumn>
    <PColumn field="updatedAt" header="Дата оновлення" sortable>
      <template #body="{ data }: { data: ProductInternal }">
        {{ formatDate(data.createdAt, 'YYYY.MM.DD, hh:mm:ss') }}
      </template>
    </PColumn>
    <PColumn>
      <template #body="{ data }: { data: ProductInternal }">
        <div class="flex align-items-center gap-1">
          <PButton
            size="small"
            icon="pi pi-check"
            severity="success"
            text
            rounded
            @click="handleAccept(data)"
          />
          <PButton
            size="small"
            icon="pi pi-times"
            severity="danger"
            text
            rounded
            @click="handleReject(data)"
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
import type { ProductStatus, ProductsSearchParams } from '@/api/types/product';
import type { ProductInternal } from '@/api/types/product';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { formatPrice } from '@/utilities/formatPrice';
import { formatDate } from '@/utilities/formatDate';
import CPaginator from '@/components/common/CPaginator.vue';
import AdminProductSearchForm from '@/components/Admin/Product/AdminProductSearchForm.vue';
import { productsService } from '@/api/products';

const isLoading = ref(false);

const products = ref<ProductInternal[]>([]);
const searchParams = ref<ProductsSearchParams>({
  page: 1,
  sortBy: 'updatedAt',
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

const toast = useToast();
const confirm = useConfirm();

const handleSearch = (event: {
  title?: string;
  shopId?: number;
  maxPrice?: number;
  discountsOnly?: boolean;
  status?: ProductStatus;
}) => {
  searchParams.value = {
    ...searchParams.value,
    ...event,
    page: 1
  };
  fetchProducts(searchParams.value);
};

const handleAccept = async (product: ProductInternal) => {
  confirm.require({
    message: `Ви дійсно бажаєте прийняти запит #${product.id}?`,
    header: 'Підтвердження прийняття',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-success',
    acceptIcon: 'pi pi-check',
    acceptLabel: 'Так',
    rejectLabel: 'Ні',
    accept: () => acceptRequest(product.id)
  });
};

const handleReject = (product: ProductInternal) => {
  confirm.require({
    message: `Ви дійсно бажаєте відхилити запит #${product.id}?`,
    header: 'Підтвердження відхилення',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    acceptIcon: 'pi pi-times',
    acceptLabel: 'Так',
    rejectLabel: 'Ні',
    accept: () => rejectRequest(product.id)
  });
};

const acceptRequest = async (productId: number) => {
  try {
    isLoading.value = true;

    await productsService.updateProduct(productId.toString(), {
      status: 'ACTIVE'
    });
    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Запит на додавання продукту прийнято',
      life: 3000
    });
    fetchProducts(searchParams.value);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося прийняти запит на додавання продукту',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

const rejectRequest = async (productId: number) => {
  try {
    isLoading.value = true;

    await productsService.updateProduct(productId.toString(), {
      status: 'INACTIVE'
    });
    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Запит на додавання продукту відхилено',
      life: 3000
    });
    fetchProducts(searchParams.value);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося відхилити запит на додавання продукту',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

const fetchProducts = async (searchParams: ProductsSearchParams = {}) => {
  products.value = [];

  try {
    isLoading.value = true;

    const data = await productsService.getProducts<ProductInternal>(false, {
      ...searchParams,
      status: 'IN_REVIEW',
      limit: rowsPerPage.value
    });
    products.value = data.items;
    totalPages.value = data.totalPages;
    totalCount.value = data.totalCount;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося завантажити список продуктів',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

watch(
  [() => searchParams.value.page, () => searchParams.value.sortBy, order],
  ([newPage, newSortBy, newOrder]) => {
    fetchProducts({
      ...searchParams.value,
      page: newPage,
      sortBy: newSortBy || undefined,
      order: newOrder || undefined
    });
  }
);

onMounted(() => fetchProducts(searchParams.value));
</script>

<style scoped lang="scss"></style>
