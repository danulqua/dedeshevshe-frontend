<template>
  <div class="mx-auto surface-card p-4 shadow-2 border-round">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">Редагування профілю</div>
    </div>

    <form>
      <label for="name" class="block text-900 font-medium mb-2">Імʼя</label>
      <PInputText
        id="name"
        v-model="name"
        name="name"
        type="name"
        class="w-full"
        :class="{ 'p-invalid': errors.name }"
        @keydown.enter="submit"
      />
      <ErrorMessage name="name" as="small" class="p-error">{{ errors.name }}</ErrorMessage>

      <label for="password" class="block text-900 font-medium mt-3 mb-2">Пароль</label>
      <PInputText
        id="password"
        v-model="password"
        name="password"
        type="password"
        class="w-full"
        :class="{ 'p-invalid': errors.password }"
        @keydown.enter="submit"
      />
      <ErrorMessage name="password" as="small" class="p-error">{{ errors.password }}</ErrorMessage>

      <label for="password" class="block text-900 font-medium mt-3 mb-2">
        Підтвердження паролю
      </label>
      <PInputText
        id="confirmPassword"
        v-model="confirmPassword"
        name="confirmPassword"
        type="password"
        class="w-full"
        :class="{ 'p-invalid': errors.confirmPassword }"
        @keydown.enter="submit"
      />
      <ErrorMessage name="confirmPassword" as="small" class="p-error">
        {{ errors.confirmPassword }}
      </ErrorMessage>

      <div class="flex gap-2">
        <PButton
          label="Зберегти"
          class="w-full mt-3"
          :disabled="!isValid || isLoading"
          :loading="isLoading"
          @click="submit"
        />
        <RouterLink :to="{ name: 'profile' }">
          <PButton label="Скасувати" class="w-full mt-3" outlined />
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useField, useForm, ErrorMessage } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { toTypedSchema } from '@vee-validate/zod';
import { editProfileSchema } from '@/schemas/user/editProfile.schema.js';
import { userService } from '@/api/user';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(editProfileSchema),
  initialValues: {
    name: userStore.user.name || '',
  },
});
const { value: name } = useField('name');
const { value: password } = useField('password');
const { value: confirmPassword } = useField('confirmPassword');

const isValid = computed(() => {
  const isNoErrors = Object.keys(errors.value).length === 0;
  const isNotEmpty = name.value || (password.value && confirmPassword.value);

  return isNoErrors && isNotEmpty;
});

const toast = useToast();
const router = useRouter();

const isLoading = ref(false);

const submit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    await userService.editProfile({ name: values.name, password: values.password || undefined });
    const user = await userService.getMyProfile();
    userStore.setUser(user);

    router.push({ name: 'profile' });
    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Дані успішно збережено',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Щось пішло не так, спробуйте пізніше',
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
