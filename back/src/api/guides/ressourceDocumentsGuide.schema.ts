import * as z from 'zod';

export const schemaAjoutDocumentGuide = z.strictObject({ libelleDuLien: z.string() });
