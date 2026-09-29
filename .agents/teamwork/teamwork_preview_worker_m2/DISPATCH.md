# Task Assignment: Worker M2 (Navbar Pages & Routing)

## Mission
Implement Milestone 2: Build distinct, sensible React components for all 10 navbar pages adhering to the dual-lens architecture (Classic vs. Studio modes) using the Zustand store, and wire static routing in `src/App.tsx`.

## Exclusive Write Ownership
You exclusively own:
- `src/pages/IssuesPage.tsx`
- `src/pages/CodespacesPage.tsx`
- `src/pages/MarketplacePage.tsx`
- `src/pages/ExplorePage.tsx`
- `src/pages/WorkspacePage.tsx`
- `src/pages/DiscussionsPage.tsx`
- `src/pages/ProjectsPage.tsx`
- `src/pages/PackagesPage.tsx`
- `src/pages/PullsPage.tsx`
- `src/pages/RepositoriesPage.tsx`
- `src/App.tsx`
Do NOT edit files in `src/data/` or `tests/`.

## Context & References
- Read `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/ORIGINAL_REQUEST.md`
- Read `/Users/ritesh/Documents/Cyfernode_alt/PROJECT.md`
- Read `/Users/ritesh/Documents/Cyfernode_alt/TEST_READY.md`
- Read `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_explorer_survey_1/handoff.md`
- Read `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_explorer_survey_2/handoff.md`

## Specifications

### 1. New Page Components (`src/pages/*.tsx`)
Build 10 distinct, production-quality React page components importing data from `src/data/`:
1. `IssuesPage.tsx` (uses `src/data/issues.json`):
   - Classic: Issue table with open/closed tabs, search/filter bar, label pills with hex colors, author & comment counts.
   - Studio: Momentum banner, Copilot issue summaries, bold category tags (`BUG`, `RFC`, `PERF`), reaction buttons.
2. `CodespacesPage.tsx` (uses `src/data/codespaces.json`):
   - Classic: Machine specs table (cores, RAM, disk), active/shutdown state pills, last used, start/stop buttons.
   - Studio: Instant Workshop hero, hardware resource dials, one-click Launch Session, starter template cards.
3. `MarketplacePage.tsx` (uses `src/data/marketplace.json`):
   - Classic: Category sidebar, extension cards with verified publisher badges, star ratings, installs, price badges.
   - Studio: "Extend the Workshop" hero, high-contrast tool cards, one-click "Install to Workshop" toggle with state change.
4. `ExplorePage.tsx` (uses `src/data/explore.json`):
   - Classic: Trending timeframe pills (today, this week), language filter, star/fork metrics, contributor avatars.
   - Studio: Community radar, momentum velocity counters (`+4,210 stars this week`), spotlight story, topic cloud.
5. `WorkspacePage.tsx` (uses `src/data/workspace.json`):
   - Classic: Multi-repo dashboard, pending reviews queue, activity feed.
   - Studio: Collaborative Workshop command center, active pairing session cards, team member presence (Online/Pairing).
6. `DiscussionsPage.tsx` (uses `src/data/discussions.json`):
   - Classic: Category filter pills (Q&A, Ideas, Announcements), discussion list with answer badges and author badges.
   - Studio: Community voice layout, upvoting counters with toggle action, highlighted top discussion cards.
7. `ProjectsPage.tsx` (uses `src/data/projects.json`):
   - Classic: Tabular / list view with status columns and completion progress bar.
   - Studio: Interactive 4-column Kanban board (Todo, In Progress, In Review, Done) with rich task cards.
8. `PackagesPage.tsx` (uses `src/data/packages.json`):
   - Classic: Package registry list with ecosystem filters (npm, Docker, Maven, PyPI), version tags, download counts.
   - Studio: Visual package deck, quick copy-to-clipboard install command buttons with toast feedback.
9. `PullsPage.tsx` (uses `src/data/pulls.json`):
   - Classic: Pull request queue with open/closed filters, review state badges, CI status indicators, link to `/react/react/pull/28271`.
   - Studio: Flow review stream, Copilot PR summaries, interactive review status pills.
10. `RepositoriesPage.tsx` (uses `src/data/repositories.json`):
    - Classic: Repository list with language tags, stars, forks, search input.
    - Studio: Living portfolio cards with high-contrast borders and direct links to `/react/react`.

### Dual-Lens Pattern Architecture
Each component MUST branch on `useAppStore().lens`:
```tsx
import { useAppStore } from '../store';

export default function IssuesPage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicIssues /> : <StudioIssues />;
}
```
- Classic styling: `font-classic bg-canvas text-paper`, `#0D1117` dark background, `#161B22` containers, subtle borders `#30363D`.
- Studio styling: `font-people bg-paper-warm text-ink`, neo-brutalist borders `border-2 border-ink`, hard shadows `shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]`, uppercase headers `font-display font-black uppercase`.

### 2. Static Routing in `src/App.tsx`
Update `src/App.tsx` to import the 10 new pages and mount static routes **BEFORE** `<Route path="/:user" element={<ProfilePage />} />`:
```tsx
<Route path="/pulls" element={<PullsPage />} />
<Route path="/issues" element={<IssuesPage />} />
<Route path="/codespaces" element={<CodespacesPage />} />
<Route path="/marketplace" element={<MarketplacePage />} />
<Route path="/explore" element={<ExplorePage />} />
<Route path="/workspace" element={<WorkspacePage />} />
<Route path="/discussions" element={<DiscussionsPage />} />
<Route path="/projects" element={<ProjectsPage />} />
<Route path="/packages" element={<PackagesPage />} />
<Route path="/repositories" element={<RepositoriesPage />} />
```
Verify that `PlaceholderPage` is ONLY used at `path="*"`.

### 3. Verification
Run:
- `node tests/run-e2e-tests.js --tier=1`
- `node tests/run-e2e-tests.js --tier=2`
- `node tests/run-e2e-tests.js --tier=4 --skip-build`
- `npm run build` (`tsc && vite build`)

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work.

## Output
Write your handoff report to:
`/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_worker_m2/handoff.md`
Report compilation results and created files.

## 2026-09-29T04:58:00Z
You are Worker M2 (Navbar Pages & Routing).
Your working directory is: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_worker_m2
Your task assignment is in: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_worker_m2/DISPATCH.md
Read the original user request at: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/ORIGINAL_REQUEST.md
Read PROJECT.md at: /Users/ritesh/Documents/Cyfernode_alt/PROJECT.md
Read TEST_READY.md at: /Users/ritesh/Documents/Cyfernode_alt/TEST_READY.md
Read Explorer 1's report at: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_explorer_survey_1/handoff.md
Read Explorer 2's report at: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_explorer_survey_2/handoff.md

Your exclusive write ownership:
- src/pages/IssuesPage.tsx
- src/pages/CodespacesPage.tsx
- src/pages/MarketplacePage.tsx
- src/pages/ExplorePage.tsx
- src/pages/WorkspacePage.tsx
- src/pages/DiscussionsPage.tsx
- src/pages/ProjectsPage.tsx
- src/pages/PackagesPage.tsx
- src/pages/PullsPage.tsx
- src/pages/RepositoriesPage.tsx
- src/App.tsx
