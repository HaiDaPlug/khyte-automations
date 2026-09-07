import type { Metadata } from 'next'
import { SIGNATURE_PROFILES, findPlaceholderFields } from '@/lib/signature-profiles'
import { renderSignature } from '@/lib/render-signature'
import SignatureBuilder from './SignatureBuilder'

export const metadata: Metadata = {
  title: 'Signature Builder',
  robots: { index: false, follow: false },
}

export default function SignaturesPage() {
  // Recipients load these images from the public web, so the copied HTML must
  // carry absolute URLs — a relative /signature-assets/... path resolves against
  // mail.google.com and silently renders as a broken image in every inbox.
  // Must be the canonical host: khyte.se 307-redirects to www.khyte.se, and many
  // mail clients refuse to follow a redirect for an image, so the apex host
  // renders as a broken image even once the assets are deployed.
  // Override only when the assets are served from somewhere other than the site.
  const assetOrigin = process.env.SIGNATURE_ASSET_ORIGIN ?? 'https://www.khyte.se'

  const signatureData = SIGNATURE_PROFILES.map((profile) => ({
    profile,
    missingFields: findPlaceholderFields(profile),
    ...renderSignature(profile, assetOrigin),
  }))

  return <SignatureBuilder signatureData={signatureData} />
}
