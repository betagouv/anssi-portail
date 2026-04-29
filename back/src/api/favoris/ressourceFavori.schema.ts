import z from 'zod';

export const schemaParametersRessourceFavori = z.strictObject({
  id: z
    .string()
    .transform(decodeURIComponent)
    .refine((valeur) => /^[a-zA-Z0-9/_-]+$/.test(valeur)),
});
