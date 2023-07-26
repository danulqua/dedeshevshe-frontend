<template>
  <div class="main-layout">
    <MainHeader />

    <main class="my-6 container">
      <RouterView />
    </main>

    <MainFooter />
  </div>
</template>

<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue';
import MainFooter from '@/components/MainFooter.vue';
</script>

<style scoped lang="scss">
.main-layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  min-height: 100%;
}
</style>
