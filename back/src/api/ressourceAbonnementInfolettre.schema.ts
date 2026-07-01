import { z } from 'zod';
import { schemas } from './schemas.js';

export const schemaAbonnementInfolettre = z.strictObject({
  email: schemas.internet.adresseEmail(),
});
