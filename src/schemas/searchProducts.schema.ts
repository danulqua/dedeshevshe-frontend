import { z } from 'zod';

export const productTitleSchema = z
  .string()
  .nonempty('Введіть назву продукту')
  .max(255, 'Назва продукту не може бути довшою за 255 символів');

export const maxPriceSchema = z.number();
