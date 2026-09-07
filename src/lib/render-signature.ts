import type { SignatureProfile } from './signature-profiles'

export type RenderedSignature = {
  html: string
  plain: string
}

const LOGO_PATH = '/signature-assets/khyte-logo.png'
const LINKEDIN_PATH = '/signature-assets/linkedin.png'

export function renderSignature(
  profile: SignatureProfile,
  assetOrigin: string
): RenderedSignature {
  const headshotUrl = `${assetOrigin}${profile.headshotPath}`
  const logoUrl = `${assetOrigin}${LOGO_PATH}`
  const linkedinIconUrl = `${assetOrigin}${LINKEDIN_PATH}`
  const siteUrl = `https://${profile.website}`
  const telHref = `tel:${profile.phone.replace(/\s/g, '')}`

  // All inline styles — Gmail and Outlook strip <style> tags.
  // border-radius on <img> is supported in Gmail but renders square in Outlook;
  // pre-cropped circular PNGs with transparency are the cross-client solution.
  const html = `<table cellpadding="0" cellspacing="0" border="0" width="460" style="font-family:'Helvetica Neue',Arial,sans-serif;border-collapse:collapse;max-width:460px;mso-table-lspace:0pt;mso-table-rspace:0pt;">
  <tbody>
    <tr>
      <td colspan="2" style="padding:0 0 14px 0;">
        <div style="font-size:14px;color:#2e2e2e;line-height:1.4;">${profile.greeting}</div>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:0 0 16px 0;">
        <div style="height:1px;background:#e8e8e8;font-size:0;line-height:0;">&nbsp;</div>
      </td>
    </tr>
    <tr>
      <td width="76" style="padding:0;padding-right:16px;vertical-align:middle;">
        <img src="${headshotUrl}" width="64" height="64" alt="${profile.name}" style="display:block;border-radius:50%;width:64px;height:64px;object-fit:cover;" />
      </td>
      <td style="padding:0;vertical-align:middle;">
        <div style="font-size:17px;font-weight:700;color:#0d0d0d;line-height:1.2;letter-spacing:-0.02em;margin:0 0 5px 0;">${profile.name}</div>
        <div style="font-size:13px;color:#4a4a4a;line-height:1.4;margin:0;">${profile.role}</div>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:16px 0 14px 0;">
        <div style="height:1px;background:#e8e8e8;font-size:0;line-height:0;">&nbsp;</div>
      </td>
    </tr>
    <tr>
      <td width="76" style="padding:0;padding-right:16px;vertical-align:top;text-align:center;">
        <img src="${logoUrl}" width="38" height="38" alt="Khyte" border="0" style="display:block;width:38px;height:38px;margin:0 auto;" />
      </td>
      <td style="padding:0;vertical-align:top;">
        <div style="font-size:17px;font-weight:700;color:#0d0d0d;line-height:1.2;letter-spacing:-0.02em;margin:0 0 5px 0;">Khyte Automations</div>
        <div style="font-size:13px;color:#4a4a4a;line-height:1.5;margin:0 0 10px 0;">Arbetsflödesautomation för svenska tjänstebolag.</div>
        <div style="font-size:12px;color:#444;line-height:1.6;margin:0 0 4px 0;">
          <a href="${telHref}" style="color:#333;text-decoration:none;">${profile.phone}</a><span style="color:#cfcfcf;">&nbsp;&nbsp;|&nbsp;&nbsp;</span><a href="mailto:${profile.email}" style="color:#333;text-decoration:none;">${profile.email}</a>
        </div>
        <div style="font-size:12px;color:#444;line-height:1.6;margin:0;">
          <a href="${siteUrl}" style="color:#333;text-decoration:none;">${profile.website}</a><span style="color:#cfcfcf;">&nbsp;&nbsp;|&nbsp;&nbsp;</span><a href="${profile.linkedinUrl}" style="color:#333;text-decoration:none;"><img src="${linkedinIconUrl}" width="14" height="14" alt="LinkedIn" border="0" style="display:inline-block;width:14px;height:14px;vertical-align:-2px;" /></a>
        </div>
      </td>
    </tr>
  </tbody>
</table>`

  const plain = [
    profile.greeting,
    '',
    profile.name,
    profile.role,
    '',
    'Khyte Automations',
    'Arbetsflödesautomation för svenska tjänstebolag.',
    '',
    profile.phone,
    profile.email,
    siteUrl,
    profile.linkedinUrl,
  ].join('\n')

  return { html, plain }
}
