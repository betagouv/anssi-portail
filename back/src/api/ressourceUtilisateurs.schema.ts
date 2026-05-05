import z from 'zod';
import { schemas } from './schemas';

export const schemaRessourceUtilisateurs = z.strictObject({
  token: z.string().nonempty('Le token est invalide'),
  telephone: schemas.communication.numeroTelephone('Le téléphone est invalide').optional(),
  domainesSpecialite: z
    .array(z.string().max(256, 'Le domaine de spécialité ne peut pas dépasser 256 caractères'))
    .min(1, 'Les domaines de spécialité sont invalides'),
  siretEntite: schemas.organisation.siret('Le siret est invalide'),
  cguAcceptees: z.boolean("L'acceptation des CGU est invalide"),
  infolettreAcceptee: z.boolean("L'acceptation de l'infolettre est invalide"),
});
