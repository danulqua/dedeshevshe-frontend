<template>
  <div class="mx-auto surface-card p-4 shadow-2 border-round">
    <div class="text-center mb-5 text-900 text-3xl font-medium mb-3">
      Створення запиту на додавання
    </div>

    <form>
      <div>
        <label for="title" class="block text-900 font-medium mb-2">Назва продукту</label>
        <PInputText
          id="title"
          v-model="title"
          name="title"
          type="text"
          class="w-full"
          :class="{ 'p-invalid': errors.title }"
        />
        <ErrorMessage name="title" as="small" class="p-error">{{ errors.title }}</ErrorMessage>
      </div>

      <div>
        <label for="description" class="block text-900 font-medium mt-3 mb-2">Опис</label>
        <PTextarea
          id="description"
          v-model="description"
          name="description"
          type="text"
          class="w-full"
          :class="{ 'p-invalid': errors.description }"
          rows="3"
          auto-resize
        />
        <ErrorMessage name="description" as="small" class="p-error">{{
          errors.description
        }}</ErrorMessage>
      </div>

      <div>
        <label for="shopId" class="block text-900 font-medium mt-3 mb-2">Супермаркет</label>
        <PDropdown
          v-model="shopId"
          input-id="shopId"
          :options="shopsStore.shops"
          option-label="title"
          option-value="id"
          name="shopId"
          placeholder="Обрати..."
          class="w-full"
          :class="{ 'p-invalid': errors.shopId }"
          :disabled="shopsStore.isLoading"
          :loading="shopsStore.isLoading"
        />
        <ErrorMessage name="shopId" as="small" class="p-error">{{ errors.shopId }}</ErrorMessage>
      </div>

      <div>
        <label for="url" class="block text-900 font-medium mt-3 mb-2">Посилання</label>
        <PInputText
          id="url"
          v-model="url"
          name="url"
          type="url"
          class="w-full"
          :class="{ 'p-invalid': errors.url }"
        />
        <ErrorMessage name="url" as="small" class="p-error">{{ errors.url }}</ErrorMessage>
      </div>

      <div>
        <label for="price" class="block text-900 font-medium mt-3 mb-2">Ціна</label>
        <PInputNumber
          v-model="price"
          input-id="price"
          name="price"
          prefix="₴"
          placeholder="Введіть ціну..."
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          :min="0"
          :allow-empty="false"
          class="w-full"
          :class="{ 'p-invalid': errors.price }"
          @keydown.enter="submit"
        />
        <ErrorMessage name="price" as="small" class="p-error">{{ errors.price }}</ErrorMessage>
      </div>

      <div class="mt-3">
        <PCheckbox v-model="isDiscount" input-id="isDiscount" name="isDiscount" binary />
        <label for="isDiscount" class="ml-2">Знижка</label>

        <div v-if="isDiscount">
          <div>
            <label for="discount.value" class="block text-900 font-medium mt-3 mb-2"
              >Значення знижки</label
            >
            <PInputNumber
              v-model="discountValue"
              input-id="discount.value"
              name="discount.value"
              suffix="%"
              :min="0"
              :max="100"
              :allow-empty="false"
              class="w-full"
              :class="{ 'p-invalid': errors['discount.value'] }"
              :use-grouping="false"
            />
            <ErrorMessage name="discount.value" as="small" class="p-error">{{
              errors['discount.value']
            }}</ErrorMessage>
          </div>

          <div>
            <label for="discount.oldPrice" class="block text-900 font-medium mt-3 mb-2"
              >Стара ціна</label
            >
            <PInputNumber
              v-model="oldPrice"
              input-id="discount.oldPrice"
              name="discount.oldPrice"
              prefix="₴"
              placeholder="Введіть ціну..."
              :min-fraction-digits="2"
              :max-fraction-digits="2"
              :min="0"
              :allow-empty="false"
              class="w-full"
              :class="{ 'p-invalid': errors['discount.oldPrice'] }"
              @keydown.enter="submit"
            />
            <ErrorMessage name="discount.oldPrice" as="small" class="p-error">{{
              errors['discount.oldPrice']
            }}</ErrorMessage>
          </div>
        </div>

        <div class="mt-3">
          <div class="flex gap-3">
            <div class="flex align-items-center">
              <PRadioButton v-model="isSolid" input-id="solid" name="isSolid" :value="true" />
              <label for="solid" class="ml-2">Твердий продукт</label>
            </div>
            <div class="flex align-items-center">
              <PRadioButton v-model="isSolid" input-id="water" name="isSolid" :value="false" />
              <label for="water" class="ml-2">Рідина</label>
            </div>
          </div>

          <div v-if="isSolid">
            <label for="weight" class="block text-900 font-medium mt-3 mb-2">Вага</label>
            <PInputNumber
              v-model="weight"
              input-id="weight"
              name="weight"
              suffix=" г"
              :min="0"
              :allow-empty="false"
              class="w-full"
              :class="{ 'p-invalid': errors.weight }"
              :use-grouping="false"
            />
            <ErrorMessage name="weight" as="small" class="p-error">{{
              errors.weight
            }}</ErrorMessage>
          </div>

          <div v-else>
            <label for="volume" class="block text-900 font-medium mt-3 mb-2">Обʼем</label>
            <PInputNumber
              v-model="volume"
              input-id="volume"
              name="volume"
              suffix=" мл"
              :min="0"
              :allow-empty="false"
              class="w-full"
              :class="{ 'p-invalid': errors.volume }"
              :use-grouping="false"
            />
            <ErrorMessage name="volume" as="small" class="p-error">{{
              errors.volume
            }}</ErrorMessage>
          </div>

          <div class="flex flex-column gap-2">
            <label for="file" class="block text-900 font-medium mt-3">Зображення</label>
            <img
              v-if="imageUrl"
              :src="imageUrl"
              alt="Зображення продукту"
              class="max-w-12rem max-h-12rem shadow-2 border-round"
              :style="{ objectFit: 'cover' }"
            />
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
            />
            <small v-if="errors.imageId" class="p-error">{{ errors.imageId }}</small>
          </div>
        </div>
      </div>

      <PButton
        label="Створити"
        class="w-full mt-3"
        :disabled="!isValid || isLoading || isImageLoading"
        :loading="isLoading"
        @click="submit"
      />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useField, useForm, ErrorMessage } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import { toTypedSchema } from '@vee-validate/zod';
import { createProductSchema } from '@/schemas/product/createProduct.schema';
import { useShopsStore } from '@/stores/shopsStore';
import { productsService } from '@/api/products';
import type { Discount } from '@/api/types/product';
import { useRouter } from 'vue-router';

const uploadImageUrl = `${import.meta.env.VITE_API_BASE_URL}/api/product/image/upload`;

const { handleSubmit, errors } = useForm({ validationSchema: toTypedSchema(createProductSchema) });

const { value: title } = useField('title');
const { value: description } = useField('description');
const { value: shopId } = useField('shopId');
const { value: url } = useField('url');
const { value: price } = useField('price');
const isDiscount = ref(false);
const { value: discountValue } = useField('discount.value');
const { value: oldPrice } = useField('discount.oldPrice');
const isSolid = ref(true);
const { value: volume } = useField('volume');
const { value: weight } = useField('weight');
const { value: imageId } = useField('imageId');
const imageUrl = ref<string | null>(null);

watch(isSolid, (value) => {
  if (value) {
    volume.value = null;
    weight.value = 0;
  } else {
    weight.value = null;
    volume.value = 0;
  }
});

watch(isDiscount, (value) => {
  if (value) {
    discountValue.value = 0;
    oldPrice.value = 0;
  } else {
    discountValue.value = null;
    oldPrice.value = null;
  }
});

const isValid = computed(() => {
  const isNoErrors = Object.keys(errors.value).length === 0;
  const isNotEmpty = title.value;

  return isNoErrors && isNotEmpty;
});

const shopsStore = useShopsStore();
const toast = useToast();
const router = useRouter();

const isLoading = ref(false);
const isImageLoading = ref(false);

onMounted(() => {
  if (!shopsStore.shops.length) shopsStore.fetchShops();
});

const handleImageSelect = () => {
  isImageLoading.value = true;
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

const submit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    await productsService.createRequest({
      ...values,
      discount: isDiscount.value ? (values.discount as Discount) : null,
      weight: isSolid.value ? values.weight : null,
      volume: !isSolid.value ? values.volume : null,
    });

    router.push({ name: 'profile' });
    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Запит успішно створено',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'При створенні запиту сталася помилка. Спробуйте спізніше.',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
.surface-card {
  max-width: 500px;
}
</style>
