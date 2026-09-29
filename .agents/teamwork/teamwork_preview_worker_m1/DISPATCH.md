# Task Assignment: Worker M1 (Rich Mock Data & Store)

## Mission
Implement Milestone 1: Rich Mock Data & Store enhancements.
Create all 10 mock JSON fixtures in `src/data/` and enhance `src/store.ts` with required application state.

## Exclusive Write Ownership
You exclusively own:
- `src/data/issues.json`
- `src/data/codespaces.json`
- `src/data/marketplace.json`
- `src/data/explore.json`
- `src/data/workspace.json`
- `src/data/discussions.json`
- `src/data/projects.json`
- `src/data/packages.json`
- `src/data/pulls.json`
- `src/data/repositories.json`
- `src/store.ts`
Do NOT edit any other files.

## References & Requirements
- Read `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/ORIGINAL_REQUEST.md`
- Read `/Users/ritesh/Documents/Cyfernode_alt/PROJECT.md`
- Read Explorer 2's detailed schema specifications at `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_explorer_survey_2/handoff.md`

## Specifications
1. **Mock Data Fixtures (`src/data/`)**:
   Populate each JSON file with realistic, rich, believable GitHub data (mirroring real repositories, users, issues, PRs, extensions, and projects):
   - `issues.json`: Issue stats, array of issues with labels, author, assignee, commentsCount, category, Copilot aiSummary, reactions.
   - `codespaces.json`: Active codespaces with machine specs, states, last used, plus starter templates (React 19, Next 15, Rust WASM).
   - `marketplace.json`: Categories, featured items, and catalog items with publisher, rating, installs, pricing, badges.
   - `explore.json`: Trending repos (shadcn/ui, facebook/react, astral-sh/uv, tailwindlabs/tailwindcss), velocity metrics, collections.
   - `workspace.json`: Collaborative workspace with live sessions, pinned projects, activity feed, team members.
   - `discussions.json`: Community discussions across categories (Q&A, Ideas, RFCs, Announcements), upvote counts, answer badges.
   - `projects.json`: Kanban board with columns (Todo, In Progress, In Review, Done) containing detailed task cards with assignees, labels, and deadlines.
   - `packages.json`: Published packages (npm, Docker, Maven, PyPI) with version numbers, download statistics, and install commands.
   - `pulls.json`: Open & closed pull requests with review status, CI indicators, branch references.
   - `repositories.json`: Repository list with language tags, stars, forks, updated timestamps, visibility tags (public/private).

2. **Zustand Store (`src/store.ts`)**:
   Extend `src/store.ts` while preserving existing `lens`, `onboarded`, and `toasts`:
   - Add `notificationsCount: number` (initial: 3) and `clearNotifications: () => void`.
   - Add `starredRepos: Record<string, boolean>` and `toggleStarRepo: (repoKey: string) => void`.
   - Add `activeModal: string | null` and `setActiveModal: (modal: string | null) => void`.
   - Ensure all existing functionality (`setLens`, `toggleLens`, `setOnboarded`, `addToast`, `removeToast`) remains fully backwards-compatible.

3. **Verification**:
   Run `npm run build` (`tsc && vite build`) to confirm zero compilation or type errors.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Output
Write your handoff report to:
`/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_worker_m1/handoff.md`
Report compilation results and created files.

## 2026-09-29T04:52:08Z
You are Worker M1 (Mock Data & Store).
Your working directory is: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_worker_m1
Your task assignment is in: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_worker_m1/DISPATCH.md
Read the original user request at: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/ORIGINAL_REQUEST.md
Read PROJECT.md at: /Users/ritesh/Documents/Cyfernode_alt/PROJECT.md
Read Explorer 2's schema specs at: /Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_explorer_survey_2/handoff.md

Your exclusive write ownership:
- src/data/issues.json
- src/data/codespaces.json
- src/data/marketplace.json
- src/data/explore.json
- src/data/workspace.json
- src/data/discussions.json
- src/data/projects.json
- src/data/packages.json
- src/data/pulls.json
- src/data/repositories.json
- src/store.ts

Implement all 10 mock data fixtures with rich, authentic content and update src/store.ts.
Verify by running npm run build (tsc && vite build).
MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work.

Write your handoff report to:
/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_worker_m1/handoff.md
Send a completion message to parent when finished.
