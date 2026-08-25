# zeliade.com

Static site built with [Astro](https://astro.build). Pushing to `master` builds and
deploys automatically via `.github/workflows/deploy.yml`.

## Editing content — you should not need to touch HTML

| What you want to change | File to edit |
| --- | --- |
| Text of a page (Company, Consulting, Model validation, ZQF, Legal) | `src/content/pages/<page>.md` |
| Add or edit a white paper | `src/content/whitepapers/<slug>.md` + PDF in `public/whitepapers/` |
| Add or edit a research paper | `src/content/papers/<slug>.md` |
| Add or edit a team member | `src/content/team/<slug>.md` + photo in `src/assets/team/` |
| Add or remove a client logo | `src/content/clients.yaml` + PNG in `public/img/logos/` |
| Add or edit a client quote | `src/content/testimonials.yaml` |
| Menu structure | `src/data/nav.ts` |
| Address, phone, email | `src/data/site.ts` |
| Colours, type scale, spacing | `src/styles/global.css` (the `:root` block) |

Everything above is validated by a schema in `src/content.config.ts`. A missing PDF,
a malformed date or a forgotten `description` fails the build rather than shipping.

### Adding a white paper

Create `src/content/whitepapers/my-paper.md`:

```markdown
---
title: "A closed form approximation for something"
date: 2026-03-01
pdf: /whitepapers/zwp-013-Something.pdf
ref: zwp-013
---

The abstract goes here. Markdown works, including [links](https://example.com).
```

Drop the PDF at the path given in `pdf:`. It appears on `/whitepapers/`
automatically, sorted newest first. Nothing else to change.

### Adding a team member

Create `src/content/team/firstname-lastname.md`, put a square-ish portrait in
`src/assets/team/`, and set `order` to place them in the list:

```markdown
---
name: "Firstname Lastname"
role: "Quantitative Risk Analyst"
photo: ../../assets/team/firstname.jpg
order: 7
---

First paragraph of the biography.

Second paragraph.
```

## Local development

Requires Node.js 22+.

```sh
npm install      # first time only
npm run dev      # http://localhost:4321
npm run build    # production build into dist/
npm run preview  # serve dist/ locally
npm run check    # type-check .astro files
```

## Notes on the migration

- Page URLs are preserved exactly (`/zqf/`, `/whitepapers/`, `/contact-us/`, …).
- White paper PDFs moved from `/wp-content/uploads/whitepapers/` to `/whitepapers/`.
  No WordPress-shaped path remains anywhere on the site. External links to the old
  PDF locations will break; GitHub Pages cannot redirect a `.pdf` URL.
- `zwp-0005.pdf` (the superseded September 2009 edition of the SVI calibration
  paper) is not published; only the February 2012 revision is linked. The file
  remains in git history.
- The team biographies use a native `<details>` disclosure: no JavaScript,
  keyboard accessible, and the text is in the HTML for search engines.
- Fonts (Inter, Source Serif 4) are self-hosted through `@fontsource-variable`,
  so the site makes no third-party requests.
