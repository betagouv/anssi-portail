import z from 'zod';
import { referentiels } from '../../metier/nis2/exigence';

export const schemaRessourceExigencesNis2Query = z.object({
  source: z.enum(referentiels, 'Les paramètres doivent être des chaînes de caractères').optional(),
  cible: z.enum(referentiels, 'Les paramètres doivent être des chaînes de caractères').optional(),
  langue: z.string().length(2, 'La langue doit être une chaîne de 2 caractères').optional(),
});

export const schemaRessourceExigencesNis2 = z.object({
  query: schemaRessourceExigencesNis2Query,
});
