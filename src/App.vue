<template>
  <Toast />
  <MainHeader class="mb-6" />

  <RouterView />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import MainHeader from '@/components/MainHeader.vue';
import { RouterView, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { userService } from '@/api/user';
import { onMounted } from 'vue';

const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  try {
    await userService.getMyProfile();
  } catch (error) {
    userStore.signOut();
    router.push({ name: 'home' });
  }
});
</script>

<style scoped></style>
