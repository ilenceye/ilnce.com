// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";

export default defineConfig({
  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { rel: ["nofollow", "noopener", "noreferrer"], target: "_blank" },
      ],
    ],
  },
});
