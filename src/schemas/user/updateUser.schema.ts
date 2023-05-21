import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.string().nonempty("Ім'я не може бути порожнім").default(''),
    email: z.string().email('Некоректний email').default(''),
    password: z
      .string()
      .min(8, 'Пароль повинен містити мінімум 8 символів')
      .regex(
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{1,}$/,
        'Пароль повинен містити мінімум 1 цифру, 1 спеціальний символ і 1 літеру'
      )
      .optional()
      .or(z.literal(''))
      .default(''),
    confirmPassword: z.string().optional().default('')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword']
  });
