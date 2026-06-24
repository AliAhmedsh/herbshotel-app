export const APP_DISPLAY_NAME = 'Top 10 DE casinos';

export const APP_CONFIG = {
  apiBaseUrl: 'https://www.theherbshotel.com/wp-json/custom/v1/play_affiliate_data',
  websiteId: 'de',
  pageId: '19228',
  limit: 11,
} as const;

export function getApiUrl(overrides?: Partial<typeof APP_CONFIG>) {
  const cfg = { ...APP_CONFIG, ...overrides };
  const params = new URLSearchParams({
    website_id: cfg.websiteId,
    page_id: cfg.pageId,
    limit: String(cfg.limit),
  });
  return `${cfg.apiBaseUrl}?${params.toString()}`;
}
