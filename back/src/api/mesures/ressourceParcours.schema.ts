import z from 'zod';

export const schemaRessourceParcours = z.strictObject({
  nom: z.string(),
});
