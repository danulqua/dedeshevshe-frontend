<template>
  <div class="mx-auto surface-card p-4 shadow-2 border-round">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">Реєстрація у Grocify</div>
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

      <label for="password" class="block text-900 font-medium mt-3 mb-2"
        >Підтвердження паролю</label
      >
      <PInputText
        id="confirmPassword"
        v-model="confirmPassword"
        name="confirmPassword"
        type="password"
        class="w-full"
        :class="{ 'p-invalid': errors.confirmPassword }"
      />
      <ErrorMessage name="confirmPassword" as="small" class="p-error">
        {{ errors.confirmPassword }}
      </ErrorMessage>

      <PButton
        label="Зареєструватись"
        class="w-full mt-3"
        :disabled="!isValid || isLoading"
        :loading="isLoading"
        @click="submit"
      ></PButton>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useField, useForm, ErrorMessage } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { toTypedSchema } from '@vee-validate/zod';
import { signUpSchema } from '@/schemas/auth/signUp.schema';
import { authService } from '@/api/auth';
import { AxiosError } from 'axios';

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(signUpSchema)
});
const { value: email } = useField('email');
const { value: password } = useField('password');
const { value: confirmPassword } = useField('confirmPassword');

const isValid = computed(() => {
  const isNoErrors = Object.keys(errors.value).length === 0;
  const isNotEmpty = email.value && password.value && confirmPassword.value;

  return isNoErrors && isNotEmpty;
});

const toast = useToast();
const router = useRouter();

const isLoading = ref(false);

const submit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    await authService.signUp(values.email, values.password);

    router.push({ name: 'signIn' });
    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Ви успішно зареєструвалися',
      life: 3000
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      const detail =
        error.response?.status === 400
          ? 'Користувач з таким email вже існує'
          : 'Щось пішло не так, спробуйте пізніше';

      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail,
        life: 3000
      });
    }
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
