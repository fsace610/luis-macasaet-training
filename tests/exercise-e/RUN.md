# Exercise E — Run log

Run on 2026-11-27 against the local Toolshop (web `http://localhost:4200`, API `http://localhost:8091`). Both were running.

Command (from the repo root): `npx playwright test -c tests/exercise-e`

## What is covered

- `fixtures.ts` has a `category` fixture built with `test.extend`. It logs in as the admin through the API, creates a category with a unique name and slug (`POST /categories`, expects 201), passes it to the test, and deletes it after the test (`DELETE /categories/{id}`, expects 204). The `loginAs(role)` fixture gets a token from `POST /users/login` and writes it to `localStorage['auth-token']` with an init script, so no test logs in through the UI.
- `category-delete.api.spec.ts`: a customer calls `DELETE /categories/{id}` and gets exactly `403 {"message":"Forbidden"}`. `GET /categories/tree/{id}` then returns 200 with the same id, name and slug, which proves the category still exists. (`GET /categories/{id}` returns 405 in this Toolshop version, so it can't be used for the check.)
- `admin-categories.ui.spec.ts`: a customer who opens `/admin/categories` lands on `/auth/login` and never sees the Categories heading. An admin who opens it sees the Categories heading and table.

After both runs, `GET /categories` lists no leftover `Exercise E` categories, so the fixture cleanup works.

## Run 1 — `npx playwright test -c tests/exercise-e`

```
Running 3 tests using 2 workers

  ok 1 [chromium] › tests\exercise-e\admin-categories.ui.spec.ts:4:3 › Admin categories page access › a customer is sent to the login page (1.5s)
  ok 2 [chromium] › tests\exercise-e\admin-categories.ui.spec.ts:14:3 › Admin categories page access › an admin sees the categories page (1.5s)
  ok 3 [chromium] › tests\exercise-e\category-delete.api.spec.ts:4:3 › Categories API: delete permissions › a customer cannot delete a category, and the category still exists (893ms)

  3 passed (3.3s)
```

## Run 2 — `npx playwright test -c tests/exercise-e --repeat-each=2`

```
Running 6 tests using 2 workers

  ok 2 [chromium] › tests\exercise-e\admin-categories.ui.spec.ts:14:3 › Admin categories page access › an admin sees the categories page (1.6s)
  ok 1 [chromium] › tests\exercise-e\admin-categories.ui.spec.ts:4:3 › Admin categories page access › a customer is sent to the login page (1.7s)
  ok 3 [chromium] › tests\exercise-e\category-delete.api.spec.ts:4:3 › Categories API: delete permissions › a customer cannot delete a category, and the category still exists (1.2s)
  ok 4 [chromium] › tests\exercise-e\admin-categories.ui.spec.ts:4:3 › Admin categories page access › a customer is sent to the login page (1.1s)
  ok 5 [chromium] › tests\exercise-e\category-delete.api.spec.ts:4:3 › Categories API: delete permissions › a customer cannot delete a category, and the category still exists (1.2s)
  ok 6 [chromium] › tests\exercise-e\admin-categories.ui.spec.ts:14:3 › Admin categories page access › an admin sees the categories page (994ms)

  6 passed (6.3s)
```
