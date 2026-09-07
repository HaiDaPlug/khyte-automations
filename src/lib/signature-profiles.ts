export type SignatureProfile = {
  id: string
  name: string
  role: string
  phone: string
  email: string
  website: string
  linkedinUrl: string
  headshotPath: string
  /** Sign-off rendered above the signature, e.g. "Med varme,". */
  greeting: string
}

// The seed profiles below ship with bracketed / X-ed placeholders. A signature
// carrying one must never reach a real inbox, so the builder blocks copying it
// until the field is filled in. Detection is on the values themselves rather
// than a per-profile flag — a flag would need remembering; this clears itself.
const PLACEHOLDER_PATTERN = /\[.+\]|X{2,}/

const REQUIRED_FIELDS: ReadonlyArray<readonly [keyof SignatureProfile, string]> = [
  ['name', 'last name'],
  ['role', 'role'],
  ['phone', 'phone'],
  ['email', 'email'],
  ['linkedinUrl', 'LinkedIn URL'],
]

export function findPlaceholderFields(profile: SignatureProfile): string[] {
  return REQUIRED_FIELDS.filter(([field]) => PLACEHOLDER_PATTERN.test(profile[field])).map(
    ([, label]) => label
  )
}

// To add a new team member: duplicate one of the objects below and fill in their details.
// Add their headshot (PNG with transparent background) to /public/signature-assets/.
export const SIGNATURE_PROFILES: SignatureProfile[] = [
  {
    id: 'hai',
    name: 'Hai Bui',
    role: 'Grundare, Khyte Automations',
    phone: '+46 70 099 68 38',
    email: 'hai@khyte.se',
    website: 'khyte.se',
    linkedinUrl: 'https://www.linkedin.com/in/hai-pham-bui-8a9893395',
    headshotPath: '/signature-assets/hai-headshot.png',
    greeting: 'Med värme,',
  },
  {
    id: 'abdi',
    name: 'Abdimajiid Mohamud',
    role: 'Marknadsföringsansvarig, Khyte Automations',
    phone: '+46 70 676 69 52',
    email: 'abdi@khyte.se',
    website: 'khyte.se',
    linkedinUrl: 'https://www.linkedin.com/in/abdimajiid-mohamud-233539329/',
    headshotPath: '/signature-assets/abdi-headshot.png',
    greeting: 'Mvh,',
  },
  {
    id: 'erik',
    name: 'Erik Ryden',
    role: 'Tekniskt ansvarig, Khyte Automations',
    phone: '+46 70 932 07 12',
    email: 'erik@khyte.se',
    website: 'khyte.se',
    linkedinUrl: 'https://www.linkedin.com/in/erik-ryden-b46053401/',
    headshotPath: '/signature-assets/erik-headshot.png',
    greeting: 'Allt gott,',
  },
]
