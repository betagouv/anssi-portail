import z from 'zod';
import { NiveauDUtilité } from '../metier/niveauDeSatisfaction.js';

const champsCommuns = {
  niveauDUtilité: z
    .int()
    .min(1, 'Le niveau de satisfaction est invalide')
    .max(5, 'Le niveau de satisfaction est invalide')
    .pipe(z.custom<NiveauDUtilité>()),
  commentaireAmélioration: z
    .string()
    .min(1, 'Le commentaire est requis')
    .max(8 * 1024, 'Le commentaire ne peut pas dépasser 8192 caractères'),
  souhaiteÊtreRecontacté: z.boolean(),
};
const recommandation = z.enum(['oui', 'non', 'peut-être'], {
  error: (erreur) => (erreur.input === undefined ? 'La recommandation est requise' : undefined),
});

export const schemaRessourceAvisParcours = z.discriminatedUnion('typeDeRetour', [
  z.strictObject({
    ...champsCommuns,
    typeDeRetour: z.literal('mi-parcours'),
  }),
  z.strictObject({
    ...champsCommuns,
    typeDeRetour: z.enum(['spontané', 'parcours terminé']),
    recommandationAutreOrganisation: recommandation,
  }),
]);
