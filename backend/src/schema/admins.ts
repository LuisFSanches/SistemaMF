import { z } from 'zod';

const createSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string().min(6),
  role: z.string(),
});