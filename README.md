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
assets/site.js      — catalog data, lazy video loader, hero chat, hex-tech canvas
assets/img/         — duelio-logo.png (the app icon) + favicon/apple-touch sizes
assets/fonts/       — Bungee-Regular + Nunito weights, lifted from the app
assets/videos/      — current H.264 previews, native posters, and source manifest
CNAME               — custom-domain marker for GitHub Pages (duelioapp.com)
.nojekyll           — tells Pages to serve files as-is
```

## The catalog & its videos

The homepage follows the current `DuelioMessageCatalog.categories` layout:
**Sports → Strategy → Word Games → Multiplayer → Other Games**, with five
columns at every screen size. Its 29 game titles and two builder launchers use
the native order, square keycaps, fixed game captions, category tints, preview
zoom, Quick Draw NEW badge, and Pro builder seals. Board Builder follows Word
Shift; Table Builder leads Other Games. The three iMessage-only titles are
identified below Other Games. Hidden/unavailable titles are not rendered.

`SECTIONS` in `assets/site.js` owns the catalog data. Each game tile links to its
entry in `/games/`; builder tiles link to the shop. Categories can collapse;
Other Games stays open. Pool and Darts cycle all five of their mode clips while
their captions remain **Pool** and **Darts**.

`assets/videos/catalog-manifest.json` records all 39 current preview videos,
their native source paths and SHA-256 hashes, and matching first-frame posters.
The videos are full-length H.264 conversions of the bundled HEVC clips, using
`avconvert --preset Preset640x480 --source in.mp4 --output out.mp4 --replace`.
The native `*-poster.png` files stay visible while clips load or are paused.

Videos load near the viewport, play muted and inline, and release their decoder
when offscreen or when the tab is hidden. **Pause previews** stops every tile;
reduced-motion preferences start with posters and **Play previews**. Failed
requests remain retryable. Refresh the video/poster cache version in `site.js`
and the stylesheet/script versions in HTML when updating the catalog.

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

## App Store link

The landing page links to Apple ID `6792538416` from its navigation, hero, and
platform-availability panel. Keep all three URLs in sync if the listing changes.

## Refreshing assets from the app

- **Logo/icon:** `DuelioAppResources/AppAssets.xcassets/AppIcon.appiconset/appcover.png` →
  `assets/img/duelio-logo.png` (regenerate favicon sizes with `sips -Z 64 …`).
- **Fonts:** `Duelio/Resources/Fonts/{Bungee,Nunito}/…` → `assets/fonts/`.
- **Videos:** `DuelioSharedResources/Resources/MessageTilePreviews/*.mp4` → transcode to H.264 (above)
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
