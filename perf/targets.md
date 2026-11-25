# Performance targets (Days 7–8)

Target system: **QuickPizza on your own machine** (`docker run --rm -it -p 3333:3333 ghcr.io/grafana/quickpizza-local:latest`, then open http://localhost:3333).
Never point JMeter at a public site, including Toolshop and quickpizza.grafana.com.

Tool: **Apache JMeter 5.6.3** (needs Java 17 or newer). Build the test plan in the GUI; run every load test in CLI mode:

    jmeter -n -t perf/load.jmx -l perf/results/load.jtl -e -o perf/results/load-report

The request under test: the pizza recommendation call the UI makes when you click the button for a pizza. Find it in your browser's network tab (method, path, headers, body) and send exactly what the UI sends.

| Target | Value |
|---|---|
| Rate | 40 requests per second, sustained for at least 5 minutes (Open Model Thread Group) |
| Latency | p95 under 500 ms (`Total.pct2ResTime` in `statistics.json`) |
| Errors | under 1% (`Total.errorPct`) |
| Stress cap | 400 requests per second. Stop there if nothing breaks. |

JMeter exits with code 0 even when every request fails, so the pass/fail decision comes from your own threshold check on `statistics.json`.
Add `*.jtl` and `perf/results/*-report/` to `.gitignore`; commit `statistics.json` and screenshots instead.
