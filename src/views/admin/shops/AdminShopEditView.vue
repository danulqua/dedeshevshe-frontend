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
        :class="{ 'p-invalid': errorMessage }"
        :disabled="isExternal"
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
          :url="uploadImageUrl"
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
        label="Зберегти"
        icon="pi pi-save"
        :disabled="!title || errorMessage || isImageLoading"
        :loading="isLoading"
        @click="submit"
      />
      <PButton label="Скасувати" outlined @click="router.push({ name: 'adminShops' })" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { shopService } from '@/api/shop';
import { useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const uploadImageUrl = `${import.meta.env.VITE_API_BASE_URL}/api/product/image/upload`;

const { value: title, errorMessage } = useField(
  'title',
  toTypedSchema(
    z
      .string()
      .nonempty('Назва супермаркету не може бути порожньою')
      .regex(/^\S.*\S$/, 'Назва супермаркету не може починатися або закінчуватися пробілами'),
  ),
);
const isExternal = ref(false);
const imageId = ref<number | null>(null);
const imageUrl = ref<string | null>(null);

const isFetching = ref(false);
const isLoading = ref(false);
const isImageLoading = ref(false);

const router = useRouter();
const route = useRoute();
const toast = useToast();

const shopId = ref(route.params.id as string);

const getShopData = async () => {
  try {
    isFetching.value = true;
    const shop = await shopService.getShop(shopId.value);

    title.value = shop.title;
    isExternal.value = shop.isExternal;
    imageId.value = shop.imageId;
    imageUrl.value = shop.image?.url || null;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося отримати дані про супермаркет',
      life: 3000,
    });
    router.push({ name: 'adminShops' });
  } finally {
    isFetching.value = false;
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

const updateShop = async () => {
  try {
    isLoading.value = true;
    await shopService.updateShop(shopId.value, {
      title: title.value,
      imageId: imageId.value,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося оновити дані супермаркету',
      life: 3000,
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
    life: 3000,
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
