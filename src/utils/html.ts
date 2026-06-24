export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&euro;/g, '€')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractImageUrl(html: string): string | null {
  const match = html.match(/src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

export function splitHtmlParagraphs(html: string): string[] {
  return html
    .split(/<\/p>/i)
    .map((part) => stripHtml(part))
    .filter((part) => part.length > 0);
}
