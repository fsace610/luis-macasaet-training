# Reading drill (Day 8, 20 minutes, no AI tools)

A teammate ran this test and wrote "Login is fine for launch" in the team channel. Read the result and answer in `perf/answers/reading-drill.md`:

1. Does the result support "fine for launch"? Use numbers.
2. What do you see happen between Hold 60 and Hold 90?
3. Name every reason this run may not tell you the real capacity.
4. What exactly would you run next, and what would you watch while it runs?

```
Test: POST /api/login (staging)            Tool: JMeter 5.6.3, CLI mode
Thread Groups: 30, 60, then 90 threads, run one after another, no timers
Accounts: 1 test account for all threads
Launch target: 50 logins/s, p95 < 1 s, errors < 1%

Stage           threads  req/s   avg      p95      p99      errors   codes
Hold 30 (3 m)    30        71    410 ms   690 ms   0.9 s    0.0%     -
Hold 60 (3 m)    60        74    790 ms   1.6 s    2.4 s    0.2%     423
Hold 90 (3 m)    90        73    1.2 s    2.8 s    4.9 s    9.6%     423 (100%)

Overall (9 m)             73    800 ms   2.1 s    3.8 s    3.3%
Response Assertion (status 200): 96.7% passed
Error %: 3.3%
```
