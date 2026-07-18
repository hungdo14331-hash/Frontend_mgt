/**
 * API Configuration with fallback support
 * Default fallback: https://magic-team-vaic2026-api.onrender.com
 */

const DEFAULT_API_URL = 'https://magic-team-vaic2026-api.onrender.com';

export const getApiUrl = (): string => {
  // For client-side code (browser)
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  }

  // For server-side code (Node.js)
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
};

export const API_URL = getApiUrl();
