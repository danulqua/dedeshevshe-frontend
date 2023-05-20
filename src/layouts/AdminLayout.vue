<template>
  <AdminHeader />

  <div class="admin-screen flex">
    <AdminMenu />
    <div class="flex-1 h-full py-6 px-5 overflow-y-auto">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/Admin/AdminHeader.vue';
import AdminMenu from '@/components/Admin/AdminMenu.vue';
</script>

<style scoped lang="scss">
.admin-screen {
  height: calc(100vh - var(--header-height));
}
</style>
