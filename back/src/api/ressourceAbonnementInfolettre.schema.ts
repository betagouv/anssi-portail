import { z } from 'zod';
import { schemas } from './schemas';

export const schemaAbonnementInfolettre = z.strictObject({
  email: schemas.internet.adresseEmail(),
});
