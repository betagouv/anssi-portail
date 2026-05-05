import z from 'zod';
import { schemas } from './schemas';

export const schemaRessourceAnnuaireOrganisations = z.object({
  query: z.object({
    recherche: z
      .string()
      .nonempty('Le terme de recherche ne peut pas être vide')
      .max(1024, 'La recherche ne peut pas dépasser 1024 caractères'),
    departement: schemas.geographie.departement().optional(),
  }),
});
