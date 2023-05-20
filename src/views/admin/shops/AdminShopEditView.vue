<template>
  <h2>Редагування супермаркету #{{ shopId }}</h2>

  <PProgressSpinner v-if="isFetching" />
  <div v-else class="mt-4 flex flex-column gap-4 shop-create-form">
    <div class="flex flex-column">
      <PInputText
        v-model="title"
        name="title"
        type="text"
        placeholder="Назва супермаркету..."
        @keydown.enter="submit"
      />
      <small v-if="errorMessage" class="p-error">{{ errorMessage }}</small>
    </div>

    <div class="flex gap-2">
      <PButton
        label="Зберегти"
        icon="pi pi-save"
        :disabled="!title || errorMessage"
        :loading="isLoading"
        @click="submit"
      />
      <PButton label="Скасувати" outlined @click="router.push({ name: 'adminShops' })" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { shopService } from '@/api/shop';
import { useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { onMounted } from 'vue';

const { value: title, errorMessage } = useField(
  'title',
  toTypedSchema(
    z
      .string()
      .nonempty('Назва супермаркету не може бути порожньою')
      .regex(/^\S.*\S$/, 'Назва супермаркету не може починатися або закінчуватися пробілами')
  )
);

const isLoading = ref(false);
const isFetching = ref(false);

const router = useRouter();
const route = useRoute();
const toast = useToast();

const shopId = ref(route.params.id as string);

const getShopData = async () => {
  try {
    isFetching.value = true;
    const shop = await shopService.getShop(shopId.value);
    title.value = shop.title;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося отримати дані про супермаркет',
      life: 3000
    });
    router.push({ name: 'adminShops' });
  } finally {
    isFetching.value = false;
  }
};

const updateShop = async () => {
  try {
    isLoading.value = true;
    await shopService.updateShop(shopId.value, { title: title.value });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося оновити дані супермаркету',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

const submit = async () => {
  if (!title.value || errorMessage.value) return;

  await updateShop();

  toast.add({
    severity: 'success',
    summary: 'Успіх',
    detail: 'Супермаркет успішно оновлено',
    life: 3000
  });
  router.push({ name: 'adminShops' });
};

onMounted(getShopData);
</script>

<style scoped lang="scss">
.shop-create-form {
  max-width: 500px;
}
</style>
