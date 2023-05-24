import { z } from 'zod';

export const createProductSchema = z.object({
  title: z
    .string()
    .nonempty('Назва не може бути порожньою')
    .min(3, 'Назва повинна бути довжиною щонайменше в 3 символи')
    .max(255, 'Назва не може бути довше 255 символів')
    .default(''),
  description: z.string().nullable().default(''),
  shopId: z.number().min(1, 'Магазин не вибраний').default(0),
  url: z
    .string()
    .nonempty('Посилання не може бути порожнім')
    .url('Некоректне посилання')
    .default(''),
  price: z.number().min(0.01, 'Ціна повинна бути більше 0').default(0),
  discount: z.object({
    value: z
      .number()
      .min(0.01, 'Знижка повинна бути більше 0')
      .max(100, 'Знижка не може бути більше 100')
      .nullable()
      .default(null),
    oldPrice: z.number().min(0.01, 'Стара ціна повинна бути більше 0').nullable().default(null),
  }),
  weight: z.number().min(0.01, 'Вага повинна бути більше 0').nullable().default(0),
  volume: z.number().min(0.01, 'Обʼєм повинен бути більше 0').nullable().default(null),
  imageId: z.number().min(1, 'Зображення не вибране').default(0),
});
