# Day 2 — Setup project, fixtures, role tests

## What is here

| File | Purpose |
|---|---|
| `playwright.config.ts` | Loads `.env` (falls back to `env.example`), sets `baseURL`, `testIdAttribute: 'data-test'`, and a `setup` project that `chromium` depends on. |
| `tests/setup/auth.setup.ts` | Logs in once per role through the real login form and saves `.auth/<role>.json` (gitignored). Checks the `/users/login` response is 200 and the header shows the user's name before saving, so a guest state is never saved. |
| `fixtures/roles.ts` | The three roles (customer, customer2, admin), their `.env` keys, display names and auth file paths. |
| `fixtures/index.ts` | `test.extend` fixtures: `customerPage`, `customer2Page`, `adminPage`, `guestPage` (each its own browser context, closed after the test), `apiUrl`, and `productId` (looked up at runtime via `support/product.ts`). |
| `tests/roles/*.spec.ts` | 9 role tests: each role's allowed page (positive control) and its blocked page (negative), guests blocked from both areas, and two customers signed in at once without sharing state. |

## Why storageState works for Toolshop

Toolshop keeps the JWT in `localStorage['auth-token']`. `storageState` saves localStorage per origin, so the saved file restores the login. The route guards (`AdminAuthGuard`, `UserAuthGuard`) check the role from the API and redirect to `/auth/login`, which is what the negative tests assert. They also assert that the protected heading never renders.

## Parallel runs: finding

At 4 workers with `--repeat-each=5`, 22 of 48 tests failed with timeouts. The cause is the local app, not the tests:

- The Toolshop API runs `pm.max_children = 5` PHP-FPM workers, and a cold request took 5.3s.
- Every page makes several API calls, so 4 browsers queue up behind 5 workers. The Angular guards resolve late, and 5s assertions time out (the snapshot shows the header rendered but the auth state not yet resolved).

Fix: local `workers: 2` and `expect.timeout: 10s` (setup login waits up to 15s). Result: 144/144 passed over 3 × `--repeat-each=5`. Retries were not used to hide it.

## How to verify

```
docker exec -it pst-laravel-api-1 php artisan migrate:fresh --seed
npx playwright test
npx playwright test --repeat-each=5
```

Expected: 12 passed (3 setup + 9 role tests), and 48 passed for the repeat run.

## Not covered yet

- CI: the GitHub Actions workflow has no Toolshop to test against, so the CI check fails on this PR. Running Toolshop in CI is Day 5 work.
- Firefox and WebKit projects were removed to keep local runs fast. They can return once CI is sharded on Day 5.
