<template>
  <div class="mx-auto surface-card p-4 shadow-2 border-round">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">Вхід у ДеДешевше</div>
      <span class="text-600 font-medium line-height-3">Не маєте облікового запису?</span>
      <RouterLink :to="{ name: 'signUp' }" class="font-medium no-underline ml-2 text-blue-500">
        Створіть сьогодні!
      </RouterLink>
    </div>

    <form>
      <label for="email" class="block text-900 font-medium mb-2">Email</label>
      <PInputText
        id="email"
        v-model="email"
        name="email"
        type="email"
        class="w-full"
        :class="{ 'p-invalid': errors.email }"
        @keydown.enter="submit"
      />
      <ErrorMessage name="email" as="small" class="p-error">{{ errors.email }}</ErrorMessage>

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

      <div class="flex align-items-center justify-content-between my-3">
        <RouterLink
          :to="{ name: 'forgotPassword' }"
          class="font-medium no-underline text-blue-500 text-right cursor-pointer"
        >
          Забули пароль?
        </RouterLink>
      </div>

      <PButton
        label="Увійти"
        class="w-full"
        :disabled="!isValid || isLoading"
        :loading="isLoading"
        @click="submit"
      ></PButton>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useField, useForm, ErrorMessage } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import { RouterLink } from 'vue-router';
import { toTypedSchema } from '@vee-validate/zod';
import { signInSchema } from '@/schemas/auth/signIn.schema';
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(signInSchema),
  initialValues: {
    email: '',
    password: '',
  },
});
const { value: email } = useField('email');
const { value: password } = useField('password');

const isValid = computed(() => {
  const isNoErrors = Object.keys(errors.value).length === 0;
  const isNotEmpty = email.value && password.value;

  return isNoErrors && isNotEmpty;
});

const toast = useToast();
const userStore = useUserStore();

const isLoading = ref(false);

const submit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    await userStore.signIn(values.email, values.password);

    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Ви успішно увійшли до системи',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Неправильні дані для входу',
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
