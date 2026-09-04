import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import { WatchedItemSchema } from "@/schemas";

const links = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/links" }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/notes" }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/posts" }),
});

const watched = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/watched" }),
  schema: WatchedItemSchema,
});

const words = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/words" }),
});

export const collections = { links, notes, watched, words, posts };
