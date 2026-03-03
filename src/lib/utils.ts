export const getDataFromEntryFilename = (filename: string) => {
  // filename is somethings like: "YYYY-MM-DDTHHMM-xxx-xxx.md"
  const slug = filename.slice(16); // "YYYY-MM-DDTHHMM-".length
  const createdAt = filename.slice(0, 10); // "YYYY-MM-DD".length
  return { slug, createdAt };
};

export const getDataFromEntryBody = (raw: string) => {
  // Extract title
  const lines = raw.split("\n");
  const heading1 = lines.find((line) => line.startsWith("# "));
  const title = heading1 ? heading1.slice(2) : null;
  return { title };
};

const isH1 = (text: string) => /^<h1\b[^>]*>.*<\/h1>$/i.test(text.trim());
const isH2 = (text: string) => /^<h2\b[^>]*>.*<\/h2>$/i.test(text.trim());

export const getHtmlSansTitle = (html: string) => {
  const lines = html.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isH1(line)) {
      // remove the line
      lines.splice(i, 1);
      break;
    }
  }

  return lines.join("\n");
};

export const getHtmlOnlySummary = (html: string) => {
  const lines = html.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isH1(line)) {
      // remove the line
      lines.splice(i, 1);
      continue;
    }

    if (isH2(line)) {
      lines.splice(i, lines.length - i);
      break;
    }
  }

  return lines.join("\n");
};

export const parseMarkdownLink = (input: string) => {
  const match = input.match(/\[([^\]]+)\]\(([^)]+)\)/);

  if (!match) return null;

  const [, title, url] = match;

  return { title, url };
};
