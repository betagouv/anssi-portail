import { z } from 'zod';

export const schémaPostRéponsesHameçonnage = z.strictObject({
  idCorrélation: z.uuidv7(),
  idMail: z.enum(['ENEDIS', 'PROCONNECT', 'INPI', 'CPF', 'LAPOSTE', 'AMENDESGOUV', 'ORANGE', 'BANQUEPOSTALE', 'ANSSI']),
  réponse: z.enum(['bonne', 'mauvaise']),
});
