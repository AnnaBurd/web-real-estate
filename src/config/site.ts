/**
 * Single source of truth for sitewide contact details.
 * One phone number is used everywhere (tel link, display, Zalo).
 */
export const CONTACT = {
  /** Pretty form shown in text. */
  phoneDisplay: "+84 78 488 0685",
  /** href for click-to-call. */
  tel: "tel:+84784880685",
  /** Zalo chat link (Zalo uses the local-format number). */
  zaloUrl: "https://zalo.me/0784880685",
} as const;
