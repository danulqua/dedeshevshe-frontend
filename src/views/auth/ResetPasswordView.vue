<template>
  <div class="mx-auto surface-card p-4 shadow-2 border-round">
    <div class="mb-3">
      <div class="text-center text-900 text-3xl font-medium mb-3">Встановлення нового паролю</div>
    </div>

    <form @submit.prevent>
      <div>
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
        <ErrorMessage name="password" as="small" class="p-error">{{
          errors.password
        }}</ErrorMessage>
      </div>

      <div>
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
          @keydown.enter="submit"
        />
        <ErrorMessage name="confirmPassword" as="small" class="p-error">
          {{ errors.confirmPassword }}
        </ErrorMessage>
      </div>

      <PButton
        label="Зберегти"
        class="w-full mt-3"
        :disabled="!isValid || isLoading"
        :loading="isLoading"
        @click="submit"
      ></PButton>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useField, useForm, ErrorMessage } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import { toTypedSchema } from '@vee-validate/zod';
import { authService } from '@/api/auth';
import { passwordsSchema } from '@/schemas/auth/passwords.schema';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(passwordsSchema),
});
const { value: password } = useField('password');
const { value: confirmPassword } = useField('confirmPassword');

const isValid = computed(() => {
  const isNoErrors = Object.keys(errors.value).length === 0;
  const isNotEmpty = password.value && confirmPassword.value;

  return isNoErrors && isNotEmpty;
});

const toast = useToast();
const isLoading = ref(false);

const router = useRouter();
const route = useRoute();
const token = route.query.token as string;

onMounted(async () => {
  if (!token) {
    router.push({ name: 'home' });

    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Некоретне посилання для відновлення паролю',
      life: 3000,
    });

    return;
  }

  try {
    isLoading.value = true;
    await authService.validateToken(token);
  } catch (error) {
    router.push({ name: 'home' });
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Некоретне посилання для відновлення паролю',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
});

const submit = handleSubmit(async (values) => {
  if (!isValid.value) return;
  try {
    isLoading.value = true;
    await authService.changePassword(token, values.password);

    router.push({ name: 'signIn' });
    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Пароль успішно змінено. Використовуйте новий пароль для входу',
      life: 5000,
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
