import { z } from 'zod';

const idsMails = ['ENEDIS', 'PROCONNECT', 'INPI', 'CPF', 'LAPOSTE', 'AMENDESGOUV', 'ORANGE', 'BANQUEPOSTALE', 'ANSSI'];

export const NOMBRE_DE_MAILS_HAMEÇONNAGE = idsMails.length;

export const schémaPostRéponsesHameçonnage = z.strictObject({
  idCorrélation: z.uuidv7(),
  idMail: z.enum(idsMails),
  réponse: z.enum(['bonne', 'mauvaise']),
  numéroRéponse: z.number().int().min(1).max(NOMBRE_DE_MAILS_HAMEÇONNAGE),
});
