'use client'

import { useState, useCallback } from 'react'
import type { SignatureProfile } from '@/lib/signature-profiles'
import EmailSignature from '@/components/EmailSignature'
import s from './signatures.module.css'

type SignatureEntry = {
  profile: SignatureProfile
  html: string
  plain: string
  /** Human labels for fields still holding a placeholder. Empty = ready to copy. */
  missingFields: string[]
}

function formatList(items: string[]): string {
  if (items.length < 2) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

async function writeToClipboard(html: string, plain: string): Promise<boolean> {
  try {
    if (typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plain], { type: 'text/plain' }),
        }),
      ])
      return true
    }
    // Safari fallback: inject a hidden element, select its content, execCommand
    const el = document.createElement('div')
    el.innerHTML = html
    Object.assign(el.style, { position: 'fixed', opacity: '0', pointerEvents: 'none', top: '0', left: '0' })
    document.body.appendChild(el)
    const range = document.createRange()
    range.selectNodeContents(el)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
    document.execCommand('copy')
    document.body.removeChild(el)
    return true
  } catch {
    return false
  }
}

function SignatureCard({ entry }: { entry: SignatureEntry }) {
  const [copied, setCopied] = useState<'rich' | 'plain' | null>(null)
  const isIncomplete = entry.missingFields.length > 0

  const handleCopyRich = useCallback(async () => {
    const ok = await writeToClipboard(entry.html, entry.plain)
    if (ok) {
      setCopied('rich')
      setTimeout(() => setCopied(null), 2200)
    }
  }, [entry.html, entry.plain])

  const handleCopyPlain = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(entry.plain)
      setCopied('plain')
      setTimeout(() => setCopied(null), 2200)
    } catch {
      // ignore
    }
  }, [entry.plain])

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <span className={s.cardName}>
          {entry.profile.name}
          {isIncomplete && <span className={s.badge}>Incomplete</span>}
        </span>
        <span className={s.cardEmail}>{entry.profile.email}</span>
      </div>

      <div className={s.previewWell}>
        <div className={s.preview}>
          <EmailSignature profile={entry.profile} />
        </div>
      </div>

      <div className={s.actions}>
        <button
          type="button"
          onClick={handleCopyRich}
          disabled={isIncomplete}
          className={`${s.btn} ${copied === 'rich' ? s.copied : ''}`}
        >
          {copied === 'rich' ? 'Copied' : 'Copy signature for Gmail'}
        </button>
        <button
          type="button"
          onClick={handleCopyPlain}
          disabled={isIncomplete}
          className={`${s.btnGhost} ${copied === 'plain' ? s.copied : ''}`}
        >
          {copied === 'plain' ? 'Copied' : 'Copy plain text'}
        </button>
      </div>

      {isIncomplete && (
        <p className={s.missing}>
          Still a placeholder: {formatList(entry.missingFields)}. Fill it in at{' '}
          <code>src/lib/signature-profiles.ts</code> and reload.
        </p>
      )}
    </div>
  )
}

export default function SignatureBuilder({ signatureData }: { signatureData: SignatureEntry[] }) {
  return (
    <div className={s.page}>
      <header className={s.topbar}>
        <span className={s.wordmark}>
          <b>Khyte</b> · Internal
        </span>
        <span className={s.topbarMeta}>Signature Builder</span>
      </header>

      <div className={s.inner}>
        <h1 className={s.heading}>Email signatures</h1>
        <p className={s.lede}>
          Pick yours, copy it, and paste it into Gmail. The images are served from khyte.se, so
          they render for anyone who receives the mail.
        </p>

        <ol className={s.steps}>
          <li>Press <code>Copy signature for Gmail</code> on your card below.</li>
          <li>In Gmail, open <code>Settings → See all settings → General</code>.</li>
          <li>Scroll to <code>Signature</code> and choose <code>Create new</code>.</li>
          <li>Paste, then <code>Save Changes</code> at the bottom of the page.</li>
        </ol>

        {signatureData.map((entry) => (
          <SignatureCard key={entry.profile.id} entry={entry} />
        ))}

        <p className={s.fallback}>
          If pasting drops the formatting, select the preview above with your cursor, copy that,
          and paste it instead.
        </p>
      </div>
    </div>
  )
}
