<template>
  <div class="empty-text relative py-8">
    <div class="text-center text-4xl font-bold">Розпочніть з пошуку</div>

    <div class="vegetables text-2xl" :class="{ appear }">
      <span class="vegetable-1">🥕</span>
      <span class="vegetable-2">🥦</span>
      <span class="vegetable-3">🥒</span>
      <span class="vegetable-4">🍅</span>
      <span class="vegetable-5">🍆</span>
      <span class="vegetable-6">🥔</span>
      <span class="vegetable-7">🌶</span>
      <span class="vegetable-8">🌽</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const appear = ref(false);

onMounted(() => {
  setTimeout(() => {
    appear.value = true;
  }, 1000);
});
</script>

<style scoped lang="scss">
.vegetables {
  span {
    position: absolute;
    z-index: -1;
    transition: transform 1.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1s ease-in-out;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
  }
}

.vegetables.appear {
  span {
    opacity: 1;
  }

  .vegetable-1 {
    transform: translate(-138px, 28px);
  }

  .vegetable-2 {
    transform: translate(123px, -55px);
  }

  .vegetable-3 {
    transform: translate(-14px, -69px);
  }

  .vegetable-4 {
    transform: translate(-9px, 36px);
  }

  .vegetable-5 {
    transform: translate(135px, 18px);
  }

  .vegetable-6 {
    transform: translate(-142px, -64px);
  }

  .vegetable-7 {
    transform: translate(-236px, -19px);
  }

  .vegetable-8 {
    transform: translate(219px, -19px);
  }
}
</style>
