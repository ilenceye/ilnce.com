import { z } from "astro:content";

export const WatchedItemSchema = z.object({
  title: z.string(),
  watchedAt: z.string(),
  rating: z.number(),
  tmdbId: z.number(),
  mediaType: z.enum(["Movie", "TV"]),
  releaseDate: z.string(),
  originalLanguage: z.string(),
  originalTitle: z.string(),
  posterUrl: z.string(),
  backdropUrl: z.string(),
  createdAt: z.string(),
});

export type WatchedItemProps = z.infer<typeof WatchedItemSchema>;
