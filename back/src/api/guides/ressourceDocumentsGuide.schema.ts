import * as z from 'zod';

// Ici, le schéma est basé sur la requête plutôt que sur le corps de la requête, car multer ajoute
// un champ "file" à la requête, qui n'est pas dans le corps de la requête. De plus, cela nous permet
// de valider à la fois les champs du corps de la requête et le fichier uploadé dans une même validation.
export const schemaAjoutDocumentGuide = z
  .object({
    body: z.strictObject({
      libelleDuLien: z.string().max(1024),
      genereVisuel: z.enum(['true', 'false']).optional(),
    }),
    file: z.custom<Express.Multer.File>(),
  })
  .superRefine(({ body: { genereVisuel }, file: fichier }, ctx) => {
    if (genereVisuel === 'true' && fichier?.mimetype !== 'application/pdf') {
      ctx.addIssue({
        code: 'invalid_value',
        message: 'Le fichier doit être un PDF si vous voulez générer un visuel',
        path: ['libelleDuLien', 'document-guide'],
        values: [genereVisuel, fichier?.mimetype],
      });
    }
  });
