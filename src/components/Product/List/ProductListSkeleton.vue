<template>
  <div class="col-12 sm:col-6 xl:col-4">
    <div class="skeleton-card w-full h-full p-2">
      <PSkeleton rounded width="auto" height="14rem" />

      <div class="flex flex-column gap-1 mt-3">
        <PSkeleton width="auto" height="1.1rem" />
        <PSkeleton width="10rem" height="1.1rem" />
      </div>

      <PSkeleton width="7rem" height="2rem" class="mt-3" />

      <div class="flex flex-column gap-1" :style="{ marginTop: '40px' }">
        <PSkeleton width="3rem" />
        <PSkeleton width="4rem" />
      </div>

      <PSkeleton width="5rem" height="1.8rem" class="mt-3" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.skeleton-card {
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  border-radius: 6px;
}
</style>
