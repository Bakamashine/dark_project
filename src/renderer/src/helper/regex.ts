export function getCommentParam(htmlString: string, key: string) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`<!--\\s*${escapedKey}\\s*=\\s*([^\\s>][^>]*?)-->`);
  const match = htmlString.match(regex);
  return match ? match[1] : null;
}
