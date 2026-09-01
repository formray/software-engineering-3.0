import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum(['fondamenta', 'analisi']),
    icon: z.string().optional(),
    tag: z.string().optional(),
    date: z.date().optional(),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    tag: z.string().optional(),
    date: z.date().optional(),
  }),
});

const dispense = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/dispense' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().min(0),
    argomento: z.string(),
    stato: z.enum(['pubblicata']).default('pubblicata'),
    date: z.date(),
    tag: z.string().optional(),
  }),
});

export const collections = { articles, guides, dispense };
