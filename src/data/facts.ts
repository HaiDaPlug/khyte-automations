/**
 * Business facts the site states in more than one place.
 *
 * Copy, metadata and structured data read these instead of repeating the
 * values, so a change here reaches every page at once. Keep it to facts —
 * contact details and terms we stand behind.
 */
export const facts = {
  name: "Khyte Automations",
  url: "https://khyte.se",
  email: "hai@khyte.se",
  phone: {
    display: "070-099 68 38",
    e164: "+46700996838",
  },
  address: {
    street: "Västerbrogatan 8A",
    postalCode: "503 30",
    city: "Borås",
    region: "Västra Götaland",
    country: "SE",
  },
  /** The intro call. The length must match the Calendly event it books. */
  introCall: {
    minutes: 30,
    url: "https://calendly.com/hai-khyteteam/30min",
  },
  /** Fixed price for the build, quoted after the free kartläggning. */
  priceFrom: "15 000 kr",
  /** From kartläggning to production. */
  delivery: {
    small: "1–2 veckor",
    large: "4–6 veckor",
  },
} as const;
