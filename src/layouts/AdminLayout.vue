<template>
  <AdminHeader />

  <div class="flex">
    <AdminMenu />
    <div class="flex-1 py-6 px-5">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/Admin/AdminHeader.vue';
import AdminMenu from '@/components/Admin/AdminMenu.vue';
</script>

<style scoped></style>
