# Training repo seed

1. Run Toolshop locally (Docker Desktop): clone `https://github.com/testsmith-io/practice-software-testing`, run `docker compose -f docker-compose.yml up -d` (the core services only, without the dev extras; first run up to 5 min), then `docker exec -it pst-laravel-api-1 php artisan migrate:fresh --seed`. UI `http://localhost:4200`, API `http://localhost:8091`, Swagger `http://localhost:8091/api/documentation`. The same reset command gives you clean data whenever you need it.
2. Run QuickPizza locally: `docker run --rm -it -p 3333:3333 ghcr.io/grafana/quickpizza-local:latest`. Install Java 17 or newer and Apache JMeter 5.6.3 (https://jmeter.apache.org/download_jmeter.cgi); `jmeter -v` should print the version.
3. Create your repo `luis-macasaet-training` (public: branch protection is only enforced on public repos on a free account; never commit `.env`) with `npm init playwright@latest` (TypeScript, GitHub Actions workflow), copy this seed in, add `.env` and `.auth/` to `.gitignore`, then `cp env.example .env`. Product IDs change every time Toolshop re-seeds, so look one up at runtime (`support/product.ts`), never store one.
4. Protect `main` (pull request required), invite `hmartus-fs` as a collaborator.

Why local and not the hosted practicesoftwaretesting.com: the hosted demo accounts are shared with everyone, they lock after failed logins (423 "Account locked"), the data changes under you, and you must never load-test a public site.
