import { z } from 'zod';

export const schemaAbonnementInfolettre = z.strictObject({ email: z.email() });
