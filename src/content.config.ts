import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import { WatchedItemSchema } from "@/schemas";

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/notes" }),
});

const watched = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/watched" }),
  schema: WatchedItemSchema,
});

const piandan = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/piandan" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    createdAt: z.date(),
    items: z.array(z.string()),
  }),
});

export const collections = { notes, watched, piandan };
