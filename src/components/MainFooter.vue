<template>
  <footer class="p-4 text-500">
    <div class="flex flex-column align-items-center gap-2">
      <div class="flex gap-2">
        <a :href="`mailto:${feedbackEmail}`" class="text-center text-500 underline">
          Зворотній звʼязок
        </a>
        |
        <a :href="donationUrl" class="text-center text-500 underline" target="_blank">
          Підтримати проєкт
        </a>
      </div>
      <div class="flex justify-content-center align-items-center gap-2">
        <span>&copy; {{ year }}</span>
        <span>Всі права захищені.</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const year = ref(new Date().getFullYear());
const feedbackEmail = import.meta.env.VITE_EMAIL_FOR_FEEDBACK;
const donationUrl = import.meta.env.VITE_DONATION_URL;
</script>

<style scoped></style>
