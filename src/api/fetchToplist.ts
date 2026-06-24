import NetInfo from '@react-native-community/netinfo';
import { getApiUrl } from '../config';
import type { ToplistResponse } from '../types';

const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 1200;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForNetwork(timeoutMs = 8000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const state = await NetInfo.fetch();
    if (state.isConnected && state.isInternetReachable !== false) {
      return true;
    }
    await wait(400);
  }

  return false;
}

function toFriendlyError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('UnknownHostException') || message.includes('Unable to resolve host')) {
    return new Error(
      'Keine Internetverbindung oder DNS-Fehler. Bitte WLAN prüfen und erneut versuchen.',
    );
  }

  if (message.includes('Network request failed')) {
    return new Error('Netzwerkfehler. Bitte Verbindung prüfen und erneut versuchen.');
  }

  return error instanceof Error ? error : new Error(message);
}

export async function fetchToplist(): Promise<ToplistResponse> {
  const url = getApiUrl();
  let lastError: unknown;

  await waitForNetwork();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await wait(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw toFriendlyError(lastError);
}
