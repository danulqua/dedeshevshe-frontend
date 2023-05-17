import { z } from 'zod';

export const passwordsSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Пароль повинен містити мінімум 8 символів')
      .regex(
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{1,}$/,
        'Пароль повинен містити мінімум 1 цифру, 1 спеціальний символ і 1 літеру'
      )
      .default(''),
    confirmPassword: z.string().default('')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword']
  });
