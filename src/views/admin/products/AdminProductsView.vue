<template>
  <h2 class="mb-4">Додані продукти {{ totalCount ? `(${totalCount})` : '' }}</h2>
  <RouterLink :to="{ name: 'adminProductCreate' }">
    <PButton class="mb-4" icon="pi pi-plus" label="Додати продукт" />
  </RouterLink>

  <AdminProductSearchForm class="mb-4" @search="handleSearch" />

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
          :src="getInternalImageUrl(data.image.url)"
          :alt="data.title"
          class="w-6rem h-6rem shadow-2 border-round"
        />
        <span v-else>-</span>
      </template>
    </PColumn>
    <PColumn field="shopId" header="Супермаркет" sortable>
      <template #body="{ data }: { data: ProductInternal }">
        {{ data.shop ? `#${data.id} (${data.shop.title})` : '-' }}
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
    <PColumn field="status" header="Статус" sortable>
      <template #body="{ data }: { data: ProductInternal }">
        <PTag v-if="data.status === 'ACTIVE'" severity="success" class="uppercase">Активний</PTag>
        <PTag v-else-if="data.status === 'INACTIVE'" severity="danger" class="uppercase">
          Деактивований
        </PTag>
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
            icon="pi pi-pencil"
            severity="info"
            text
            rounded
            @click="handleEdit(data)"
          />
          <PButton
            size="small"
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
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
import type { ProductStatus, ProductsSearchParams } from '@/api/types/product';
import type { ProductInternal } from '@/api/types/product';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { formatPrice } from '@/utilities/formatPrice';
import { formatDate } from '@/utilities/formatDate';
import CPaginator from '@/components/common/CPaginator.vue';
import { useRouter } from 'vue-router';
import AdminProductSearchForm from '@/components/Admin/Product/AdminProductSearchForm.vue';
import { productsService } from '@/api/products';
import { getInternalImageUrl } from '@/utilities/getInternalImageUrl';

const isLoading = ref(false);

const products = ref<ProductInternal[]>([]);
const searchParams = ref<ProductsSearchParams>({
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

const handleDelete = (product: ProductInternal) => {
  confirm.require({
    message: `Ви дійсно бажаєте видалити продукт #${product.id}?`,
    header: 'Підтвердження видалення',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    acceptIcon: 'pi pi-trash',
    acceptLabel: 'Так',
    rejectLabel: 'Ні',
    accept: () => deleteProduct(product.id)
  });
};

const deleteProduct = async (productId: number) => {
  try {
    isLoading.value = true;

    await productsService.deleteProduct(productId.toString());
    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Продукт успішно видалено',
      life: 3000
    });
    fetchProducts(searchParams.value);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося видалити продукт',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

const handleEdit = (product: ProductInternal) => {
  router.push({ name: 'adminProductEdit', params: { id: product.id.toString() } });
};

const fetchProducts = async (searchParams: ProductsSearchParams = {}) => {
  products.value = [];

  try {
    isLoading.value = true;

    const data = await productsService.getProducts<ProductInternal>(false, {
      ...searchParams,
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
