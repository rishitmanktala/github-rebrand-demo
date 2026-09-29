# DISPATCH — worker_remediation_1

## Task Assignment
- Agent Type: teamwork_preview_worker
- Role: Full-Stack Remediation Engineer
- Working directory: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/worker_remediation_1
- Project workspace: /Users/ritesh/Documents/Cyfernode_alt
- Original user request: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/ORIGINAL_REQUEST.md (under ## 2026-09-29T09:01:36Z)
- Scope document: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/orchestrator_2/SCOPE.md

## Reference Reports
You MUST read and follow the findings, line numbers, and concrete code recommendations in:
1. `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/explorer_survey2_1/handoff.md` (Interactive UI Elements)
2. `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/explorer_survey2_2/handoff.md` (Dual-Lens Parity & Visual Consistency)
3. `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/explorer_survey2_3/handoff.md` (Dead Code, Build Warnings & Tests)

## Implementation Scope
You own the end-to-end implementation of the following fixes:

### 1. Repository Cleanup & Build Cleanliness (R3)
- Purge dead code: Delete `src/store/useAppStore.ts` and remove the `src/store/` directory.
- Remove duplicate root asset: Delete `/Users/ritesh/Documents/Cyfernode_alt/logo.png`.
- Remove unused import in `src/components/SplashReveal.tsx:3` (`import { useAppStore } from '../store';`).
- Eliminate build warning on `postcss.config.js`: Convert to CommonJS `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };` (DO NOT add `"type": "module"` to `package.json` as that breaks CommonJS test runners).
- Eliminate Vite chunk warning: Set `build: { chunkSizeWarningLimit: 1000 }` in `vite.config.ts`.

### 2. Interactive UI Elements & Checklist Compliance (R1)
- Global Peek Button (`interactive-elements.md:5`): Add a "Peek" button to `Shell.tsx` (in header or lens switcher) that opens a split-view or side-by-side preview of the alternate lens.
- PR Files Keyboard Navigation (`interactive-elements.md:27`): Add `j`/`k` keydown listener in `PRFilesPage.tsx` to smoothly scroll to next/prev `#file-${idx}`.
- Brand Page Anchor Navigation (`interactive-elements.md:36`): Add anchor navigation bar with links to `#why`, `#audience`, `#colors`, `#typography`, `#gtm` in `BrandPage.tsx`.
- Repo Page Navigation Links:
  - Fix classic tabs (`src/pages/RepoPage.tsx:68-72`) to link to `/issues`, `/actions` (or ensure routes work without 404).
  - Fix Studio Workflow Fabric (`src/pages/RepoPage.tsx:201-205`) so Discussions links to `/discussions`, Codespaces to `/codespaces`, Ship to `/launch`, Actions to `/actions` or proper page.
- PR Page Tabs & Feedback:
  - Wire "Commits" and "Checks" tabs in `PRPage.tsx` (lines 99-108 Classic, 131-138 Studio) so clicking them switches views or scrolls to the checks grid.
  - Wrap reviewer username `sebmarkbage` in a Link.
- Shell Notifications & Dropdowns:
  - Make notification dropdown items in `Shell.tsx` clickable to navigate to `/react/react/pull/28271` or relevant destination and close menu.
  - Add inbound links for `/projects` and `/packages` to the User dropdown menu in both Classic and Studio headers.
- Repositories Page Interactivity:
  - Connect Star button (`src/pages/RepositoriesPage.tsx:140-145`) to Zustand store `starredRepos` & `toggleStarRepo` with counter increment.
  - Add Star button to StudioRepositories view as well.
  - Wire "New" and "Create Repository" buttons (`RepositoriesPage.tsx:48, 174`) to `setActiveModal('create-repo')`.
- Modals & Overlays UX:
  - Add outer backdrop `onClick={handleClose}` (with `e.stopPropagation()` on card) to `CreateRepoModal.tsx` and `CreateCodespaceModal.tsx`.
  - Add exit/return button to the post-merge flood animation in `LaunchPage.tsx` (`v2.0.0 Shipped.`).
  - Add close button to "Share my build" modal in `ProfilePage.tsx`.

### 3. Dual-Lens System Parity & Contrast Fixes (R2)
- Fix Critical Contrast & Invisible Text:
  - `LaunchPage.tsx:123-132`: Fix white text on `#F0F6FC` background in Classic Mode.
  - `RepoPage.tsx:185`: Fix `text-highlight-yellow` on `bg-white` (use dark or high-contrast styling).
  - `CodespacesPage.tsx:248`: Fix `text-highlight-yellow fill-highlight-yellow` on `bg-white`.
  - Replace low-contrast `text-gray-400` on Studio `#EDECE9` paper with `text-ink/60` or `text-gray-600` (`RepoPage.tsx`, `PRPage.tsx`).
  - `MarketplacePage.tsx:329`: Fix `text-ink` on `bg-diff-red` and `bg-ship-green`.
- Dual-Lens Mode Adaptations:
  - Implement dual-lens branching in `LaunchPage.tsx` (Classic dark canvas vs Studio paper neo-brutalist).
  - Add Classic dark styling support to `BrandPage.tsx`.
  - Add Studio styling support to `PresenterControls.tsx`.
  - Style "View Raw Diff" cleanly in `PRFilesPage.tsx`.
  - Ensure Studio modal dividers use `border-t-2 border-ink`.
  - Fix header height collapse / layout bounce in `Shell.tsx:271-281` during lens transition.

### 4. Verification Execution
After implementing all fixes:
1. Run `npm run build` — MUST complete with 0 errors and 0 warnings.
2. Run `node tests/run-e2e-tests.js` — MUST pass 100% (all tiers).
3. Run `node tests/adversarial-routing-test.js` — MUST pass 100%.
4. Run `node tests/adversarial-dual-lens-test.js` — MUST pass 100%.
Document all verification outputs in your handoff report.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
