# Mini Checkout and Browser Test Suite

A single-page checkout (plain HTML + JavaScript, no backend) and Playwright browser tests.

## What it does
- Two products: Notebook ($4.50) and Pen Set ($12.00). Add, remove, and change quantities (1-99); line totals and the order total update live.
- One required field: full name.
- Blocks checkout if the cart is empty or the name is blank, shows a clear message, and keeps the name and cart as entered.
- On success shows one confirmation with a reference (`ORD-XXXXXX`). After an order is placed, the form locks, so a second click cannot create another confirmation. "Start a new order" resets everything.

## Run the app
Open `index.html` in any browser. No install needed.

## Run the browser tests
Requires Node.js 18+.

```bash
npm install
npx playwright install chromium
npm test              # headless
npm run test:headed   # watch it run
npm run report        # open the HTML report
```

Each test loads a fresh page, so state never carries over. Assertions check what the customer sees (totals, messages, confirmation text), and rely on Playwright's auto-retrying `expect` instead of fixed waits.

## Files
| File | Purpose |
|---|---|
| `index.html`, `app.js` | The checkout page |
| `tests/checkout.spec.js` | TC-01 to TC-04 automated checks |
| `TEST_PLAN.md` | Risks, test cases, manual test results |

## Results
See `TEST_PLAN.md` for automated and manual results, and the defect log.
