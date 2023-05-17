import { z } from 'zod';

export const createProductSchema = z.object({
  title: z
    .string()
    .nonempty('Назва не може бути порожньою')
    .max(255, 'Назва не може бути довше 255 символів')
    .default(''),
  description: z.string().nullable().default(''),
  url: z
    .string()
    .nonempty('Посилання не може бути порожнім')
    .url('Некоректне посилання')
    .default(''),
  price: z.number().min(0.01, 'Ціна повинна бути більше 0'),
  discount: z
    .object({
      value: z
        .number()
        .min(0, 'Знижка повинна бути більше 0')
        .max(100, 'Знижка не може бути більше 100')
        .default(0),
      oldPrice: z.number().min(0, 'Стара ціна повинна бути більше 0').default(0)
    })
    .nullable()
    .default(null),
  volume: z.number().min(0.01, 'Обʼєм повинен бути більше 0').nullable().default(0),
  weight: z.number().min(0.01, 'Вага повинна бути більше 0').nullable().default(0),
  shopId: z.number().min(1, 'Супермаркет не вибраний').nullable().optional().default(null),
  imageId: z.number().min(1, 'Зображення не вибране').nullable().optional().default(null)
});
