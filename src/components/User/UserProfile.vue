<template>
  <h2 class="mb-4">Профіль користувача</h2>
  <div class="flex flex-column gap-2">
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
      <PTag :severity="userStore.user.role === 'ADMIN' ? 'danger' : 'info'">
        {{ userStore.user.role }}
      </PTag>
    </div>

    <div class="flex gap-2">
      <span class="font-bold">Дата реєстрації:</span>
      <span>{{ formattedDate }}</span>
    </div>
  </div>
  <RouterLink :to="{ name: 'editProfile' }">
    <PButton class="mt-3" label="Редагувати" icon="pi pi-pencil" size="small" outlined />
  </RouterLink>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { formatDate } from '@/utilities/formatDate';
import { computed } from 'vue';

const userStore = useUserStore();

const formattedDate = computed(() => formatDate(userStore.user.createdAt!));
</script>

<style scoped></style>
