# Inherited suite (Day 6)

Context: a developer generated these tests with an AI assistant last sprint, saw them pass once, and merged them without review. The client now trusts this suite before every release. Some of it is fine. Some of it lies.

Run it against your local Toolshop (UI on :4200, API on :8091) with your `.env` loaded:

    npx playwright test -c legacy-suite/playwright.legacy.config.ts

Run it **twice**, and once with `--fully-parallel --workers=4`. A test that is green once is not proven.

For every test, red or green, decide which it is:
- a real Toolshop defect (keep the test, mark it `test.fail()` with a bug report in `defects/`),
- a test problem (wrong role, missing or weak assertion, false pass, order or data dependency, hard wait, bad locator, dead or skipped test), or
- fine as it is.

Fix every test problem without weakening what the test checks. Write `notes/day06-legacy-triage.md`: one row per test with symptom, cause, evidence (trace, log, or the run that showed it), fix, and severity, ranked most serious first.
