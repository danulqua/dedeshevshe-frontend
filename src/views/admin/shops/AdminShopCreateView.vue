<template>
  <h2>Додавання супермаркету</h2>

  <div class="mt-4 flex flex-column gap-4 shop-create-form">
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
        label="Додати"
        icon="pi pi-plus"
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
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { shopService } from '@/api/shop';
import { useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

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

const router = useRouter();
const toast = useToast();

const createShop = async () => {
  try {
    isLoading.value = true;
    await shopService.createShop({ title: title.value });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося додати супермаркет',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

const submit = async () => {
  if (!title.value || errorMessage.value) return;

  await createShop();

  toast.add({
    severity: 'success',
    summary: 'Успіх',
    detail: 'Супермаркет успішно додано',
    life: 3000
  });
  router.push({ name: 'adminShops' });
};
</script>

<style scoped lang="scss">
.shop-create-form {
  max-width: 500px;
}
</style>
