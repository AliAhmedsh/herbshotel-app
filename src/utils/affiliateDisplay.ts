import type { AffiliateMeta } from '../types';

function metaString(meta: AffiliateMeta, ...keys: string[]): string | undefined {
  const record = meta as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value);
    }
  }
  return undefined;
}

/** Matches [theherbshotel.com/de](https://www.theherbshotel.com/de/) when API omits social proof fields. */
const RANK_FALLBACKS: Record<number, { score: string; votes: number; players: number }> = {
  1: { score: '10', votes: 52017, players: 19418 },
  2: { score: '9.9', votes: 41812, players: 14516 },
  3: { score: '9.8', votes: 36545, players: 11023 },
  4: { score: '9.7', votes: 33211, players: 8503 },
  5: { score: '9.6', votes: 30123, players: 7034 },
  6: { score: '9.5', votes: 27804, players: 5812 },
  7: { score: '9.4', votes: 25508, players: 4812 },
  8: { score: '9.3', votes: 23512, players: 4134 },
  9: { score: '9.2', votes: 21034, players: 3621 },
  10: { score: '9.1', votes: 19067, players: 3313 },
  11: { score: '9', votes: 17056, players: 3167 },
};

export function getAffiliateScore(meta: AffiliateMeta, rank: number): string {
  const raw =
    metaString(meta, 'affiliate_score', 'rating_score', 'score', 'casino_rating') ??
    meta.affiliate_rating;

  const fallback = RANK_FALLBACKS[rank]?.score;
  const numeric = parseFloat(raw ?? '');

  if (Number.isFinite(numeric) && numeric > 5) {
    return numeric.toFixed(1);
  }

  if (fallback) return fallback;

  return (10 - (rank - 1) * 0.1).toFixed(rank === 1 ? 0 : 1);
}

export function getVoteCount(meta: AffiliateMeta, rank: number): string {
  const raw = metaString(
    meta,
    'votes',
    'vote_count',
    'affiliate_votes',
    'total_votes',
    'review_count',
  );

  if (raw) {
    const numeric = parseInt(raw.replace(/\D/g, ''), 10);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric.toLocaleString('de-DE');
    }
  }

  const fallback = RANK_FALLBACKS[rank]?.votes;
  return fallback ? fallback.toLocaleString('de-DE') : '0';
}

export function getPlayersOnline(meta: AffiliateMeta, rank: number): number {
  const raw = metaString(meta, 'players_online', 'spieler_online', 'active_players', 'playing_now');

  if (raw) {
    const numeric = parseInt(raw.replace(/\D/g, ''), 10);
    if (Number.isFinite(numeric) && numeric > 0) return numeric;
  }

  return RANK_FALLBACKS[rank]?.players ?? 0;
}

export function getRtp(meta: AffiliateMeta): number | null {
  const value = Number(meta.detcasino_section01_2_detcasino_value_section1);
  return Number.isFinite(value) ? value : null;
}

export function getStarRating(meta: AffiliateMeta, rank: number): number {
  const score = parseFloat(getAffiliateScore(meta, rank));
  if (score > 5) return Math.min(5, score / 2);
  const numeric = parseFloat(meta.affiliate_rating ?? '5');
  return Number.isFinite(numeric) ? Math.min(5, Math.max(0, numeric)) : 5;
}

export function getDisplayName(affiliate: { title: string }): string {
  return affiliate.title.replace(/<[^>]+>/g, '').replace(/&#8211;/g, '–').trim();
}

export function formatBonusOffer(bonusTitle: string, freeSpins?: string): string {
  const bonus = bonusTitle.trim();
  const spins = freeSpins?.trim();
  return spins ? `${bonus} + ${spins}` : bonus;
}

export function getLegalFooter(meta: AffiliateMeta): string {
  const raw = meta.copyright_txt ?? meta.copyright_txt_html ?? '';
  const cleaned = raw
    .replace(/<[^>]+>/g, '|')
    .replace(/\|+/g, ' | ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || '18+ | T&C | Play Responsibly | Be Gamble Aware';
}
