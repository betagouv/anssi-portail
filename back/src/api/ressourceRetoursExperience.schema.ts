import z from 'zod';
import { schemas } from './schemas';

export const schemaRessourceRetoursExperience = z.strictObject({
  raison: z.enum(['pas-clair', 'pas-le-temps', 'pas-decisionnaire', 'autre'], 'La raison est invalide'),
  emailDeContact: schemas.internet.adresseEmail("L'email est invalide").or(z.literal('')).optional(),
  precision: z.string().max(1024, 'La précision ne peut pas dépasser 1024 caractères').optional(),
});
