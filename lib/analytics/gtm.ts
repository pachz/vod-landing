/**
 * Push events to Google Tag Manager via dataLayer.
 * Safe on SSR (no-ops when window is undefined).
 */

export type GtmViewContentPayload = {
  content_id: string;
  content_name: string;
  content_category: string;
  value: number;
  currency: string;
  /** Page UI language (e.g. en, ar); text fields above stay English for consistent reporting. */
  language: string;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushGtmViewContent(payload: GtmViewContentPayload): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "view_content",
    ...payload,
  });
}
