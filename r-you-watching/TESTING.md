# Revision verification — November 7, 2026

## Completed checks

- Revised introduction, six-section navigation, and prominent next-section controls tested in the in-app Chromium browser.
- Live Chernobyl search and explicit selection: five-episode data summary, exact insufficient-data warning, no “You may continue” sentence, and enabled Start Investigating button.
- Bundled Office selection and existing CSV/data behavior retained. Data module tests cover missing ratings/summaries, future episodes, specials, cleaning, CSV, network failures, and HTTP 429.
- Created basic and customized versions of all three graphs using actual WebR. Customized histogram, line and horizontal bar charts successfully overrode default styles with the documented arguments.
- Checked that customized runs leave the basic image and basic code unchanged. Basic reruns leave customized code/images unchanged. One-time copying and explicit copy-again behavior checked; state regression tests cover untouched versus initialized editors.
- Created Storylines TRUE/FALSE columns and word_counts in the basic editor, then graphed that table from the customization editor. Reloaded and reused word_counts without rerunning the basic setup.
- Deliberate R error preserved both graph images and editor text. Reload/new-tab restoration retained all six outputs, code, written answers, and radio selections.
- Version-1 assignment migration checked with real earlier browser progress and unit tests: original graphs/code become basic versions, R objects and data remain, equivalent responses migrate, other earlier responses remain readable. Basic-only Finish fallback is explicitly labeled.
- Missing-name validation tested. Required-response validation, including the histogram reasoning field, checked by regression tests. No response correctness grading is implemented.
- Downloaded and extracted the revised ZIP: exactly one PDF and three PNGs. Each PNG byte-matched its corresponding customized browser graph. Changed the customized Storylines graph and repeated export: the new image was included, the other two images stayed correct, and the basic graph remained unchanged.
- Visually inspected every page of the four-page test PDF: blue editorial headings, matching graph/code, all interpretation responses, readable wrapping, page breaks and footers. Approximately 193 KB for this test submission; length varies with student code/responses.
- Tested a 390px viewport: navigation wraps, editors/graphs stack, Finish notice stays prominent, and the document has no horizontal overflow. Keyboard run shortcut, semantic labels, native radio controls and visible focus styles checked.
- Native R regression suite, documented customization examples, JavaScript syntax checks, data tests and state tests passed. Production dependency audit: no known vulnerabilities at verification time.

## Commands

```sh
node tests/data.test.js
node tests/state.test.js
Rscript tests/helpers.R
npm audit --omit=dev
```

The Playwright suite was revised for the new workflow. Its standalone Chromium launcher was previously blocked by this machine’s sandbox; the revised suite was syntax-checked, while browser interaction checks above were run through the supported in-app browser. The automated Playwright suite is not reported as passed.

## Known limits

- Safari and Firefox, storage quota exhaustion, and a complete browser-application quit/relaunch were not tested. Refresh and a newly opened tab were tested.
- Use one tab per assignment; simultaneous edits are not merged. Progress is local to one browser/origin/device.
- WebR still requires its CDN on first initialization. The bundled example avoids TVmaze outages, not WebR CDN outages.
- The runtime preserves a shared R workspace after successful runs. A failed R command may partly mutate the live session before throwing; refresh restores the last successful workspace snapshot. Saved graph/code versions remain intact.
- PDF uses standard Latin fonts inherited from the existing exporter; full non-Latin character coverage is not guaranteed.
- Private Sites review requires owner sign-in. Use a public HTTPS static host, or explicitly change the Site audience, for account-free student access. A successful deployment does not establish cross-browser classroom testing.

## November 7 instructional follow-up
Verified live TVmaze search and selection in the local in-app browser: selected button, highlighted result, success message, focused confirmation and enabled next step. Inspected all lesson instructions, R editor labels, starter comments and Finish checklist. Node data/state tests and JavaScript syntax checks passed. Added regression coverage for refreshing untouched starter comments while retaining student commands. Five customization arguments are an assignment instruction, not an automatic code-grade gate. Existing export/R execution behavior was not changed or retested end-to-end in this follow-up.
