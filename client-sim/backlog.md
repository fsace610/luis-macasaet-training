# Day 9 — client-week simulation (Toolshop, local)

Treat today as a real client day. Start the timer when you start work.

## Sprint tickets to test today
| Ticket | Story | Notes |
|---|---|---|
| TS-201 | As a shopper, I can search products by name. | Partial names and case should match. |
| TS-202 | As a shopper, I can sort products by price, low to high and high to low. | |
| TS-203 | As a customer, I can update the phone number on my profile. | The number is validated. |
| TS-204 | As a customer, I cannot open any admin page or call admin-only APIs. | Security ticket. |

## Automation commitment for today
The client lead agreed that **TS-201 and TS-204 are automated and running in CI by end of day**. TS-202 and TS-203 can be tested manually today.

## Event at 2 hours in
The product owner messages: "Hold TS-203. The phone validation rules are changing; I'll confirm the new rules tomorrow." Handle it the way you would with a real client.

## What to hand in
- `client-sim/day-plan.md` — written in the first 15 minutes: your time split, what you'll automate, what stays manual, and the risks for today.
- `client-sim/ticket-results.md` — per ticket: what you tested, the result, evidence (screenshot, response, trace), and any defects.
- Automated tests for TS-201 and TS-204 on your fixtures, CI green.
- `client-sim/messages.md` — every message you would send today (including your reply about TS-203), with the time you'd send it.
- `client-sim/status.md` — your end-of-day status to the client lead: Done (what runs, where) · Not done · Blocked or at risk · Defects found · Next.
