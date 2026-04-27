import z from 'zod';

export const schemaRessourceGuidesMemesCollections = z.object({
  params: z.object({
    slug: z.string(),
  }),
});
