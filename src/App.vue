<template>
  <PToast position="bottom-right" />

  <RouterView />
</template>

<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue';
import { RouterView } from 'vue-router';
</script>

<style scoped></style>
