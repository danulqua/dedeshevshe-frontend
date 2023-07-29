import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Некоректний email').default(''),
  password: z
    .string()
    .min(8, 'Пароль повинен містити мінімум 8 символів')
    .regex(
      /^(?=.*\d)(?=.*[!@#$%^&*_\-+=<>?])(?=.*[a-zA-Z]).{1,}$/,
      'Пароль повинен містити мінімум 1 цифру, 1 спеціальний символ і 1 літеру',
    )
    .default(''),
});
