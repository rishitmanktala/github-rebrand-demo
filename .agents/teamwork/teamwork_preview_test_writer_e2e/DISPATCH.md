# Task Assignment: E2E Test Writer

## Mission
Build the automated E2E test harness and test suite according to `TEST_INFRA.md` and `ORIGINAL_REQUEST.md`.

## Exclusive Write Ownership
You exclusively own:
- `tests/` directory (e.g. `tests/run-e2e-tests.js`, `tests/fixtures/`, etc.)
- `TEST_READY.md` at project root (publish when complete)
Do NOT edit any implementation files in `src/`.

## Context & References
- Read `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/ORIGINAL_REQUEST.md`
- Read `/Users/ritesh/Documents/Cyfernode_alt/PROJECT.md`
- Read `/Users/ritesh/Documents/Cyfernode_alt/TEST_INFRA.md`

## Specifications
Implement `tests/run-e2e-tests.js` as an opaque-box test runner executable via `node tests/run-e2e-tests.js`.
The test suite must cover Tiers 1-4:
1. **Tier 1: Feature Coverage (Static AST & Grep Audits)**:
   - Check `src/App.tsx`: Confirm static routes for `/issues`, `/codespaces`, `/marketplace`, `/explore`, `/workspace`, `/discussions`, `/projects`, `/packages`, `/pulls`, `/repositories` exist.
   - Check `src/App.tsx`: Confirm `PlaceholderPage` is no longer used for core navigation links, but only as wildcard fallback `path="*"`.
   - Check `src/data/`: Confirm all 10 JSON mock fixtures exist, parse as valid JSON, and contain non-empty data.
2. **Tier 2: Boundary & Corner Cases**:
   - Check route ordering in `src/App.tsx`: Verify that static routes appear *before* `<Route path="/:user"`.
   - Check store integrity: Verify `src/store.ts` exports expected methods and types.
3. **Tier 3: Interactivity & Button Audit**:
   - Scan codebase for generic fallbacks:
     - Verify zero instances of `addToast('Feature not available...')` or `addToast("Feature not available...")`.
     - Verify zero instances of native browser `alert(`.
     - Verify no empty click handlers `onClick={() => {}}`.
4. **Tier 4: Dual-Lens & Component Verification**:
   - Verify all 10 page components in `src/pages/` exist and import/reference `useAppStore` for lens checking.
   - Run `npm run build` (`tsc && vite build`) to confirm zero compilation errors.

Make the script print detailed PASS/FAIL test assertions, summary statistics, and exit with code 0 on success (or code 1 on failure).
When the test harness is implemented and verified, create `/Users/ritesh/Documents/Cyfernode_alt/TEST_READY.md` following the template in `PROJECT.md`.

## Output
Write your handoff report to:
`/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_test_writer_e2e/handoff.md`
Report the test runner path, command, and test results.

## 2026-09-29T04:52:08Z
You are E2E Test Writer.
Your working directory is: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_test_writer_e2e
Your task assignment is in: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_test_writer_e2e/DISPATCH.md
Read the original user request at: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/ORIGINAL_REQUEST.md
Read PROJECT.md at: /Users/ritesh/Documents/Cyfernode_alt/PROJECT.md
Read TEST_INFRA.md at: /Users/ritesh/Documents/Cyfernode_alt/TEST_INFRA.md

Your exclusive write ownership:
- tests/ directory (e.g., tests/run-e2e-tests.js)
- TEST_READY.md at project root

Implement tests/run-e2e-tests.js covering Tiers 1-4 tests (route checks, PlaceholderPage elimination checks, mock data integrity, generic toast/alert elimination, dual-lens component verification, build check).
Verify the test script runs cleanly with node tests/run-e2e-tests.js.
When test suite is ready and verified, write TEST_READY.md.
Write your handoff report to:
/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_test_writer_e2e/handoff.md
Send a completion message to parent when finished.
