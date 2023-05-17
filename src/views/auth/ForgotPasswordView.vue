<template>
  <div class="mx-auto surface-card p-4 shadow-2 border-round">
    <div class="mb-3">
      <div class="text-center text-900 text-3xl font-medium mb-3">Відновлення паролю</div>
    </div>

    <form @submit.prevent>
      <div class="my-3">
        <label for="email" class="block text-900 font-medium mb-2">Email</label>
        <PInputText
          id="email"
          v-model="email"
          name="email"
          type="email"
          class="w-full"
          :class="{ 'p-invalid': errorMessage }"
          @keydown.enter="submit"
        />
        <small v-if="errorMessage" class="p-error">{{ errorMessage }}</small>
      </div>

      <span class="text-start text-600 font-medium line-height-3">
        На Ваш email буде відправлений електронний лист із подальшими інструкціями
      </span>

      <PButton
        label="Відправити"
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
import { useField } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import { toTypedSchema } from '@vee-validate/zod';
import { useUserStore } from '@/stores/userStore';
import { emailSchema } from '@/schemas/email.schema';
import { authService } from '@/api/auth';

const { value: email, errors, errorMessage } = useField('email', toTypedSchema(emailSchema));

const isValid = computed(() => {
  const isNoErrors = Object.keys(errors.value).length === 0;
  const isNotEmpty = email.value;

  return isNoErrors && isNotEmpty;
});

const toast = useToast();
const userStore = useUserStore();

const isLoading = ref(false);

const submit = async () => {
  if (!isValid.value) return;
  try {
    isLoading.value = true;
    await authService.resetPassword(email.value!);

    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: 'Лист з подальшими інструкціями відправлено на Ваш email',
      life: 5000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Неправильні дані для входу',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.surface-card {
  max-width: 500px;
}
</style>
