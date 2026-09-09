import z from 'zod';
import { facteursAggravant, secteurs, typesOrganisation } from '../../../metier/mini-tests/exposition/exposition.js';

export const schemaPostTestExposition = z.strictObject({
  typeOrganisation: z.enum(typesOrganisation),
  secteur: z.enum(secteurs).optional(),
  facteursAggravant: z.array(z.enum(facteursAggravant)),
});
