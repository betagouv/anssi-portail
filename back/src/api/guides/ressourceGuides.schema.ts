import z from 'zod';

export const schemaRessourceGuides = z.object({
  query: z.object({
    mode: z.enum(['travail'], 'Le mode doit être "travail"').optional(),
  }),
});
