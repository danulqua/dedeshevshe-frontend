import { z } from 'zod';

export const productTitleSchema = z
  .string()
  .nonempty('Введіть назву продукту')
  .min(3, 'Назва продукту повинна бути щонайменше 3 символи')
  .max(255, 'Назва продукту не може бути довшою за 255 символів');

export const maxPriceSchema = z.number();
