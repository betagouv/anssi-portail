import z from 'zod';
import { NiveauDeSatisfaction } from '../metier/niveauDeSatisfaction';

export const schemaRessourceAvisUtilisateur = z.strictObject({
  niveauDeSatisfaction: z
    .int()
    .min(1, 'Le niveau de satisfaction est invalide')
    .max(5, 'Le niveau de satisfaction est invalide')
    .pipe(z.custom<NiveauDeSatisfaction>()),
  commentaire: z
    .string()
    .min(1, 'Le commentaire est requis')
    .max(8 * 1024, 'Le commentaire ne peut pas dépasser 8192 caractères'),
  emailDeContact: z.email("L'email est invalide").optional(),
});
