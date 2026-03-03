import { getCollection } from "astro:content";

import {
  getDataFromEntryBody,
  getDataFromEntryFilename,
  getHtmlOnlySummary,
  getHtmlSansTitle,
  parseMarkdownLink,
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

export const getLinks = async (mode: "summary" | "full") => {
  const col = await getCollection("links");
  const links = col
    .map((entry) => {
      if (!entry.body) {
        throw new Error(`The body of ${entry.id} should not be empty`);
      }

      const { title: markdownLink } = getDataFromEntryBody(entry.body);
      const markdownLinkData = parseMarkdownLink(markdownLink!);
      if (!markdownLinkData) {
        throw new Error(`The title of ${entry.id} should be a markdown link`);
      }
      const { title, url } = markdownLinkData;

      const slug = entry.id.slice(0, 16); // "YYYY-MM-DDTHHMM-".length
      const createdAt = entry.id.slice(0, 10); // "YYYY-MM-DD".length

      const renderedHtml = entry.rendered?.html || "";
      const modifiedRenderedHtml =
        mode === "full"
          ? getHtmlSansTitle(renderedHtml)
          : getHtmlOnlySummary(renderedHtml);

      return {
        slug,
        title,
        url,
        createdAt,
        entry: {
          ...entry,
          rendered: { ...entry.rendered, html: modifiedRenderedHtml },
        },
      };
    })
    .toSorted((a, b) => b.slug.localeCompare(a.slug));
  return links;
};
