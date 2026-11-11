import z from 'zod';
import { NiveauDUtilité } from '../metier/niveauDeSatisfaction.js';

export const schemaRessourceAvisParcours = z.strictObject({
  typeDeRetour: z.literal('spontané'),
  niveauDUtilité: z
    .int()
    .min(1, 'Le niveau de satisfaction est invalide')
    .max(5, 'Le niveau de satisfaction est invalide')
    .pipe(z.custom<NiveauDUtilité>()),
  recommandationAutreOrganisation: z.enum(['oui', 'non', 'peut-être']),
  commentaireAmélioration: z
    .string()
    .min(1, 'Le commentaire est requis')
    .max(8 * 1024, 'Le commentaire ne peut pas dépasser 8192 caractères'),
  souhaiteÊtreRecontacté: z.boolean(),
});
