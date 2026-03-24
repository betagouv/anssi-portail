import * as z from 'zod';

export const schemaPostSimulateurNis2 = () => z.strictObject({ question1: z.boolean() });
