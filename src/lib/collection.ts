import { getCollection } from "astro:content";

import {
  getDataFromEntryBody,
  getDataFromEntryFilename,
  getHtmlSansTitle,
} from "@/lib/utils";

const getDemoSlugs = () => {
  const files = import.meta.glob("@/pages/demos/*.astro");
  const slugs = new Set(
    Object.keys(files).map((p) => p.split("/").pop()!.replace(".astro", "")),
  );
  return slugs;
};

export const getNotes = async () => {
  const demoSlugs = getDemoSlugs();

  const col = await getCollection("notes");
  const notes = col
    .map((entry) => {
      const { slug, createdAt } = getDataFromEntryFilename(entry.id);
      const { title } = getDataFromEntryBody(entry.body || "");
      const htmlSansTitle = getHtmlSansTitle(entry.rendered?.html || "");
      return {
        slug,
        title,
        demoUrl: demoSlugs.has(slug) ? `/demos/${slug}` : null,
        createdAt,
        entry: {
          ...entry,
          rendered: { ...entry.rendered, html: htmlSansTitle },
        },
      };
    })
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
  return notes;
};
