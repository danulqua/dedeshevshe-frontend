<template>
  <h2>Додавання супермаркету</h2>

  <div class="mt-4 flex flex-column gap-4 shop-create-form">
    <div class="flex flex-column">
      <PInputText
        v-model="title"
        name="title"
        type="text"
        placeholder="Назва супермаркету..."
        :class="{ 'p-invalid': errorMessage }"
        @keydown.enter="submit"
      />
      <small v-if="errorMessage" class="p-error">{{ errorMessage }}</small>
    </div>

    <div class="flex flex-column gap-2">
      <label for="file" class="block text-900 font-medium">Логотип</label>
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt="Зображення продукту"
        class="max-w-12rem max-h-12rem"
        :style="{ objectFit: 'cover' }"
      />
      <div class="flex gap-1 align-items-center">
        <PFileUpload
          name="file"
          mode="basic"
          :choose-label="!imageId ? 'Обрати' : 'Змінити'"
          :url="uploadLogoUrl"
          accept="image/*"
          :max-file-size="2000000"
          with-credentials
          auto
          :disabled="isImageLoading"
          @select="handleImageSelect"
          @upload="handleImageUpload"
          @error="handleImageUploadError"
        />
        <PButton
          v-if="imageId"
          icon="pi pi-times"
          severity="danger"
          outlined
          @click="handleImageDelete"
        />
      </div>
    </div>

    <div class="flex gap-2">
      <PButton
        label="Додати"
        icon="pi pi-plus"
        :disabled="!title || errorMessage || isImageLoading"
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

const uploadLogoUrl = `${import.meta.env.VITE_API_BASE_URL}/api/shop/logo/upload`;

const { value: title, errorMessage } = useField(
  'title',
  toTypedSchema(
    z
      .string()
      .nonempty('Назва супермаркету не може бути порожньою')
      .regex(/^\S.*\S$/, 'Назва супермаркету не може починатися або закінчуватися пробілами'),
  ),
);
const imageId = ref<number | null>(null);
const imageUrl = ref<string | null>(null);

const isLoading = ref(false);
const isImageLoading = ref(false);

const router = useRouter();
const toast = useToast();

const createShop = async () => {
  try {
    isLoading.value = true;
    await shopService.createShop({
      title: title.value,
      imageId: imageId.value,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося додати супермаркет',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const handleImageSelect = () => {
  isImageLoading.value = true;
  imageUrl.value = null;
};

const handleImageDelete = () => {
  imageId.value = null;
  imageUrl.value = null;
};

const handleImageUpload = ({ xhr }: { xhr: XMLHttpRequest; files: any }) => {
  const data = JSON.parse(xhr.response);
  imageId.value = data.id;
  imageUrl.value = data.url;
  isImageLoading.value = false;
  toast.add({
    severity: 'success',
    summary: 'Успіх',
    detail: 'Зображення успішно завантажено',
    life: 3000,
  });
};

const handleImageUploadError = () => {
  toast.add({
    severity: 'error',
    summary: 'Помилка',
    detail:
      'Не вдалося завантажити зображення. Тип зображення повинен бути .jpg, .png. Розмір зображення до 2 МБ.',
    life: 5000,
  });
  isImageLoading.value = false;
};

const submit = async () => {
  if (!title.value || errorMessage.value) return;

  await createShop();

  toast.add({
    severity: 'success',
    summary: 'Успіх',
    detail: 'Супермаркет успішно додано',
    life: 3000,
  });
  router.push({ name: 'adminShops' });
};
</script>

<style scoped lang="scss">
.shop-create-form {
  max-width: 500px;
}
</style>
