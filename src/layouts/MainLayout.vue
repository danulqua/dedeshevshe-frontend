<template>
  <MainHeader />

  <main class="my-6 container">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue';
</script>
