# KHYTE SITE — CONSTRAINT PACK (LAW)

## Mission
Ship changes safely with **minimal diffs** and **no layout drift**. Prefer tokens and class-level edits over rewrites.

## Non-negotiables (DO NOT VIOLATE)
1) **Mobile navbar gating stays EXACTLY the same**
   - JS-gated drawer/backdrop/scroll lock
   - **No refactors** or architectural changes to this system.

2) **Desktop nav must not drift**
   - Logo stays left, CTA stays right
   - Centered links remain **absolutely centered** (do not change centering strategy).

3) **Footer + PreFooter**
   - Must remain a shared “base band” conversion foundation across pages.
   - Avoid patchy/white seams; keep the blend continuous and premium.

4) **Change philosophy**
   - Prefer **design tokens** + class edits in `globals.css` / token files.
   - Avoid component rewrites unless strictly necessary.
   - If you must touch layout structure, propose an alternative first.

5) **Verification**
   - Always validate with: `npm run build` and `npm run start`
   - Flag any potential breakage, regressions, or layout shifts.

## Output requirements (when planning)
- Restate the constraints you will follow.
- Provide: (1) minimal-diff plan, (2) exact files to touch, (3) acceptance checklist, (4) risks + rollback plan.
- Do NOT write code unless explicitly asked.

## If you see a better solution
- You may propose it, but **still respect the non-negotiables** and keep diffs minimal.
- Present it as “Option B” with tradeoffs; default to the safest path.