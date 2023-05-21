<template>
  <h2>Створення користувача</h2>

  <div class="mt-4 flex flex-column gap-4 user-create-form">
    <div class="flex flex-column">
      <PInputText
        v-model="name"
        type="text"
        name="name"
        placeholder="Імʼя..."
        :class="{ 'p-invalid': errors.name }"
      />
      <ErrorMessage name="name" as="small" class="p-error">{{ errors.name }}</ErrorMessage>
    </div>
    <div class="flex flex-column">
      <PInputText
        v-model="email"
        type="email"
        name="email"
        placeholder="Email..."
        :class="{ 'p-invalid': errors.email }"
      />
      <ErrorMessage name="email" as="small" class="p-error">{{ errors.email }}</ErrorMessage>
    </div>
    <div class="flex flex-column">
      <PInputText
        v-model="password"
        type="password"
        name="password"
        placeholder="Пароль..."
        :class="{ 'p-invalid': errors.password }"
      />
      <ErrorMessage name="password" as="small" class="p-error">{{ errors.password }}</ErrorMessage>
    </div>
    <div class="flex flex-column">
      <PInputText
        v-model="confirmPassword"
        type="password"
        name="confirmPassword"
        placeholder="Підтвердження паролю..."
        :class="{ 'p-invalid': errors.confirmPassword }"
      />
      <ErrorMessage name="confirmPassword" as="small" class="p-error">{{
        errors.confirmPassword
      }}</ErrorMessage>
    </div>
    <div class="flex flex-column">
      <PDropdown
        v-model="role"
        name="confirmPassword"
        :options="roles"
        option-label="label"
        option-value="value"
        placeholder="Роль..."
      />
    </div>

    <div class="flex gap-2">
      <PButton
        label="Створити"
        icon="pi pi-plus"
        :disabled="!isValid || isLoading"
        :loading="isLoading"
        @click="submit"
      />
      <PButton label="Скасувати" outlined @click="router.push({ name: 'adminUsers' })" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useField, useForm, ErrorMessage } from 'vee-validate';
import { createUserSchema } from '@/schemas/user/createUser.schema';
import { toTypedSchema } from '@vee-validate/zod';
import { userService } from '@/api/user';
import type { CreateUserDTO } from '@/api/types/user';
import { UserRole } from '@/api/types/user';

const { handleSubmit, errors } = useForm({ validationSchema: toTypedSchema(createUserSchema) });
const { value: name } = useField('name');
const { value: email } = useField('email');
const { value: password } = useField('password');
const { value: confirmPassword } = useField('confirmPassword');
const role = ref<UserRole>(UserRole.USER);

const isValid = computed(() => {
  const isNoErrors = Object.keys(errors.value).length === 0;
  const isNotEmpty = name.value && email.value && password.value && confirmPassword.value;

  return isNoErrors && isNotEmpty;
});

const roles = [
  { label: 'Роль "User"', value: 'USER' },
  { label: 'Роль "Admin"', value: 'ADMIN' }
];

const isLoading = ref(false);

const router = useRouter();
const toast = useToast();

const createUser = async (user: CreateUserDTO) => {
  await userService.createUser({
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role
  });
};

const submit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    await createUser({
      name: values.name,
      email: values.email,
      password: values.password,
      role: role.value
    });

    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Користувача успішно створено',
      life: 3000
    });
    router.push({ name: 'adminUsers' });
  } catch (error: any) {
    if (error.response.data.message === 'Email is already in use') {
      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: 'Користувач з таким email вже існує',
        life: 3000
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: 'Не вдалося створити користувача',
        life: 3000
      });
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
.user-create-form {
  max-width: 500px;
}
</style>
