# duelioapp.com

Marketing site for **Duelio** — static HTML/CSS/JS, no build step, hosted on GitHub Pages
at https://duelioapp.com/.

## Structure

```
index.html          — landing page (canvas hero, animated iMessage mockup, games grid)
privacy/index.html  — privacy policy   → https://duelioapp.com/privacy/
terms/index.html    — EULA / terms     → https://duelioapp.com/terms/
support/index.html  — support + FAQ    → https://duelioapp.com/support/
404.html            — custom 404
assets/site.css     — the whole design system
assets/site.js      — canvas physics, chat loop, tilt cards, filters, reveals
CNAME               — custom-domain marker for GitHub Pages (duelioapp.com)
.nojekyll           — tells Pages to serve files as-is
```

## Deploying (one-time setup)

1. Create a **public** GitHub repo (e.g. `duelioapp.com`).
2. Push this folder to it:
   ```sh
   git remote add origin git@github.com:<your-username>/duelioapp.com.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Source: Deploy from a branch → `main` / root**.
4. Still in Pages settings, set **Custom domain** to `duelioapp.com` (the CNAME file
   already matches).
5. At your domain registrar, add DNS records:
   - Apex `duelioapp.com` — four **A** records:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` — **CNAME** record → `<your-username>.github.io`
6. Back in Pages settings, tick **Enforce HTTPS** once the certificate is issued
   (can take up to an hour after DNS propagates).

Every later update is just commit + push.

## When the app goes live

Search `index.html` for `APP STORE` — three marked spots (nav pill, hero button,
download section). Swap `href` for the real App Store URL and remove the
`disabled` / `soon` classes. Optionally replace the hand-made button with Apple's
official badge from https://developer.apple.com/app-store/marketing/guidelines/.

## Before launch checklist

- [ ] Confirm the **Cloudflare DPA** is executed on the account — Privacy §7's Standard
      Contractual Clauses paragraph is the one unverified claim in the policy.
- [ ] Have a lawyer read `/privacy/` and `/terms/` before submission.
- [ ] App Store Connect URLs:
      privacy policy → `https://duelioapp.com/privacy/`
      support → `https://duelioapp.com/support/`
      marketing → `https://duelioapp.com/`
- [ ] If the policy or EULA text ever changes, change it in **three places together**:
      this site, `PRIVACY.md`/`EULA.md` in the app repo, and
      `Duelio/Shared/Settings/DuelioLegalBody.swift` — and bump the effective date in all.
