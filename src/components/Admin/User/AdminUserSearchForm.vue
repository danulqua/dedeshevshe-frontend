<template>
  <div class="flex flex-wrap align-items-start gap-2">
    <PInputText
      v-model.trim="name"
      type="text"
      name="name"
      placeholder="Імʼя..."
      @keydown.enter="searchUsers"
    />
    <div class="flex flex-column">
      <PInputText
        v-model.trim="email"
        type="email"
        name="email"
        placeholder="Email..."
        :class="{ 'p-invalid': emailError }"
        @keydown.enter="searchUsers"
      />
      <small v-if="emailError" class="p-error">{{ emailError }}</small>
    </div>
    <PDropdown
      v-model="role"
      :options="roles"
      option-label="role"
      option-value="value"
      show-clear
      placeholder="Роль..."
    />
    <PButton icon="pi pi-search" @click="searchUsers" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { UserRole } from '@/api/types/user';
import { useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { emailSchema } from '@/schemas/email.schema';

const emit = defineEmits<{
  (event: 'search', params: { name?: string; email?: string; role?: UserRole }): void;
}>();

const name = ref('');
const role = ref<UserRole>();
const { value: email, errorMessage: emailError } = useField(
  'email',
  toTypedSchema(z.union([emailSchema, z.literal('')])),
  { initialValue: '' }
);

const roles = [
  { role: 'User', value: 'USER' },
  { role: 'Supermarket', value: 'SUPERMARKET' },
  { role: 'Admin', value: 'ADMIN' }
];

const searchUsers = async () => {
  emit('search', {
    name: name.value || undefined,
    email: email.value || undefined,
    role: role.value || undefined
  });
};
</script>

<style scoped></style>
