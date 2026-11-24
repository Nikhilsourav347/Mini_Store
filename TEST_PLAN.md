# Test Plan - Mini Checkout

Environment: browser + version: ______  OS: ______  Date: ______

## Risks, highest priority first
| # | Risk | Impact | Covered by |
|---|---|---|---|
| R1 | Wrong line or order total | Customer is charged the wrong amount | TC-03 |
| R2 | Checkout allowed with empty cart or blank name | Invalid orders | TC-02, TC-05 |
| R3 | Double-click creates two orders or confirmations | Duplicate charge, confusion | TC-04, TC-06 |
| R4 | Entered data lost after a validation error | Customer frustration | TC-02, TC-05 |
| R5 | Confirmation missing or has no reference | Customer unsure the order went through | TC-01 |
| R6 | Odd quantities (0, negative, blank, very large) break totals | Wrong totals | TC-07 |
| R7 | Cart editable after the order is placed | Confirmation shows a stale total | TC-08 |

## Test cases
| ID | Type | Steps | Expected |
|---|---|---|---|
| TC-01 | Auto | Add Notebook, enter name, Place Order | Confirmation visible with name and `ORD-XXXXXX` reference |
| TC-02 | Auto | Add Notebook, leave name blank, Place Order | Message "Please enter your full name."; no confirmation; cart and total still shown |
| TC-03 | Auto | Add both products; set Notebook qty 3, Pen Set qty 2 | Line totals $13.50 and $24.00; order total $37.50 |
| TC-04 | Auto | Add item, enter name, double-click Place Order | Exactly one confirmation and one reference |
| TC-05 | Manual | Empty cart, type a name, Place Order | Cart-empty message shown; name still in the field; no confirmation |
| TC-06 | Manual | Add item, enter name, click Place Order twice as fast as possible (repeat 5 times; also try with DevTools CPU throttling) | One confirmation; reference does not change |
| TC-07 | Manual | Set qty to 0, -1, blank, 150 | Total never shows nonsense; field snaps back to a valid quantity (max 99) |
| TC-08 | Manual | After a successful order, try to add/remove/change items | Controls are disabled |

## Manual test results (fill in from your own run)

### TC-05 Empty cart
- Steps followed:
- Expected: message shown, name preserved, no confirmation
- Actual:
- Result (Pass/Fail):
- Evidence (screenshot file name):

### TC-06 Rapid double-click
- Steps followed (number of attempts):
- Expected: one confirmation, one stable reference
- Actual:
- Result (Pass/Fail):
- Evidence (screenshot/screen recording file name):

## Automated results
Command: `npm test`   Result: ___ passed / ___ failed   Report: `playwright-report/index.html`

## Defects
Log a defect only if you actually observe one. If none, write "No defects found in the checks above."

| ID | Title | Steps to reproduce | Expected | Actual | Evidence |
|---|---|---|---|---|---|
