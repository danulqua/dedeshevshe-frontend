<template>
  <div class="container">
    <div class="grid row-gap-4">
      <div class="col-12 lg:col-4">
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
        </div>
        <RouterLink :to="{ name: 'editProfile' }">
          <PButton class="mt-3" label="Редагувати" icon="pi pi-pencil" size="small" outlined />
        </RouterLink>
      </div>
      <div class="col-12 lg:col-8">
        <h2>Запити на додавання</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
</script>

<style scoped></style>
