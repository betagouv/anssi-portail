import z from 'zod';
import { codeDepartement } from '../metier/referentielDepartements';

export const schemaRessourceAnnuaireOrganisations = z.object({
  query: z.object({
    recherche: z.string().nonempty('Le terme de recherche ne peut pas être vide').max(1024),
    departement: z.enum(codeDepartement, 'Le département doit être valide (01 à 989)').optional(),
  }),
});
