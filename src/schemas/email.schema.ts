import { z } from 'zod';

export const emailSchema = z.string().email('Некоректний email').default('');
