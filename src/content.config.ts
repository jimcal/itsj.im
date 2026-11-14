import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  rel: z.enum(['me']).optional(),
});

const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string().min(1),
    location: z.string().min(1),
    jobTitle: z.string().min(1),
    positioning: z.string().min(1),
    photo: z.string().min(1),
    photoAlt: z.string().min(1),
    photoWidth: z.number().int().positive().default(636),
    photoHeight: z.number().int().positive().default(630),
    worksFor: z.string().min(1),
    roles: z
      .array(
        z.object({
          title: z.string().min(1),
          org: z.string().min(1),
          url: z.string().url().optional(),
        }),
      )
      .min(1),
    talk: z.object({
      title: z.string().min(1),
      event: z.string().min(1),
      url: z.string().url(),
    }),
    links: z.array(link).min(1),
  }),
});

const markets = defineCollection({
  loader: glob({ base: './src/content/markets', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      title: z.string().min(1),
      thesis: z.string().min(1),
      status: z.enum(['open', 'resolved']),
      resolution: z.string().optional(),
      yesProbability: z.number().min(0).max(1),
      featured: z.boolean().default(false),
      publishedAt: z.coerce.date(),
      example: z.boolean().default(false),
      draft: z.boolean().default(false),
    })
    .superRefine((market, ctx) => {
      if (market.status === 'resolved' && !market.resolution?.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Resolved markets need a resolution note.',
          path: ['resolution'],
        });
      }
    }),
});

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    example: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { about, markets, writing };
