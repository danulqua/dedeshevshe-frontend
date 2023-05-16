<template>
  <div class="mx-auto surface-card p-4 shadow-2 border-round">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">Вхід у Grocify</div>
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

      <PButton label="Увійти" class="w-full" :disabled="!isValid" @click="submit"></PButton>
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
import { authService } from '@/api/auth';
import { useUserStore } from '@/stores/userStore';

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(signInSchema),
  initialValues: {
    email: '',
    password: ''
  }
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

const submit = handleSubmit(async (values) => {
  try {
    await userStore.signIn(values.email, values.password);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Неправильні дані для входу',
      life: 3000
    });
  }
});
</script>

<style scoped lang="scss">
.surface-card {
  max-width: 500px;
}
</style>
