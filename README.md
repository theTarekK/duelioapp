# duelioapp.com

Marketing site for **Duelio** — static HTML/CSS/JS, no build step, hosted on GitHub Pages
at https://duelioapp.com/.

Built from the **real app assets** — the Duelio icon, the Bungee/Nunito fonts, the
red/blue/gold "duel" palette, and the actual iMessage catalog preview clips.

## Structure

```
index.html          — landing page: hex-tech hero (real gameplay in the phone),
                      the iMessage catalog recreation, online matchmaking, ways to play
privacy/index.html  — privacy policy   → https://duelioapp.com/privacy/
terms/index.html    — EULA / terms     → https://duelioapp.com/terms/
support/index.html  — support + FAQ    → https://duelioapp.com/support/
404.html            — custom 404
assets/site.css     — the whole design system (self-hosted @font-face for Bungee + Nunito)
assets/site.js      — catalog + config-popup engine, lazy video loader, hex-tech canvas
assets/img/         — duelio-logo.png (the app icon) + favicon/apple-touch sizes
assets/fonts/       — Bungee-Regular + Nunito weights, lifted from the app
assets/videos/      — 38 catalog preview clips (H.264, see note below)
CNAME               — custom-domain marker for GitHub Pages (duelioapp.com)
.nojekyll           — tells Pages to serve files as-is
```

## The catalog & its videos

`assets/videos/` holds the 38 clips from `Duelio/Resources/MessageTilePreviews/`
(`MessageTilePreview-<gamekey>.mp4`, plus the 5 `PoolModePreview-*` and 5
`DartsModePreview-*` mode clips). **They were transcoded from the app's HEVC/H.265 to
H.264 and trimmed to 5s** — the originals only decode in Safari, and H.264 plays
everywhere. Re-transcode with macOS's built-in tool if you refresh them:
`avconvert -p Preset640x480 --duration 5 -s in.mp4 -o out.mp4 --replace`.

The catalog on the homepage is a faithful recreation of the in-app iMessage catalog:
grouped category sections (Strategy / Sports / Word Games / Multiplayer / Card Games /
Racing), video tiles that autoplay muted (lazy-loaded so only near-viewport clips
decode), and a tap → play-options popup (HOST ONLINE / FIND A GAME / JOIN WITH CODE /
PLAY OVER IMESSAGE / PASS & PLAY) → per-game config with the app's real options. Pool
and Darts open their forced 5-mode picker first, exactly like the app. All of this is
data-driven in `SECTIONS` at the top of `assets/site.js` — edit there to change games.

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

## Refreshing assets from the app

- **Logo/icon:** `Duelio/Assets.xcassets/AppIcon.appiconset/appcover.png` →
  `assets/img/duelio-logo.png` (regenerate favicon sizes with `sips -Z 64 …`).
- **Fonts:** `Duelio/Resources/Fonts/{Bungee,Nunito}/…` → `assets/fonts/`.
- **Videos:** `Duelio/Resources/MessageTilePreviews/*.mp4` → transcode to H.264 (above)
  → `assets/videos/`.
- **Colours** live in `:root` at the top of `assets/site.css`, sampled from the icon.

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
