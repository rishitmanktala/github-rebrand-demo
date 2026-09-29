# Scope: Cyfernode Alt Comprehensive Audit & Remediation (orchestrator_2)

## Architecture
- Framework: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
- Dual-Lens Design System:
  - Classic Mode: Dense, terminal-adjacent dark canvas (#0D1117), font-classic
  - Studio Mode: Tactile paper (#EDECE9, .studio-texture), neo-brutalist ink borders (border-2 border-ink), Figtree/Inter Tight typography (font-people, font-display), vibrant accents (ship-green, merge-purple, review-amber, ai-blue, highlight-yellow)
  - Mode state managed via Zustand store in `src/store.ts` (`lens: 'classic' | 'studio'`), toggled with `Alt+M` or the header switch
- Navigation & Routing in `src/App.tsx` with explicit static routes before `/:user`

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F36 | Purge Orphaned Store | Delete dead `src/store/useAppStore.ts` and `src/store/` directory | M5 | Survey (Explorer 3) |
| F37 | Cleanup Unused Assets & Imports | Delete duplicate root `logo.png`; remove unused `useAppStore` import in `SplashReveal.tsx` | M5 | Survey (Explorer 3) |
| F38 | Eliminate Build Warnings | Fix `postcss.config.js` to CommonJS `module.exports` and set chunk size limit in `vite.config.ts` | M5 | Survey (Explorer 3) |
| F39 | Global Peek Button | Implement Split-View / Peek modal or drawer in `Shell.tsx` per `interactive-elements.md:5` | M6 | Survey (Explorer 1) |
| F40 | PR Files Keyboard Navigation | Implement `j`/`k` keydown listener in `PRFilesPage.tsx` per `interactive-elements.md:27` | M6 | Survey (Explorer 1) |
| F41 | Brand Page Anchor Navigation | Add sticky/floating anchor navigation bar in `BrandPage.tsx` per `interactive-elements.md:36` | M6 | Survey (Explorer 1) |
| F42 | Repo Page Route Fixes | Fix tabs and Workflow Fabric in `RepoPage.tsx` to link to valid routes (`/issues`, `/codespaces`, `/discussions`, `/launch`) | M6 | Survey (Explorer 1 & 2) |
| F43 | PR Page Tabs & Links | Wire "Commits" and "Checks" tabs in `PRPage.tsx`; link reviewer username | M6 | Survey (Explorer 1) |
| F44 | Notification & Dropdown Navigation | Wire notification rows in `Shell.tsx` to navigate to PR / discussions; add `/projects` and `/packages` links to User dropdown | M6 | Survey (Explorer 1 & 3) |
| F45 | Repositories Page Interactivity | Connect Star button to Zustand store; wire "New" and "Create Repository" buttons to `CreateRepoModal` | M6 | Survey (Explorer 1) |
| F46 | Modals & Overlays UX Polish | Add backdrop click-to-dismiss to `CreateRepoModal` & `CreateCodespaceModal`; add exit button to `LaunchPage` flood animation; add close button to Profile share modal | M6 | Survey (Explorer 1) |
| F47 | Contrast & Legibility Fixes | Fix invisible text on `LaunchPage` (white on #F0F6FC), `RepoPage` (yellow on white), `CodespacesPage`, and low-contrast `text-gray-400` on Studio paper | M7 | Survey (Explorer 2) |
| F48 | Dual-Lens Mode Adaptations | Add dual-lens branching to `LaunchPage`, `BrandPage`, `PresenterControls`; fix Studio modal dividers and footer styling | M7 | Survey (Explorer 2) |
| F49 | Lens Transition Stability | Fix header height collapse / layout bounce during lens transition in `Shell.tsx` | M7 | Survey (Explorer 2) |
| F50 | Full Test Verification & Audit | Ensure 100% pass across E2E test runner, routing tests, dual-lens tests, and forensic integrity audit | M8 | Dual Track Verification |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M5 | Repository Cleanup & Build Cleanliness | F36–F38: Purge dead code, remove duplicate assets, eliminate all build warnings | none | IN_PROGRESS |
| M6 | Interactive UI & Controls Remediation | F39–F46: Peek button, j/k nav, anchor nav, route fixes, wire tabs/buttons/modals | M5 | PLANNED |
| M7 | Dual-Lens System Parity & Visual Consistency | F47–F49: Contrast repairs, dual-lens branching for unadapted pages/modals, layout stability | M6 | PLANNED |
| M8 | Full Verification, E2E Suite, & Final Audit | F50: Execute all test suites, verify clean build, complete Forensic Integrity Audit | M5, M6, M7 | PLANNED |
