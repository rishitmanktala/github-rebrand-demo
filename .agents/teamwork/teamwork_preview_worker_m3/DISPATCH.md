# Task Assignment: Worker M3 (Button Interactivity Polish)

## Mission
Implement Milestone 3: Audit and polish all interactive elements across the application to ensure every interactive element performs a distinct, observable behavior. Eliminate all generic fallback toasts, fake scrolls, inert buttons, and browser alerts.

## Exclusive Write Ownership
You exclusively own:
- `src/components/Shell.tsx`
- `src/components/PresenterControls.tsx`
- `src/components/CreateRepoModal.tsx` (new)
- `src/components/CreateCodespaceModal.tsx` (new)
- `src/components/GraduationModal.tsx` (new)
- `src/pages/BlobPage.tsx`
- `src/pages/PRFilesPage.tsx`
- `src/pages/PRPage.tsx`
- `src/pages/ProfilePage.tsx`
- `src/pages/BrandPage.tsx`
- `src/pages/RepoPage.tsx`
Do NOT edit files in `src/data/`, `src/App.tsx`, or `tests/`.

## Context & References
- Read `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/ORIGINAL_REQUEST.md`
- Read `/Users/ritesh/Documents/Cyfernode_alt/PROJECT.md`
- Read `/Users/ritesh/Documents/Cyfernode_alt/TEST_READY.md`
- Read Explorer 3's comprehensive audit report at `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_explorer_survey_3/handoff.md`

## Specifications

### 1. Eliminate Browser `alert()` in `src/components/PresenterControls.tsx`
- Replace `alert("Graduation triggered (pretend you reviewed 20 PRs)")` at line 62.
- Connect to `useAppStore().setActiveModal('graduation')` or render `GraduationModal`.
- The modal celebrates unlocking Studio mode ("🎉 Milestone: 20 PRs Reviewed! You've unlocked GitHub Studio") with a button to switch to Studio mode.

### 2. Header Interactive Overlays in `src/components/Shell.tsx`
- Implement `CreateRepoModal`: Opens when clicking "+" -> "New repository". Form has repo name input, description, public/private radio, and "Create repository" button that adds a toast `"Repository {name} created!"` and resets.
- Implement `CreateCodespaceModal`: Opens when clicking "+" -> "New codespace" or "+ Import repository". Allows picking repo and machine type.
- Connect notifications bell in both Classic and Studio headers to `notificationsCount` in `src/store.ts`. Show notification badge when `notificationsCount > 0`. Clicking "Mark as read" or "Clear notifications" calls `clearNotifications()` from the store and displays "All caught up!".
- Ensure Sign Out clears demo session or shows confirmation toast with Undo.

### 3. Fix Inert "Edit File" Button in `src/pages/BlobPage.tsx`
- In `BlobPage.tsx:79-81`, add an `onClick` handler.
- Add an interactive editing mode (`isEditing: boolean`) with an editable textarea, a "Cancel" button, and a "Propose file changes" button that updates state with a success toast.

### 4. Real Smooth Scrolling in `src/pages/PRFilesPage.tsx`
- In `PRFilesPage.tsx:128`, replace fake toast with real DOM scrolling:
  Assign `id={`file-${idx}`}` to file diff cards and call `document.getElementById(...).scrollIntoView({ behavior: 'smooth' })`.

### 5. Star/Unstar, Contribution Cells, and Tabs in `src/pages/ProfilePage.tsx`
- Pinned repos star button: Connect to `toggleStarRepo(repo.repoName)` from `src/store.ts`. Increment star count when starred and turn star icon gold (`text-yellow-400 fill-yellow-400`).
- Contribution cells: Clicking opens a small popover or detail modal with day details.
- Subnav tabs: Connect `?tab=` or tab state to switch between Overview, Repositories, Projects, and Packages.

### 6. Interactive PR Checks & PR Tabs in `src/pages/PRPage.tsx`
- Add top tab bar: Conversation (`/react/react/pull/28271`), Commits, Checks, Files changed (`/react/react/pull/28271/changes`).
- Clicking check squares in Studio checks grid: Open a CI Check inspector dialog showing job details (`build-dom`, `test-ssr`), duration, and log snippet.

### 7. Interactivity Polish in `src/pages/BrandPage.tsx`
- Color swatches: Clicking copies hex code to clipboard (`navigator.clipboard.writeText`) with a confirmation toast.
- Audience Two Rings: Inner ring switches to Classic lens; outer ring switches to Studio lens.
- GTM Stepper: Cards are interactive (`activeStep`), clicking updates active step.

### 8. Verification
Run:
- `node tests/run-e2e-tests.js --tier=3`
- `node tests/run-e2e-tests.js` (full suite: all 58 tests must pass!)
- `npm run build` (`tsc && vite build`)

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work.

## Output
Write your handoff report to:
`/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_worker_m3/handoff.md`
Report compilation results, files modified, and test results.
