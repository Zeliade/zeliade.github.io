# Cutover runbook

Moving www.zeliade.com from the WordPress export served out of the repository
root to the Astro site in `site/`, built by GitHub Actions.

The work is split across two pull requests **on purpose**. The first is safe to
merge at any time; the second takes the site offline if merged too early.

| PR | Branch | Effect on the live site |
| --- | --- | --- |
| 1 | `modernize/astro-site` | None. Adds `site/` and the workflow alongside the existing files. |
| 2 | `modernize/remove-legacy` | **Deletes the files Pages currently serves.** Only merge after step 4 below passes. |

Expect **2–3 minutes of downtime** between steps 3 and 4. Pick a quiet slot.

---

## 0. Run it locally first

Nothing here touches GitHub, the live site or the repository state. Do it
before anything else — it is the cheapest way to find a problem.

Check out `modernize/remove-legacy`, not the other branch. `site/` is identical
on both, so you see the same website either way — but on `remove-legacy` the old
WordPress files are already gone, which proves the new build does not quietly
depend on any of them.

Requires **Node.js 22.12 or newer** (`node --version`).

<details>
<summary>If you do not have Node.js</summary>

On macOS or Linux, install it with nvm:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# open a NEW terminal, then:
nvm install 22
```

On Windows, use the LTS installer from nodejs.org.

**If `node --version` works but `npm` says "command not found",** nvm is
installed but not loaded in this shell. Either open a new terminal, or run:

```sh
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
```

`npm` is itself a Node script, so it needs `node` *on your PATH* — not merely
present on disk. Adding those two lines to `~/.bashrc` makes it permanent.

</details>

```sh
git fetch origin
git checkout modernize/remove-legacy
cd site
npm ci          # installs exactly the versions in package-lock.json
npm run build   # ~2s; fails loudly if any content is broken
npm run preview # serves on http://localhost:4321
```

Click through everything: every menu entry, a few white paper PDFs, the team
biographies, and an address that does not exist to see the 404 page. Resize to
phone width to check the mobile menu.

Use `npm run preview`, **not** a plain HTTP server. Serving `site/dist` with
`python3 -m http.server` mostly works, but it returns its own bare error page
instead of the site's styled 404, so that one check would mislead you.
`npm run preview` serves the exact files the workflow publishes.

`Ctrl+C` to stop, then `git checkout master`. Nothing needs undoing.

## 1. Merge PR 1 — `modernize/astro-site` → `master`

Safe. Pages is still deploying from the `master` branch root, and every legacy
file is still there, so the live site does not change.

Merging triggers the `Build and deploy site` workflow. It will **build
successfully and then fail on the deploy step** with a message about Pages not
being configured for Actions. That failure is expected at this point — Pages has
not been switched over yet. Confirm the *build* job is green before continuing.

## 2. Check the build artifact

In the failed run, open the `build` job and confirm:

- `✓ 31 logo, 12 PDF and 5 portrait reference(s) resolved.`
- `12 page(s) built`
- `npm run check` reported 0 errors

## 3. Switch Pages to GitHub Actions

**Settings → Pages → Build and deployment → Source: `GitHub Actions`**

Downtime starts here: the previous branch-based deployment stops being served
and nothing has been published by Actions yet. Move straight to step 4.

Leave the custom domain (`www.zeliade.com`) and *Enforce HTTPS* as they are. If
*Enforce HTTPS* becomes unchecked, re-check it once the deployment succeeds.

## 4. Run the workflow

**Actions → Build and deploy site → Run workflow** (branch `master`).

Takes roughly two minutes. Both jobs must be green. Downtime ends when the
`deploy` job finishes.

Then verify on the live domain — not on a preview:

```
https://www.zeliade.com/                     https://www.zeliade.com/team/
https://www.zeliade.com/zqf/                 https://www.zeliade.com/clients/
https://www.zeliade.com/consulting/          https://www.zeliade.com/company/
https://www.zeliade.com/mvccps/              https://www.zeliade.com/contact-us/
https://www.zeliade.com/whitepapers/         https://www.zeliade.com/legal-information/
https://www.zeliade.com/researchpapers/
https://www.zeliade.com/whitepapers/zwp-012-IMforOptions.pdf
```

Check that the padlock is present and that a nonsense URL returns the styled 404.

## 5. Merge PR 2 — `modernize/remove-legacy` → `master`

Only now. Pages no longer serves the repository root, so deleting those 319
files has no visible effect. This is what makes the change real rather than
additive.

## 6. Afterwards

- Submit `https://www.zeliade.com/sitemap-index.xml` in Google Search Console.
- Links to the old PDF locations
  (`/wp-content/uploads/whitepapers/…`) now 404. GitHub Pages cannot redirect a
  `.pdf` URL, so if any are cited externally the citation breaks. Worth a search
  for `zeliade.com/wp-content` to see who links in.
- Delete both branches once you are happy.

---

## Rollback

**Before step 5** — instant, no git operation needed:

> Settings → Pages → Source → `Deploy from a branch`, branch `master`, folder `/ (root)`

Every legacy file is still on `master`, so the old site returns as soon as Pages
rebuilds.

**After step 5** — restore the files first, then switch the source back:

```sh
git revert --no-edit <sha of "Remove the legacy WordPress export">
git push origin master
```

Nothing is ever unrecoverable: the full WordPress export stays in git history.
