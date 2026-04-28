import z from 'zod';

export const schemaParametersRessourceGuidesMemesCollections = z.strictObject({
  slug: z
    .string()
    .regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
    .max(256),
});
