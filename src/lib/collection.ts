import { getCollection, render } from "astro:content";

import {
  getDataFromEntryBody,
  getDataFromEntryFilename,
  getHtmlOnlySummary,
  getHtmlSansTitle,
  parseMarkdownLink,
} from "@/lib/utils";

// biome-ignore lint/suspicious/noExplicitAny: <just ignore it>
export const renderCollection = async <T extends { entry: any }>(
  items: T[],
) => {
  return Promise.all(
    items.map(async ({ entry, ...rest }) => {
      const { Content } = await render(entry);
      return { Content, ...rest };
    }),
  );
};

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

/**
 * 根据输入字符串中的 HH 返回对应的内容类型
 * @param str - 输入字符串，格式如'2026-03-05t0700'
 * @returns 返回'article'（当数字为06时）或'tutorial'（当数字为07时）
 * @throws 当数字不是06/07时抛出错误
 */
const getLinkType = (str: string): "article" | "tutorial" => {
  const hourCode = str.slice(11, 13);

  const typeMap: Record<string, "article" | "tutorial"> = {
    "06": "article",
    "07": "tutorial",
  };

  const result = typeMap[hourCode];

  if (!result) {
    throw new Error(
      `Invalid hour code: expected '06' or '07', got "${hourCode}"`,
    );
  }

  return result;
};

export const getLinks = async (mode: "summary" | "full") => {
  const col = await getCollection("links");
  const links = col
    .map((entry) => {
      const entryId = entry.id; // slugified filename

      if (!entry.body) {
        throw new Error(`The body of ${entryId} should not be empty`);
      }

      const { title: markdownLink } = getDataFromEntryBody(entry.body);
      const markdownLinkData = parseMarkdownLink(markdownLink!);
      if (!markdownLinkData) {
        throw new Error(`The title of ${entryId} should be a markdown link`);
      }
      const { title, url } = markdownLinkData;

      const slug = entryId.slice(0, 16); // "YYYY-MM-DDTHHMM-".length
      const createdAt = entryId.slice(0, 10); // "YYYY-MM-DD".length
      const type = getLinkType(entryId);

      const renderedHtml = entry.rendered?.html || "";
      const modifiedRenderedHtml =
        mode === "full"
          ? getHtmlSansTitle(renderedHtml)
          : getHtmlOnlySummary(renderedHtml);

      return {
        slug,
        title,
        url,
        type,
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
