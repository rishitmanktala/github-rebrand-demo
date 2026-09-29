# E2E Test Infra: Cyfernode Alt

## Test Philosophy
- **Requirement-Driven & Opaque-Box**: Derived strictly from `ORIGINAL_REQUEST.md` and user-facing acceptance criteria.
- **Verification Methodology**:
  - Tier 1: Feature Coverage (Core navigation, route existence, component rendering without errors).
  - Tier 2: Boundary & Corner Cases (Direct URL access, trailing slashes, parameterized vs. static route resolution, mode toggles).
  - Tier 3: Cross-Feature Combinations (Dual-lens switching on all new pages, state persistence across navigation, search modal routing).
  - Tier 4: Real-World Scenarios (End-to-end navigation flows from Header to New Page to Interactive Modals to Lens Toggle).

## Feature Inventory Coverage Matrix
| # | Feature | Requirement | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|-------------|:------:|:------:|:------:|:------:|
| 1 | Static Routing Precedence | R1 / AC1 | ✓ | ✓ | ✓ | ✓ |
| 2 | PlaceholderPage Removal | R1 / AC1 | ✓ | ✓ | ✓ | ✓ |
| 3 | Issues Page Rendering | R1 / AC2 | ✓ | ✓ | ✓ | ✓ |
| 4 | Codespaces Page Rendering | R1 / AC2 | ✓ | ✓ | ✓ | ✓ |
| 5 | Marketplace Page Rendering | R1 / AC2 | ✓ | ✓ | ✓ | ✓ |
| 6 | Explore Page Rendering | R1 / AC2 | ✓ | ✓ | ✓ | ✓ |
| 7 | Workspace Page Rendering | R1 / AC2 | ✓ | ✓ | ✓ | ✓ |
| 8 | Discussions Page Rendering | R1 / AC2 | ✓ | ✓ | ✓ | ✓ |
| 9 | Projects Page Rendering | R1 / AC2 | ✓ | ✓ | ✓ | ✓ |
| 10 | Packages Page Rendering | R1 / AC2 | ✓ | ✓ | ✓ | ✓ |
| 11 | Pulls Page Rendering | R1 / AC2 | ✓ | ✓ | ✓ | ✓ |
| 12 | Repositories Page Rendering | R1 / AC2 | ✓ | ✓ | ✓ | ✓ |
| 13 | Rich Mock Data Fixtures | R2 | ✓ | ✓ | ✓ | ✓ |
| 14 | Elimination of Generic Toasts | R3 / AC3 | ✓ | ✓ | ✓ | ✓ |
| 15 | Elimination of Native Alert | R3 / AC3 | ✓ | ✓ | ✓ | ✓ |
| 16 | Observable Button Behaviors | R3 / AC3 | ✓ | ✓ | ✓ | ✓ |
| 17 | Dual-Lens Toggle Seamlessness | R1 / AC4 | ✓ | ✓ | ✓ | ✓ |

## Test Architecture
- **Automated Test Harness**: `tests/run-e2e-tests.js` executable via Node.js.
- **Suite Components**:
  1. **AST & Static Route Audit**: Verifies `App.tsx` contains static routes for all navbar links ahead of `/:user`, and `PlaceholderPage` is strictly limited to wildcard `*`.
  2. **Codebase Interactivity Audit**: Verifies zero instances of `addToast('Feature not available...')`, zero generic placeholder toasts, zero empty `alert()` calls, and zero inert buttons.
  3. **Mock Data Integrity Verification**: Validates all 10 JSON fixtures exist, parse cleanly, and contain non-empty data arrays matching schema.
  4. **Headless Component & Dual-Lens Navigation**: Verifies that each new route mounts cleanly under both `'classic'` and `'studio'` lenses without console errors.
  5. **TypeScript & Bundle Verification**: Runs `npm run build` (`tsc && vite build`) to confirm 100% type safety and bundle generation.

## Test Runner Invocation
```bash
node tests/run-e2e-tests.js
```
Expected output: All test tiers pass with exit code 0.
