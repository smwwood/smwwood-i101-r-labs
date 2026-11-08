# R You Watching? — INFO-I101

A buildless, browser-only R homework application. Serve `dist/` over HTTPS (or localhost); do not open `index.html` with `file://`. No application backend, student account, R installation, or API key is required.

## Run locally

```sh
cd r-you-watching
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173. Select a show or the bundled **The Office (US)** example. WebR downloads on first use, so internet access is needed even with the bundled TVmaze snapshot.

## Static hosting

Upload the contents of `dist/` to any HTTPS static host. Serve `.js` and `.mjs` with JavaScript MIME types, `.json` as JSON, and the R helper as text. There is no build step or server API. WebR uses the PostMessage channel, so COOP/COEP headers are not required. Allow `https://webr.r-wasm.org` for WebR downloads and `https://api.tvmaze.com` for show searches. Restrictive Content Security Policies must also allow WebAssembly and WebR's workers; test the actual host before class.

This project is maintained in GitHub and is not configured for Sites deployment. Do not publish it to Sites. The app itself has no sign-in mechanism; hosting elsewhere is a separate choice.

## Project organization

- `dist/index.html`, `styles.css`: responsive, keyboard-accessible interface.
- `dist/app.js`: navigation, input handling, progress, run/export coordination.
- `dist/content.js`: introduction, revised three-part lessons, reference tables, comment-only starters, questions.
- `dist/state.js`: independent basic/customized versions, one-time copying, final graph selection, version-1 progress migration.
- `dist/data.js`: API errors, cleaning, CSV and R data-frame construction.
- `dist/runtime.js`: pinned WebR 0.6.0, one persistent R session, graph capture.
- `dist/i101_helpers_homework.R`: homework copy of the provided lab helpers. Only line/bar helpers are adapted, with small shared option/range utilities. The original file is not modified.
- `dist/storage.js`: IndexedDB persistence.
- `dist/export.js`: paginated PDF and four-file ZIP using locally vendored jsPDF and fflate.
- `dist/data/`: TVmaze Office snapshot retrieved November 6, 2026 (UTC).
- `tests/`: browser regression scenarios and native R helper checks.

## Data decisions

Select a result explicitly; matching results include premiere year, country/language, network, type and status. Episodes are fetched once on selection, ordered by season/number, and assigned one-based `episode_order`. Specials, missing episode numbers, and unaired episodes are excluded. A timestamp must be in the past; without a timestamp, an airdate must be before today (conservative for unknown airtimes). Valid ratings are finite numbers from 0 to 10. `rated_episodes` retains original positions; line graphs connect available observations at those actual positions. NA values in input line data interrupt the line. No invented observations or votes are added.

HTML summaries are parsed in an inert document; scripts/styles are discarded and only plain text is retained. Missing summaries become empty strings. CSV fields are quoted, UTF-8 BOM is included, and formula-leading fields are protected for spreadsheet use.

The recommendation threshold is **10 valid ratings and 10 nonempty summaries**; it is advisory. Single-season shows are allowed. Live checks: Firefly (14 ratings/14 summaries, one season), The Office (202/201), Breaking Bad (62/62), Friends (236/236), Game of Thrones (73/73), and The Simpsons (806 ratings/808 summaries among 809 API entries, including 3 upcoming episodes before filtering). TVmaze updates over time.

## Progress and exports

IndexedDB saves the show/dataset, **six independent editors and graph images**, their successful generating code, interpretation answers, and an R workspace snapshot after successful execution. Each lesson has Create → Make it yours → Interpret. When customization is first reached, the most recent successful basic graph code is copied once if the customization editor is untouched. Subsequent basic runs do not overwrite it. “Copy basic code again” explicitly asks before replacing customized editor text; saved images are retained until a new successful graph is produced.

One persistent WebR session is shared by all editors. Reload initializes fresh WebR and loads the saved R objects, including student-created columns and tables, without rerunning student code. A customization containing only a plotting command can therefore reuse a saved `word_counts` table. Failed runs retain both saved graphs and the last successfully saved R workspace. An R error may partially change the live session before it stops; refreshing returns to the last successful workspace snapshot. The underlying runtime, data-cleaning module, storage adapter, and R helpers were retained for this revision.

Version-1 progress migrates to version 2: prior code/images become the basic versions, the selected show/data/workspace are preserved, equivalent answers are carried forward, and all earlier answers remain readable under each investigation. Radio questions are never inferred from old free-text answers. A migrated assignment opens the new introduction so students can review the revised workflow.

Storage is local to this browser and origin, not synced. Quota/storage failures show a warning. Use one tab per assignment; simultaneous edits are not merged. Changing shows requires confirmation and resets investigation work.

**Export always contains exactly four files:** a PDF and three PNGs. It chooses the most recent successful customized image for each investigation, or the basic image when no customized image exists. The Finish page and PDF explicitly label basic fallbacks as customization not completed. The PDF uses the exact successful code corresponding to each chosen image, not a later failed or unrun edit. Basic code/images remain saved in the browser. Export requires a name, a graph for each investigation, and all interpretation responses, including the histogram prediction explanation; responses are not graded for correctness.

The Finish page explicitly requires students to extract the ZIP and upload only `R_You_Watching_Homework.pdf` to Canvas. Downloading does not submit anything. Graphs are kept for the final project.

## Dependencies and development

Browser libraries are vendored; WebR remains CDN-hosted. `package-lock.json` records development/export dependencies. To update the vendored copies after installing dependencies:

```sh
npm ci
cp node_modules/jspdf/dist/jspdf.umd.min.js dist/vendor/
cp node_modules/fflate/esm/browser.js dist/vendor/fflate.js
```

Keep the license notices in `dist/vendor/`. No analytics or remote homework storage is used. Search text and show IDs go to TVmaze; R runs locally in the browser.

## Testing

```sh
npm ci
npx playwright install chromium
# Start the local server in another terminal first.
npm test
node tests/data.test.js
node tests/state.test.js
Rscript tests/helpers.R
# To run the same suite on a publicly reachable HTTPS static host:
TEST_URL=https://your-host.example npm test
```

See `TESTING.md` for actual completed verification and limits. Tests write sample output under `../../work/` in this task's layout. Tests contain completed commands solely as test fixtures; no student editor is prefilled with these solutions.

## Attribution

Episode data and the bundled snapshot: [TVmaze](https://www.tvmaze.com/api), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Cleaning/filtering are adaptations. Retain attribution and the same license when redistributing the episode data. WebR: https://docs.r-wasm.org/webr/v0.6.0/; jsPDF and fflate: MIT. R helpers derive from the user-provided INFO-I101 lab4 helper file.
