<template>
  <Toast />
  <MainHeader class="mb-6" />

  <RouterView />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import MainHeader from '@/components/MainHeader.vue';
import { RouterView } from 'vue-router';
</script>

<style scoped></style>
