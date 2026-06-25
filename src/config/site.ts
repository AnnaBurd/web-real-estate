/**
 * Single source of truth for sitewide contact details + lead links.
 * One phone number everywhere; Zalo for chat. No WhatsApp.
 */
export const CONTACT = {
  /** Pretty form shown in text. */
  phoneDisplay: "+84 78 488 0685",
  /** href for click-to-call. */
  tel: "tel:+84784880685",
  /** Zalo number in international form (no +), used to build chat links. */
  zaloNumber: "84784880685",
} as const;

/** Zalo chat deep-link, optionally pre-filled with a message. */
export const zaloLink = (message?: string) =>
  `https://zalo.me/${CONTACT.zaloNumber}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
