import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const Guide = z.object({
  id: z.string(),
  nom: z.string(),
  langue: z.enum(['FR', 'EN']).default('FR'),
  collections: z.array(z.string()).default([]),
  listeDocuments: z.array(z.any()).default([]),
  dateMiseAJour: z.string().optional(), // ISO string
  thematique: z.string().optional(),
  besoins: z.array(z.enum(['REAGIR', 'ETRE_SENSIBILISE', 'SE_FORMER', 'SECURISER'])).default([]),
  lienCourt: z.string().optional(),
  description: z.string().optional(),
});

export type Guide = z.infer<typeof Guide>;

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: Guide,
});

export const collections = {
  guides,
};
