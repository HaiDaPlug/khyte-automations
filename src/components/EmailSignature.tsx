import type { SignatureProfile } from '@/lib/signature-profiles'

interface Props {
  profile: SignatureProfile
}

// Browser-only preview — uses relative image paths so local dev works without SIGNATURE_ASSET_ORIGIN.
// The actual copy-to-clipboard HTML (absolute asset URLs) comes from render-signature.ts.
export default function EmailSignature({ profile }: Props) {
  const siteUrl = `https://${profile.website}`
  const telHref = `tel:${profile.phone.replace(/\s/g, '')}`
  const cell: React.CSSProperties = { margin: 0, padding: 0 }

  return (
    <table cellPadding={0} cellSpacing={0} width={460} style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", borderCollapse: 'collapse', maxWidth: 460 }}>
      <tbody>

        {/* ── Section 0: Greeting ── */}
        <tr>
          <td colSpan={2} style={{ ...cell, paddingBottom: 14 }}>
            <div style={{ fontSize: 14, color: '#2e2e2e', lineHeight: 1.4 }}>
              {profile.greeting}
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={2} style={{ ...cell, paddingBottom: 16 }}>
            <div style={{ height: 1, background: '#e8e8e8', fontSize: 0, lineHeight: 0 }}>&nbsp;</div>
          </td>
        </tr>

        {/* ── Section 1: Headshot + Name/Role ── */}
        <tr>
          <td style={{ ...cell, paddingRight: 16, verticalAlign: 'middle', width: 76 }}>
            <img
              src={profile.headshotPath}
              width={64}
              height={64}
              alt={profile.name}
              style={{ display: 'block', borderRadius: '50%', width: 64, height: 64, objectFit: 'cover' }}
            />
          </td>
          <td style={{ ...cell, verticalAlign: 'middle' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#0d0d0d', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 5 }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 13, color: '#4a4a4a', lineHeight: 1.4 }}>
              {profile.role}
            </div>
          </td>
        </tr>

        {/* ── Divider ── */}
        <tr>
          <td colSpan={2} style={{ ...cell, paddingTop: 16, paddingBottom: 14 }}>
            <div style={{ height: 1, background: '#e8e8e8' }} />
          </td>
        </tr>

        {/* ── Section 2: Logo + Company + Contact ── */}
        <tr>
          <td style={{ ...cell, paddingRight: 16, verticalAlign: 'top', width: 76 }}>
            <img
              src="/signature-assets/khyte-logo.png"
              width={38}
              height={38}
              alt="Khyte"
              style={{ display: 'block', width: 38, height: 38, margin: '0 auto' }}
            />
          </td>
          <td style={{ ...cell, verticalAlign: 'top' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#0d0d0d', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 5 }}>
              Khyte Automations
            </div>
            <div style={{ fontSize: 13, color: '#4a4a4a', marginBottom: 10, lineHeight: 1.5 }}>
              Arbetsflödesautomation för svenska tjänstebolag.
            </div>
            <div style={{ fontSize: 12, color: '#444', marginBottom: 4, lineHeight: 1.6 }}>
              <a href={telHref} style={{ color: '#333', textDecoration: 'none' }}>{profile.phone}</a>
              <span style={{ color: '#cfcfcf' }}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <a href={`mailto:${profile.email}`} style={{ color: '#333', textDecoration: 'none' }}>{profile.email}</a>
            </div>
            <div style={{ fontSize: 12, color: '#444', lineHeight: 1.6 }}>
              <a href={siteUrl} style={{ color: '#333', textDecoration: 'none' }}>{profile.website}</a>
              <span style={{ color: '#cfcfcf' }}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <a href={profile.linkedinUrl} style={{ color: '#333', textDecoration: 'none' }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- must stay a plain <img>: this markup is also the copy source for email clients */}
                <img
                  src="/signature-assets/linkedin.png"
                  width={14}
                  height={14}
                  alt="LinkedIn"
                  style={{ display: 'inline-block', width: 14, height: 14, verticalAlign: -2 }}
                />
              </a>
            </div>
          </td>
        </tr>

      </tbody>
    </table>
  )
}
