# Day 2 — Fixtures notes

A Playwright fixture is a reusable setup-and-teardown unit, such as a logged-in page, a page object, or an API client. Tests request it by name, and it sets up the environment each test needs and keeps tests isolated from one another.
A Cypress fixture file is something different: just a static data file, usually JSON in cypress/fixtures, that you load with cy.fixture() to feed inputs or stub responses.
So a Playwright fixture provides ready-to-use objects and state, while a Cypress fixture only provides data.
Test data should live separately from the code that uses it.
Static inputs go in data files or a factory, environment values go in config options, and saved login state goes in playwright/.auth, added to .gitignore, since the files contain sensitive cookies and headers.
Page objects and fixtures should receive data, not hold it.
If an object keeps data from one test (a created claim ID, a changed form value, a stale session), the next test depends on that leftover data.
It then passes or fails depending on run order, which makes it flaky and impossible to run in parallel or on its own.
That's why Playwright gives every test a fresh context, and why it uses one account per parallel worker when tests change shared server-side state.
