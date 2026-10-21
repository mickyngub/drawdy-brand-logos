# Developing Brand Logos

```bash
npm install
npm test
npm run typecheck
npm run check-catalog  # does Iconify still serve every logo in the catalog?
npm run dev            # Tailwind watcher plus the dev server on :5206; in Drawdy run ⌘K → "Add extension dev server" on a local board
npm run build          # regenerates src/catalog-data.ts, src/panel-css.ts, src/webview-html.ts and dist/*.drawdyx
npm run preflight      # before submitting: committed, built, pushed, under Drawdy's limits, above the live version
```

The brand list comes from the pinned `simple-icons` package (titles, colours, aliases) joined with the pinned `@iconify-json/simple-icons` and `@iconify-json/logos` packages: `scripts/build-catalog.mjs` writes it to `src/catalog-data.ts`, and the palette fetches each SVG from the Iconify API as it scrolls into view. The categories, the full-colour fallbacks from SVG Logos and the extra search short forms are hand-picked in `scripts/brand-categories.mjs`; the build stops on a name no package has, and on a fallback that Simple Icons already carries.

Iconify still serves a few hundred logos that Simple Icons has removed, many at the brand's own request (LinkedIn, Slack, Amazon, the Adobe and Microsoft logos among them). The catalog lists only brands in the current Simple Icons data; a big brand that is missing comes from SVG Logos instead, or not at all.

Drawdy builds published versions from this repository's `src/index.ts` and runs no build step, so commit the generated `src/catalog-data.ts`, `src/panel-css.ts` and `src/webview-html.ts` after `npm run build`. The panel is styled with Tailwind CSS v4 utilities: `webview/panel.css` maps Drawdy's theme variables onto Tailwind colours, so the panel follows the board's light and dark themes.

Bump `driverVersion` in `manifest.json` for every release and add it to `CHANGELOG.md`. `npm test` holds the manifest and listing files to Drawdy's submission rules (a description of at most 500 characters, an icon of at most 256 KB, only `@drawdy/driver-protocol` imported from outside the repository), checks that the committed catalog matches the pinned packages and curated lists, and tests the brand colours, the search ranking, the SVG finishing, the Iconify batching, the click layout and the saved-state checks.
