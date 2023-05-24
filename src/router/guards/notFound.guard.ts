import { useToast } from 'primevue/usetoast';

export const notFound = async () => {
  const toast = useToast();
  toast.add({
    severity: 'error',
    summary: 'Помилка',
    detail: 'Такої сторінки не існує.',
    life: 3000
  });
  return { name: 'home' };
};
