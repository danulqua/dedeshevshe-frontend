import type { ProductStatus } from '@/api/types/product';

export const getProductStatusTagData = (status: ProductStatus) => {
  if (status === 'IN_REVIEW') {
    return {
      severity: 'warning',
      label: 'Розглядається'
    };
  }

  if (status === 'ACTIVE') {
    return {
      severity: 'success',
      label: 'Активний'
    };
  }

  if (status === 'INACTIVE') {
    return {
      severity: 'danger',
      label: 'Неактивний'
    };
  }
};
