<template>
  <h2 class="mb-4">Профіль користувача</h2>

  <div v-if="isLoading" class="flex flex-column gap-2 justify-content-center">
    <PSkeleton width="60%" height="1.2rem" />
    <PSkeleton width="80%" height="1.2rem" />
    <PSkeleton width="60%" height="1.2rem" />
    <PSkeleton width="70%" height="1.2rem" />

    <PSkeleton width="9rem" height="2.8rem" class="mt-3" />
  </div>

  <div v-else-if="!isLoading && !isError" class="flex flex-column gap-2">
    <div class="flex gap-2">
      <span class="font-bold">Ім'я:</span>
      <span>{{ userStore.user.name }}</span>
    </div>

    <div class="flex gap-2">
      <span class="font-bold">Email:</span>
      <span>{{ userStore.user.email }}</span>
    </div>

    <div class="flex align-items-center gap-2">
      <span class="font-bold">Роль:</span>
      <PTag :severity="roleTags[userStore.user.role!].severity" class="uppercase">{{
        roleTags[userStore.user.role!].label
      }}</PTag>
    </div>

    <div class="flex gap-2">
      <span class="font-bold">Дата реєстрації:</span>
      <span>{{ formattedDate }}</span>
    </div>

    <RouterLink :to="{ name: 'editProfile' }">
      <PButton class="mt-3" label="Редагувати" icon="pi pi-pencil" size="small" outlined />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { userService } from '@/api/user';
import { useUserStore } from '@/stores/userStore';
import { formatDate } from '@/utilities/formatDate';
import { AxiosError } from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted } from 'vue';
import { computed, ref } from 'vue';

const toast = useToast();
const userStore = useUserStore();
const isLoading = ref(false);
const isError = ref(false);

onMounted(async () => {
  isLoading.value = true;

  try {
    const user = await userService.getMyProfile();
    userStore.setUser(user);
  } catch (error) {
    isError.value = true;

    if (error instanceof AxiosError) {
      if ([401, 403].includes(error.response?.status!)) return;

      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: 'Не вдалося завантажити профіль користувача',
        life: 3000,
      });
    }
  } finally {
    isLoading.value = false;
  }
});

const roleTags = ref({
  USER: { severity: 'info', label: 'User' },
  ADMIN: { severity: 'danger', label: 'Admin' },
  SUPERMARKET: { severity: 'success', label: 'Supermarket' },
});

const formattedDate = computed(() => formatDate(userStore.user.createdAt!));
</script>

<style scoped></style>
