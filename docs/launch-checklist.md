# Subtitle Checker Launch Checklist

## Build

- [x] Next.js project scaffolded.
- [x] Homepage tool is usable in the first viewport.
- [x] SRT paste input.
- [x] SRT file upload.
- [x] Presets for General, Netflix-style, BBC-style, and Custom.
- [x] Checks CPL, CPS, timing overlap, numbering, empty cues, and line count.
- [x] Copy all issues.
- [x] Copy AI fix prompt.
- [x] Indexable guide and FAQ content below the tool.
- [x] About page.
- [x] Contact page.
- [x] Privacy page.
- [x] robots.txt.
- [x] sitemap.xml.
- [x] Open Graph image.
- [x] Local production build passes.
- [x] Smoke test script added.
- [x] Smoke test passes.

## Before Deploy

- [ ] User reviews local UI.
- [ ] Initialize Git repository.
- [ ] Create GitHub repository.
- [ ] Deploy to Vercel.
- [ ] Add `subtitlechecker.com` and `www.subtitlechecker.com` to Vercel.
- [ ] Configure canonical www domain.
- [ ] Add GA4 measurement ID.
- [ ] Add Microsoft Clarity project ID.

## After Deploy

- [ ] Confirm live homepage loads.
- [ ] Confirm `/robots.txt`.
- [ ] Confirm `/sitemap.xml`.
- [ ] Run Next SEO Checker against the live URL.
- [ ] Add property to Google Search Console.
- [ ] Submit sitemap.
- [ ] Import into Bing Webmaster Tools from GSC.
- [ ] Request indexing.
- [ ] Record launch status in `docs/review.md`.
