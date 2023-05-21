<template>
  <h2>Редагування користувача #{{ userId }}</h2>

  <PProgressSpinner v-if="isFetching" />
  <div v-else class="mt-4 flex flex-column gap-4 user-create-form">
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
        placeholder="Новий пароль..."
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
        label="Зберегти"
        icon="pi pi-save"
        :disabled="!isValid || isLoading"
        :loading="isLoading"
        @click="submit"
      />
      <PButton label="Скасувати" outlined @click="router.push({ name: 'adminUsers' })" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useField, useForm, ErrorMessage } from 'vee-validate';
import { updateUserSchema } from '@/schemas/user/updateUser.schema';
import { toTypedSchema } from '@vee-validate/zod';
import { userService } from '@/api/user';
import type { EditUserDTO } from '@/api/types/user';
import { UserRole } from '@/api/types/user';

const { handleSubmit, errors } = useForm({ validationSchema: toTypedSchema(updateUserSchema) });
const { value: name } = useField('name');
const { value: email } = useField('email');
const { value: password } = useField('password');
const { value: confirmPassword } = useField('confirmPassword');
const role = ref<UserRole>(UserRole.USER);

const isValid = computed(() => {
  const isNoErrors = Object.keys(errors.value).length === 0;
  const isNotEmpty = name.value && email.value;

  return isNoErrors && isNotEmpty;
});

const roles = [
  { label: 'Роль "User"', value: 'USER' },
  { label: 'Роль "Admin"', value: 'ADMIN' }
];

const isFetching = ref(false);
const isLoading = ref(false);

const router = useRouter();
const route = useRoute();
const toast = useToast();

const userId = ref(route.params.id as string);

const getUserData = async () => {
  try {
    isFetching.value = true;
    const user = await userService.getUser(userId.value);
    name.value = user.name;
    email.value = user.email;
    role.value = user.role;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося отримати дані про користувача',
      life: 3000
    });
    router.push({ name: 'adminUsers' });
  } finally {
    isFetching.value = false;
  }
};

const updateUser = async (id: string, user: EditUserDTO) => {
  await userService.updateUser(id, {
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role
  });
};

const submit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    await updateUser(userId.value, {
      name: values.name,
      email: values.email,
      password: values.password || undefined,
      role: role.value
    });

    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Користувача успішно оновлено',
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
        detail: 'Не вдалося оновити користувача',
        life: 3000
      });
    }
  } finally {
    isLoading.value = false;
  }
});

onMounted(getUserData);
</script>

<style scoped lang="scss">
.user-create-form {
  max-width: 500px;
}
</style>
