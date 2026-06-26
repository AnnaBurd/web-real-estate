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

/**
 * Sitewide feature flags.
 */
export const FEATURES = {
  /**
   * Legal hold (2026): hide every direct phone + Zalo link and route all leads
   * through the call-back / write-back form instead. This is the DEFAULT.
   *
   * To restore the previous phone + Zalo behavior everywhere, either set
   * `PUBLIC_SHOW_DIRECT_CONTACT="true"` in the environment, or flip this
   * default to `false`. Nothing else needs to change.
   */
  hideDirectContact: import.meta.env.PUBLIC_SHOW_DIRECT_CONTACT !== "true",
} as const;

/**
 * Lead-form delivery (used when {@link FEATURES.hideDirectContact} is on).
 *
 * The form POSTs the submission as JSON to `endpoint` (default `/api/lead`,
 * handled by the provider-agnostic function in `netlify/functions/lead.mts`).
 * Point PUBLIC_LEAD_ENDPOINT at any form service instead — e.g. a Vietnamese
 * one — without touching the front end. If a POST fails (or `endpoint` is set
 * to ""), the form falls back to opening the visitor's mail client to `email`
 * so a lead is never lost.
 */
export const LEAD = {
  endpoint: import.meta.env.PUBLIC_LEAD_ENDPOINT ?? "/api/lead",
  email: import.meta.env.PUBLIC_LEAD_EMAIL ?? "lienhe@viet-land.vn",
} as const;

/**
 * Who operates the site, for legal transparency. These are individual
 * landowners selling directly — NOT a company or licensed broker. This is the
 * data controller identity surfaced in the footer and privacy policy.
 *
 * To name a real person/representative later (closes the last transparency gap
 * under the Personal Data Protection Law), set `controllerName`.
 */
export const OPERATOR = {
  /** Informal public label. Not a registered business name. */
  label: "VietLand",
  /** Plain-language legal status, shown in footer + privacy policy. */
  statusNote:
    "VietLand là tên gọi của cá nhân chủ đất tự rao bán trực tiếp — không phải công ty hay đơn vị môi giới.",
  /** Optional named controller/representative (empty = not published). */
  controllerName: "",
  /** Contact for general enquiries AND data-subject (privacy) requests. */
  contactEmail: "lienhe@viet-land.vn",
} as const;

/**
 * Privacy / personal-data settings, surfaced in the form notice + policy page.
 */
export const PRIVACY = {
  /** Path to the privacy policy page. */
  path: "/bao-mat",
  /** Effective date shown on the policy (dd/mm/yyyy). */
  effectiveDate: "26/06/2026",
  /** Plain-language retention statement. */
  retentionNote:
    "chỉ lưu trong thời gian ngắn để liên hệ lại với bạn (thường vài ngày), sau đó xóa",
  /**
   * Optional: name of the third-party service that processes form data, if any.
   * Leave "" while undecided — the policy + consent then use neutral wording.
   * When you pick a service (e.g. a Vietnamese one), set it here, e.g.
   * "Tên dịch vụ (Việt Nam)", and the disclosure text updates automatically.
   */
  processor: "",
} as const;
