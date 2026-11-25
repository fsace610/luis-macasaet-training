# Repo seed — Luis Francisco Macasaet, Training Plan 1

Copy these folders into your training repo **after** `npm init playwright@latest` (TypeScript, GitHub Actions workflow: yes). Practice material, not a test.

| Path | Used on | What it is |
|---|---|---|
| `env.example` | Day 1 | Copy to `.env` (never commit it). Local Toolshop accounts and URLs. |
| `support/product.ts` | Days 2–9 | Looks up a product ID at runtime (IDs change on every re-seed). |
| `review-drills/R1–R5` + `README.md` | Days 2, 3, 4, 8, 9 | Five short files with problems in them, for 20-minute timed reviews (R1–R4 practice; R5 recorded on Day 9). Answers go in `review-drills/answers/`. |
| `drills/day03-order-dependent.spec.ts` | Day 3 | A test file that passes one way and fails others. |
| `legacy-suite/` | Day 6 | An inherited Playwright suite to triage and fix. Run with `-c legacy-suite/playwright.legacy.config.ts`. |
| `perf/targets.md`, `perf/reading-drill.md` | Days 7–8 | JMeter load-test targets for local QuickPizza, and a results-reading drill. |
| `client-sim/scenario.md`, `client-sim/backlog.md` | Days 5 and 9 | The automation-plan scenario and the client-week simulation. |

Verified 2026-11-24: all `.ts` files type-check with `@playwright/test` 1.65 (`tsc --noEmit`, strict). The legacy suite's UI tests were run against the hosted Toolshop (results in the EM key). API tests were not run live because the hosted API was unstable that day; run everything against your local Toolshop.
