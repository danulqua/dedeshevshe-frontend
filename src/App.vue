<template>
  <PToast position="bottom-right" />
  <MainHeader />

  <div class="my-6">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue';
import { RouterView } from 'vue-router';
</script>

<style scoped></style>
