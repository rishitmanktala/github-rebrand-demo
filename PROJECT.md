# Project: Cyfernode Alt — GitHub Rebrand Concept Demo Expansion

## Architecture
- **Framework**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion.
- **Dual-Lens Design System**:
  - **Classic Mode**: Dense, terminal-adjacent dark canvas (`#0D1117`), standard GitHub styling (`font-classic`).
  - **Studio Mode**: Warm tactile paper (`#EDECE9`, `.studio-texture`), neo-brutalist ink borders (`border-2 border-ink`), hard drop-shadows (`shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]`), Figtree/Inter Tight typography (`font-people`, `font-display`), vibrant accents (`ship-green`, `merge-purple`, `review-amber`, `ai-blue`, `highlight-yellow`).
  - Mode state managed via Zustand store in `src/store.ts` (`lens: 'classic' | 'studio'`), toggled with `Alt+M` or the header switch.
- **Navigation & Routing**:
  - Configured in `src/App.tsx` using `react-router-dom`.
  - Explicit static routes for all core navbar destinations placed BEFORE `/:user` to avoid parameterized capture.
  - `PlaceholderPage` reserved solely as a fallback for unknown 404 routes (`path="*"`).
- **Data Architecture**:
  - Static, realistic JSON fixtures in `src/data/` loaded via ES modules.
  - Zero empty structural states; populated with authentic engineering data.

## Code Layout
- `src/App.tsx`: Main routing table, global toast renderer, `Alt+M` hotkey listener.
- `src/store.ts`: Canonical Zustand store for `lens`, notifications, modal dialog states, starred repos, and toasts.
- `src/components/`:
  - `Shell.tsx`: Classic & Studio headers, navigation links, dropdown menus.
  - `CreateRepoModal.tsx`, `CreateCodespaceModal.tsx`, `GraduationModal.tsx`: Interactive workflow dialogs.
  - `PresenterControls.tsx`, `OnboardingModal.tsx`: Presentation & onboarding overlays.
- `src/pages/`: Page components providing distinct Classic and Studio subviews:
  - `IssuesPage.tsx`: Global & repository issues dashboard.
  - `CodespacesPage.tsx`: Cloud development environments.
  - `MarketplacePage.tsx`: Developer tool catalog & extensions.
  - `ExplorePage.tsx`: Trending repositories & topics.
  - `WorkspacePage.tsx`: Collaborative developer canvas.
  - `DiscussionsPage.tsx`: Community forum & discussions.
  - `ProjectsPage.tsx`: Kanban planning boards.
  - `PackagesPage.tsx`: Package registry.
  - `PullsPage.tsx`: Global pull request review queue.
  - `RepositoriesPage.tsx`: Repository listings.
  - Existing pages: `RepoPage.tsx`, `PRPage.tsx`, `PRFilesPage.tsx`, `ProfilePage.tsx`, `BlobPage.tsx`, `SuggestPage.tsx`, `LaunchPage.tsx`, `BrandPage.tsx`.
- `src/data/`: JSON fixtures (`issues.json`, `codespaces.json`, `marketplace.json`, `explore.json`, `workspace.json`, `discussions.json`, `projects.json`, `packages.json`, `pulls.json`, `repositories.json`, and existing fixtures).
- `tests/`: Automated E2E and integrity test suite.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Issues Mock Data | Rich mock data fixture for issues (`src/data/issues.json`) | M1 | Survey (Explorer 2) |
| F2 | Codespaces Mock Data | Rich mock data fixture for codespaces (`src/data/codespaces.json`) | M1 | Survey (Explorer 2) |
| F3 | Marketplace Mock Data | Rich mock data fixture for extensions/actions (`src/data/marketplace.json`) | M1 | Survey (Explorer 2) |
| F4 | Explore Mock Data | Rich mock data fixture for trending repos (`src/data/explore.json`) | M1 | Survey (Explorer 2) |
| F5 | Workspace Mock Data | Rich mock data fixture for collaborative workspace (`src/data/workspace.json`) | M1 | Survey (Explorer 2) |
| F6 | Discussions Mock Data | Rich mock data fixture for discussions (`src/data/discussions.json`) | M1 | Survey (Explorer 2) |
| F7 | Projects Mock Data | Rich mock data fixture for Kanban projects (`src/data/projects.json`) | M1 | Survey (Explorer 2) |
| F8 | Packages Mock Data | Rich mock data fixture for package registry (`src/data/packages.json`) | M1 | Survey (Explorer 2) |
| F9 | Pulls Mock Data | Rich mock data fixture for pull request queue (`src/data/pulls.json`) | M1 | Survey (Explorer 2) |
| F10 | Repositories Mock Data | Rich mock data fixture for user repositories (`src/data/repositories.json`) | M1 | Survey (Explorer 2) |
| F11 | Zustand Store Enhancements | Extend `src/store.ts` for notifications, modals, starring, and deprecate orphaned store | M1 | Survey (Explorer 2 & 3) |
| F12 | Static Route Precedence | Update `src/App.tsx` with explicit static routes before `/:user` | M2 | Survey (Explorer 1) |
| F13 | Issues Page | Dual-lens Issues page (`IssuesPage.tsx`) with status filters & label pills | M2 | Survey (Explorer 1 & 2) |
| F14 | Codespaces Page | Dual-lens Codespaces page (`CodespacesPage.tsx`) with status toggles & templates | M2 | Survey (Explorer 1 & 2) |
| F15 | Marketplace Page | Dual-lens Marketplace page (`MarketplacePage.tsx`) with categories & 1-click install | M2 | Survey (Explorer 1 & 2) |
| F16 | Explore Page | Dual-lens Explore page (`ExplorePage.tsx`) with trending timeframes & language filters | M2 | Survey (Explorer 1 & 2) |
| F17 | Workspace Page | Dual-lens Workspace page (`WorkspacePage.tsx`) with sessions & activity stream | M2 | Survey (Explorer 1 & 2) |
| F18 | Discussions Page | Dual-lens Discussions page (`DiscussionsPage.tsx`) with categories & upvotes | M2 | Survey (Explorer 1 & 2) |
| F19 | Projects Page | Dual-lens Projects page (`ProjectsPage.tsx`) with Kanban columns & task movement | M2 | Survey (Explorer 1 & 2) |
| F20 | Packages Page | Dual-lens Packages page (`PackagesPage.tsx`) with npm/docker badges & install command copy | M2 | Survey (Explorer 1 & 2) |
| F21 | Pulls Page | Dual-lens Pull Requests page (`PullsPage.tsx`) with review queues | M2 | Survey (Explorer 1 & 2) |
| F22 | Repositories Page | Dual-lens Repositories page (`RepositoriesPage.tsx`) with search & language filters | M2 | Survey (Explorer 1 & 2) |
| F23 | Placeholder Elimination | Ensure `PlaceholderPage` is no longer used for any core navbar link | M2 | Acceptance Criteria |
| F24 | Dual-Lens Seamless Toggle | Verify `Alt+M` and header toggle work seamlessly across all new pages | M2 | Acceptance Criteria |
| F25 | Header Dialogs & Modals | Replace generic toasts on "+" menu with `CreateRepoModal` & `CreateCodespaceModal` | M3 | Survey (Explorer 3) |
| F26 | Notification Counter & Clear | Make notification bells interactive with real count badge & clear state | M3 | Survey (Explorer 3) |
| F27 | Graduation Nudge Modal | Replace native browser `alert()` in `PresenterControls.tsx` with custom modal | M3 | Survey (Explorer 3) |
| F28 | Blob Editor Interactivity | Add interactive edit mode to `BlobPage.tsx` for "Edit File" button | M3 | Survey (Explorer 3) |
| F29 | PR Files Real Scrolling | Replace fake scroll toast in `PRFilesPage.tsx` with smooth `scrollIntoView` | M3 | Survey (Explorer 3) |
| F30 | Star / Watch / Fork Buttons | Implement interactive starring with counter increment and dynamic feedback | M3 | Survey (Explorer 3) |
| F31 | CI Checks Inspector | Make PR checks grid in `PRPage.tsx` open a CI Check inspector dialog | M3 | Survey (Explorer 3) |
| F32 | PR Page Navigation Tabs | Add PR tab navigation (Conversation, Commits, Checks, Files Changed) | M3 | Survey (Explorer 3) |
| F33 | Elimination of Generic Toasts | Ensure no buttons rely on `addToast('Feature not available...')` or generic stubs | M3 | Acceptance Criteria |
| F34 | E2E Opaque-box Test Suite | Comprehensive automated test harness covering Tiers 1-4 | M4 | Dual Track E2E |
| F35 | Adversarial Hardening (Tier 5) | White-box adversarial testing and bug fixing | M4 | Dual Track E2E |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Rich Mock Data & Store | F1–F11: Static JSON fixtures in `src/data/`, enhance `src/store.ts` | none | DONE |
| M2 | Navbar Pages & Routing | F12–F24: Dual-lens page components in `src/pages/`, static routing in `src/App.tsx` | M1 | DONE |
| M3 | Button Interactivity Polish | F25–F33: Modals, interactive state, remove generic toasts/alerts | M2 | DONE |
| M4 | Final E2E Test Pass & Audit | F34–F35: Pass 100% E2E test suite + Forensic Integrity Audit | M1, M2, M3 | DONE |

## Interface Contracts
### `src/store.ts` Contract
- `lens`: `'classic' | 'studio'`
- `setLens(lens: Lens)`: switches mode and stores in localStorage
- `toggleLens()`: toggles mode
- `toasts`: `Toast[]`
- `addToast(message: string, type?: 'info' | 'success')`: adds toast
- `notificationsCount`: `number` (initial: 3)
- `clearNotifications()`: sets `notificationsCount` to 0
- `starredRepos`: `Record<string, boolean>`
- `toggleStarRepo(repoKey: string)`: toggles star state
- `activeModal`: `'create-repo' | 'create-codespace' | 'graduation' | null`
- `setActiveModal(modal: string | null)`: opens/closes modal dialog

### Page Component Pattern Contract
- Every page in `src/pages/` exports default a function component.
- The component reads `const { lens } = useAppStore();` and conditionally returns `<Classic[Page] />` or `<Studio[Page] />`.
- Classic subcomponents use `font-classic bg-canvas text-paper border-gray-700/800`.
- Studio subcomponents use `font-people bg-paper-warm text-ink .studio-texture border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]`.
