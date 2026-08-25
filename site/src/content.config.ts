import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob, file } from 'astro/loaders';

/**
 * Every piece of editable content is declared here with a schema.
 * A missing PDF path, a malformed date or a forgotten role fails `npm run build`
 * instead of silently shipping to production.
 */

const team = defineCollection({
  loader: glob({ base: './src/content/team', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      photo: image(),
      /** Ascending; lower numbers appear first. */
      order: z.number(),
    }),
});

const whitepapers = defineCollection({
  loader: glob({ base: './src/content/whitepapers', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** Publication month. Rendered as e.g. "June 2023". */
    date: z.date(),
    /** Path under public/. `npm run check:assets` verifies the file exists. */
    pdf: z.string().startsWith('/whitepapers/'),
    /** Internal reference, e.g. "zwp-012". */
    ref: z.string().optional(),
  }),
});

const papers = defineCollection({
  loader: glob({ base: './src/content/papers', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    /** Where the paper is published (journal, publisher). */
    venue: z.string().optional(),
    url: z.url(),
  }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    /** <h1> and <title>. */
    title: z.string(),
    /** Small label above the title. */
    eyebrow: z.string().optional(),
    /** Intro paragraph under the title. */
    lede: z.string().optional(),
    /** Meta description. Required so no page ships without one. */
    description: z.string(),
  }),
});

const clientSegments = defineCollection({
  loader: file('./src/content/clients.yaml'),
  schema: z.object({
    id: z.string(),
    heading: z.string(),
    /** Optional lead-in paragraph shown under the heading. */
    note: z.string().optional(),
    groups: z.array(
      z.object({
        label: z.string().optional(),
        logos: z.array(
          z.object({
            /** Used as the image alt text, so it must be the real company name. */
            name: z.string(),
            /** Path under public/. `npm run check:assets` verifies it exists. */
            src: z.string().startsWith('/img/logos/'),
          })
        ),
      })
    ),
  }),
});

const testimonials = defineCollection({
  loader: file('./src/content/testimonials.yaml'),
  schema: z.object({
    id: z.string(),
    quote: z.string(),
    /** Omitted when the client asked to stay unnamed. */
    author: z.string().optional(),
    title: z.string(),
    /** Which pages this quote appears on. */
    pages: z.array(z.enum(['home', 'zqf', 'consulting'])),
  }),
});

export const collections = { pages, team, whitepapers, papers, clientSegments, testimonials };
