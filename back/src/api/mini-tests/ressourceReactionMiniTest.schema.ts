import z from 'zod';
import { identifiantsMiniTest, typesRéaction } from '../../metier/mini-tests/reactionMiniTest.js';

export const schemaParametresRessourceReactionMiniTest = z.strictObject({
  miniTest: z.enum(identifiantsMiniTest),
  typeReaction: z.enum(typesRéaction),
});
