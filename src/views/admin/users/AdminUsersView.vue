<template>
  <h2 class="mb-4">Користувачі {{ totalCount ? `(${totalCount})` : '' }}</h2>
  <RouterLink :to="{ name: 'adminShopCreate' }">
    <PButton class="mb-4" icon="pi pi-plus" label="Створити користувача" />
  </RouterLink>

  <AdminUserSearchForm class="mb-4" @search="handleSearch" />

  <PDataTable
    v-model:sort-order="sortOrder"
    v-model:sort-field="searchParams.sortBy"
    :value="users"
    :loading="isLoading"
    :rows="rowsPerPage"
    paginator
    paginator-template
    scrollable
  >
    <PColumn field="id" header="ID" sortable />
    <PColumn field="name" header="Імʼя" sortable />
    <PColumn field="email" header="Email" sortable />
    <PColumn field="role" header="Роль" sortable>
      <template #body="{ data }: { data: UserDTO }">
        <PTag v-if="data.role === 'USER'" severity="info" class="uppercase">User</PTag>
        <PTag v-else-if="data.role === 'ADMIN'" severity="danger" class="uppercase">Admin</PTag>
      </template>
    </PColumn>
    <PColumn field="createdAt" header="Дата створення" sortable>
      <template #body="{ data }: { data: UserDTO }">
        {{ formatDate(data.createdAt, 'YYYY.MM.DD, hh:mm:ss') }}
      </template>
    </PColumn>
    <PColumn field="updatedAt" header="Дата оновлення" sortable>
      <template #body="{ data }: { data: UserDTO }">
        {{ formatDate(data.createdAt, 'YYYY.MM.DD, hh:mm:ss') }}
      </template>
    </PColumn>
    <PColumn>
      <template #body="{ data }: { data: UserDTO }">
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
            :severity="data.id ? 'secondary' : 'danger'"
            text
            rounded
            :disabled="data.id"
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
import type { UserDTO, UserRole, UserSearchParams } from '@/api/types/user';
import { shopService } from '@/api/shop';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { formatDate } from '@/utilities/formatDate';
import CPaginator from '@/components/common/CPaginator.vue';
import { useRouter } from 'vue-router';
import { userService } from '@/api/user';
import AdminUserSearchForm from '@/components/Admin/User/AdminUserSearchForm.vue';

const isLoading = ref(false);

const users = ref<UserDTO[]>([]);
const searchParams = ref<UserSearchParams>({
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

const handleSearch = (event: { name?: string; email?: string; role?: UserRole }) => {
  searchParams.value = {
    ...searchParams.value,
    ...event,
    page: 1
  };
  fetchUsers(searchParams.value);
};

const handleDelete = (user: UserDTO) => {
  confirm.require({
    message: `Ви дійсно бажаєте видалити користувача #${user.id}?`,
    header: 'Підтвердження видалення',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    acceptIcon: 'pi pi-trash',
    accept: () => deleteShop(user.id)
  });
};

const deleteShop = async (userId: number) => {
  try {
    isLoading.value = true;

    await shopService.deleteShop(userId.toString());
    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Користувача успішно видалено',
      life: 3000
    });
    fetchUsers(searchParams.value);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося видалити Користувача',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

const handleEdit = (user: UserDTO) => {
  router.push({ name: 'adminShopEdit', params: { id: user.id.toString() } });
};

const fetchUsers = async (searchParams: UserSearchParams = {}) => {
  users.value = [];

  try {
    isLoading.value = true;

    const data = await userService.getAllUsers({ ...searchParams, limit: rowsPerPage.value });
    users.value = data.items;
    totalPages.value = data.totalPages;
    totalCount.value = data.totalCount;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося завантажити список користувачів',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

watch(
  [() => searchParams.value.page, () => searchParams.value.sortBy, order],
  ([newPage, newSortBy, newOrder]) => {
    fetchUsers({
      ...searchParams.value,
      page: newPage,
      sortBy: newSortBy || undefined,
      order: newOrder || undefined
    });
  }
);

onMounted(() => fetchUsers(searchParams.value));
</script>

<style scoped lang="scss"></style>
