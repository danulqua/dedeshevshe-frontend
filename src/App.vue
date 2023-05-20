<template>
  <PToast position="bottom-right" />
  <PConfirmDialog />

  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style scoped></style>
