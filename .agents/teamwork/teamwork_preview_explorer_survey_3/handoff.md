# Handoff Report: Interactive Elements & Button Audit

- **Date**: 2026-09-29T04:58:00Z
- **Author**: Survey Explorer 3 (Interactive Elements & Button Audit)
- **Target Audience**: Orchestrator, Planner, and Implementer Agents
- **Subject Codebase**: `/Users/ritesh/Documents/Cyfernode_alt`

---

## 1. Observation

### 1.1 Complete Audit of Toast Messages (`addToast`)
Across the active application, `addToast` is defined in `src/store.ts` (lines 19, 41-47) and rendered by `ToastRenderer` in `src/App.tsx` (lines 31-50). A total of 14 invocations were identified across 5 files:

| # | File Path & Line | Component Context | Code Snippet | Classification | Current Limitation |
|---|---|---|---|---|---|
| 1 | `src/components/Shell.tsx:78` | ClassicHeader (Notifications Dropdown) | `onClick={() => addToast('Marked all as read', 'success')}` | Generic Toast | No notification state is modified; unread indicator remains unaffected. |
| 2 | `src/components/Shell.tsx:89` | ClassicHeader ("+" Menu) | `onClick={() => { addToast('Creating new repository...'); setOpenMenu(null); }}` | Placeholder Toast | Closes dropdown and fires toast; no repo creation modal or workflow initiated. |
| 3 | `src/components/Shell.tsx:90` | ClassicHeader ("+" Menu) | `onClick={() => { addToast('Importing...'); setOpenMenu(null); }}` | Placeholder Toast | Closes dropdown and fires toast; no repository import modal or workflow initiated. |
| 4 | `src/components/Shell.tsx:91` | ClassicHeader ("+" Menu) | `onClick={() => { addToast('New codespace starting...'); setOpenMenu(null); }}` | Placeholder Toast | Closes dropdown and fires toast; no codespace configuration or launch flow initiated. |
| 5 | `src/components/Shell.tsx:161` | StudioHeader (Notifications Dropdown) | `onClick={() => addToast('Cleared notifications', 'success')}` | Generic Toast | Purely cosmetic feedback; no notification items or counters are mutated in store. |
| 6 | `src/components/Shell.tsx:176` | StudioHeader (User Menu) | `onClick={() => { addToast('Logging out...'); setOpenMenu(null); }}` | Placeholder Toast | Fires toast; no session cleanup or authentication state toggling occurs. |
| 7 | `src/pages/PRPage.tsx:83` | ClassicPR (Sidebar Labels) | `onClick={() => addToast('Filtering by label: Refactor')}` | Placeholder Toast | Shows static text toast without applying any label filter to the PR or conversation. |
| 8 | `src/pages/PRPage.tsx:185` | StudioPR (Checks Grid) | `onClick={() => addToast(`Check ${i+1} passed`, 'success')}` | Repetitive Toast | 12 identical check squares; clicking only yields a toast rather than test/job logs. |
| 9 | `src/pages/PRFilesPage.tsx:128` | StudioPRFiles (Change Map) | `onClick={() => addToast(`Scrolled to ${file.path.split('/').pop()}`, 'info')}` | Fake Action Toast | Claims to have scrolled to the file, but does not perform any DOM scrolling (`scrollIntoView`). |
| 10 | `src/pages/ProfilePage.tsx:56` | ClassicProfile (Pinned Repos) | `onClick={() => addToast('Starred repository!', 'success')}` | Placeholder Toast | Fires toast; star count does not increment and star icon does not toggle active state. |
| 11 | `src/pages/ProfilePage.tsx:75` | ClassicProfile (Contribution Grid) | `onClick={() => addToast(`${contribs} contributions on this day`)}` | Repetitive Toast | 350 individual day cells trigger identical toasts; no day drawer or commit details rendered. |
| 12 | `src/pages/ProfilePage.tsx:93` | StudioProfile (Share Modal) | `addToast('Markdown badge copied to clipboard!', 'success');` | Functional Toast | Legitimate clipboard write (`navigator.clipboard.writeText(...)`) followed by confirmation toast. |
| 13 | `src/pages/ProfilePage.tsx:98, 100` | StudioProfile (Share Modal) | `addToast('Generating high-res PNG...', 'info');` ... `addToast('Download complete.', 'success');` | Simulated Action Toast | Simulates an asynchronous file generation process with sequential status toasts. |
| 14 | `src/pages/ProfilePage.tsx:163` | StudioProfile (Public Build Canvas) | `onClick={() => addToast(`${contribs} contributions on this day`)}` | Repetitive Toast | 350 grid cells trigger repetitive toasts without opening day details or drawer. |

---

### 1.2 Audit of Alerts, Inert Elements, and Missing Handlers
1. **Generic Browser `alert()`**:
   - `src/components/PresenterControls.tsx:61-65`:
     ```tsx
     <button onClick={() => {
         alert("Graduation triggered (pretend you reviewed 20 PRs)");
     }} className="text-gray-500 hover:text-gray-300 w-full text-left px-2 py-1">
       Trigger Graduation Nudge
     </button>
     ```
     *Issue*: Uses native browser `window.alert()`, which is jarring, unstyled, and breaks the immersive application demo.

2. **Inert Button (Missing `onClick` completely)**:
   - `src/pages/BlobPage.tsx:79-81`:
     ```tsx
     <button className="bg-ink text-white px-4 py-1 text-xs font-bold uppercase tracking-wide border-2 border-transparent hover:bg-gray-800">
       Edit File
     </button>
     ```
     *Issue*: Rendered in Studio Blob view with zero click handler attached. Clicking it has zero effect.

3. **Inert Go-To-Market Steps**:
   - `src/pages/BrandPage.tsx:103-118`:
     Cards "01 Protect the Core", "02 Product Truth Over Hype", "03 Open Source Advocates" are static `div` containers without `onClick`. `src/data/interactive-elements.md` explicitly specifies: *"Go-to-market Stepper -> Click steps to change active state."*

4. **Coarse Click Target on Audience Rings**:
   - `src/pages/BrandPage.tsx:39`:
     The entire outer and inner ring wrapper has `onClick={() => setLens('classic')}`. In `src/data/interactive-elements.md`, the spec notes: *"Audience Two Rings -> Click inner/outer ring switches adjacent preview lens."* Inner should switch to Classic, while Outer should switch to Studio.

5. **Missing Navigation Elements**:
   - **PR Page Tab Navigation**: `src/pages/PRPage.tsx` lacks tab navigation (Conversation, Commits, Checks, Files Changed). There is no UI link to navigate from `PRPage` to `PRFilesPage` (`/react/react/pull/28271/changes`).
   - **Brand Page Anchor Navigation**: `src/pages/BrandPage.tsx` defines section anchors (`#why`, `#audience`, `#colors`, `#typography`, `#gtm`), but no top/side anchor navigation bar is rendered.
   - **Classic Repo Header Actions**: `src/pages/RepoPage.tsx` displays Stars and Forks as static text without Star, Watch, or Fork buttons.

---

### 1.3 Catalog of All Buttons & Interactive Elements Across Pages

| Component / Page | Element | Location / Lines | Type | Current Status | Current Behavior |
|---|---|---|---|---|---|
| **Shell** (`ClassicHeader`) | LensSwitcher (Classic/Studio) | lines 11-22 | `<button>` | **Functional** | Updates Zustand `lens` ('classic' \| 'studio'). |
| **Shell** (`ClassicHeader`) | Search Bar | lines 52-60 | `<input>` + dropdown | **Partial** | Toggles dropdown with recent searches (`react/react`, `shadcn`). No text search execution. |
| **Shell** (`ClassicHeader`) | Core Nav Links | lines 64-68 | `<Link>` | **Placeholder** | Links `/pulls`, `/issues`, `/codespaces`, `/marketplace`, `/explore` hit `PlaceholderPage`. |
| **Shell** (`ClassicHeader`) | Bell Dropdown Trigger | line 74 | `<Bell>` icon | **Functional** | Toggles notification dropdown. |
| **Shell** (`ClassicHeader`) | "Mark as read" | line 78 | `<span>` | **Placeholder** | Fires toast; notification count/state unchanged. |
| **Shell** (`ClassicHeader`) | "+" Dropdown Trigger | line 84 | `<div>` | **Functional** | Toggles "+" dropdown. |
| **Shell** (`ClassicHeader`) | "+" New Repository | line 89 | `<div>` | **Placeholder** | Fires toast; no modal/form opened. |
| **Shell** (`ClassicHeader`) | "+" Import Repository | line 90 | `<div>` | **Placeholder** | Fires toast; no modal/form opened. |
| **Shell** (`ClassicHeader`) | "+" New Codespace | line 91 | `<div>` | **Placeholder** | Fires toast; no codespace opened. |
| **Shell** (`ClassicHeader`) | User Dropdown Trigger | line 95 | `<User>` icon | **Functional** | Toggles user menu. |
| **Shell** (`ClassicHeader`) | User "Your profile" | line 102 | `<Link>` | **Functional** | Navigates to `/shadcn`. |
| **Shell** (`ClassicHeader`) | User "Your repositories" | line 103 | `<Link>` | **Placeholder** | Navigates to `/repositories` (hits `PlaceholderPage`). |
| **Shell** (`StudioHeader`) | Logo + Brand | line 120 | `<Link>` | **Functional** | Navigates to `/`. |
| **Shell** (`StudioHeader`) | "v2.0" Badge | line 124 | `<Link>` | **Functional** | Navigates to `/launch`. |
| **Shell** (`StudioHeader`) | Studio Nav Links | lines 128-130 | `<Link>` | **Placeholder** | `/workspace`, `/discussions`, `/explore` hit `PlaceholderPage`. |
| **Shell** (`StudioHeader`) | Studio Search Modal Trigger | line 137 | `<Search>` icon | **Functional** | Opens Studio command-style search overlay. |
| **Shell** (`StudioHeader`) | Search Modal Close ('X') | line 145 | `<X>` icon | **Functional** | Closes search overlay. |
| **Shell** (`StudioHeader`) | Search Modal Input | line 144 | `<input>` | **Placeholder** | No search filtering or keypress handler. |
| **Shell** (`StudioHeader`) | Search Modal Recent Links | lines 149-150 | `<Link>` | **Functional** | Navigates to `/react/react` and `/shadcn`. |
| **Shell** (`StudioHeader`) | Bell Dropdown Trigger | line 157 | `<Bell>` icon | **Functional** | Toggles Studio notification dropdown. |
| **Shell** (`StudioHeader`) | "Clear" Notifications | line 161 | `<span>` | **Placeholder** | Fires toast; notifications state unchanged. |
| **Shell** (`StudioHeader`) | User Dropdown Trigger | line 168 | `<User>` icon | **Functional** | Toggles Studio user menu. |
| **Shell** (`StudioHeader`) | User "Sign Out" | line 176 | `<div>` | **Placeholder** | Fires toast; does not sign out or clear state. |
| **RepoPage** (`ClassicRepo`) | Repo Tab "Code" | line 19 | `<div>` | **Inert** | Static div (non-clickable). |
| **RepoPage** (`ClassicRepo`) | Repo Tab "Issues" | line 20 | `<Link>` | **Placeholder** | Navigates to `/react/react/issues` (hits `PlaceholderPage`). |
| **RepoPage** (`ClassicRepo`) | Repo Tab "Pull requests" | line 21 | `<Link>` | **Functional** | Navigates to `/react/react/pull/28271`. |
| **RepoPage** (`ClassicRepo`) | Repo Tab "Actions" | line 22 | `<Link>` | **Placeholder** | Navigates to `/react/react/actions` (hits `PlaceholderPage`). |
| **RepoPage** (`ClassicRepo`) | File Tree Links (6 items) | lines 36-43 | `<Link>` | **Functional** | Navigates to `/react/react/blob/{file.name}`. |
| **RepoPage** (`StudioRepo`) | "Suggest a change" Button | lines 97-99 | `<Link>` | **Functional** | Navigates to `/react/react/suggest`. |
| **RepoPage** (`StudioRepo`) | Momentum Cards (4 items) | lines 106-121 | `<div>` | **Inert** | Metric displays (non-clickable). |
| **RepoPage** (`StudioRepo`) | Workflow Fabric Nodes | lines 131-143 | `<Link>` | **Partial** | Review node (`/react/react/pull/28271`) is functional; Discussions, Codespaces, Actions, Ship nodes point to placeholder routes. |
| **RepoPage** (`StudioRepo`) | "Explain this repo" Button | lines 152-158 | `<button>` | **Functional** | Toggles `showAi` state, revealing Copilot summary box. |
| **RepoPage** (`StudioRepo`) | File Tree Links (6 items) | lines 171-177 | `<Link>` | **Functional** | Navigates to `/react/react/blob/{file.name}`. |
| **RepoPage** (`StudioRepo`) | Active Builders (4 users) | lines 187-196 | `<div>` | **Inert** | Static user cards without links to profiles. |
| **PRPage** (`ClassicPR`) | Merge pull request Button | lines 68-70 | `<button>` | **Functional** | Sets `merged = true`, updates PR state badge & checks status. |
| **PRPage** (`ClassicPR`) | "Refactor" Label Tag | line 83 | `<div>` | **Placeholder** | Fires toast `Filtering by label: Refactor`. |
| **PRPage** (`StudioPR`) | Checks Grid (12 cells) | lines 184-186 | `<div>` | **Placeholder** | Each cell fires `addToast('Check ${i+1} passed', 'success')`. |
| **PRPage** (`StudioPR`) | Merge Pull Request Button | lines 190-196 | `<button>` | **Functional** | Sets `merged = true`, advances stepper to Merged. |
| **PRFilesPage** (`ClassicPRFiles`) | Unified / Split Diff Buttons | lines 16-27 | `<button>` | **Functional** | Toggles `diffView` ('unified' \| 'split'). |
| **PRFilesPage** (`StudioPRFiles`) | "Back to Visual Explanation" | line 101 | `<button>` | **Functional** | Sets `view = 'intent'`. |
| **PRFilesPage** (`StudioPRFiles`) | "View Raw Diff" | line 114 | `<button>` | **Functional** | Sets `view = 'raw'`. |
| **PRFilesPage** (`StudioPRFiles`) | Change Map Bar Segments | lines 126-140 | `<div>` | **Placeholder** | Fires toast; does not scroll to file card. |
| **ProfilePage** (`ClassicProfile`) | Profile Subnav Tabs (4 tabs) | lines 33-36 | `<Link>` | **Placeholder** | Modifies query param `?tab=...`, but content never changes. |
| **ProfilePage** (`ClassicProfile`) | Pinned Repo Star Button | lines 56-59 | `<div>` | **Placeholder** | Fires toast; star count does not increment. |
| **ProfilePage** (`ClassicProfile`) | Contribution Day Cells (350) | line 75 | `<div>` | **Placeholder** | Fires toast with day's contribution count. |
| **ProfilePage** (`StudioProfile`) | "Share my build" Button | lines 143-148 | `<button>` | **Functional** | Sets `showShare = true`, opening Share Modal. |
| **ProfilePage** (`StudioProfile`) | Share Modal "Copy Markdown Badge" | line 123 | `<button>` | **Functional** | Copies badge markdown to clipboard, shows confirmation toast, closes modal. |
| **ProfilePage** (`StudioProfile`) | Share Modal "Download PNG" | line 126 | `<button>` | **Functional** | Fires generation toast, then download success toast after 1.5s delay. |
| **ProfilePage** (`StudioProfile`) | Public Build Canvas Day Cells | line 163 | `<div>` | **Placeholder** | Fires toast with day's contribution count. |
| **ProfilePage** (`StudioProfile`) | Living Portfolio Repo Cards | lines 180-195 | `<Link>` | **Functional** | Navigates to `/shadcn/{repo.repoName}`. |
| **BlobPage** (`Classic`) | Back to Repo Link | line 33 | `<Link>` | **Functional** | Navigates to `/{owner}/{repo}`. |
| **BlobPage** (`Studio`) | "Edit File" Button | lines 79-81 | `<button>` | **Inert** | No `onClick` handler; dead button. |
| **SuggestPage** (`ClassicSuggest`) | Message Form Submit Button | lines 58-60 | `<button>` | **Functional** | Appends user message and simulates Copilot response. |
| **SuggestPage** (`ClassicSuggest`) | "Back to {repo}" Link | line 33 | `<Link>` | **Functional** | Navigates back to repo. |
| **SuggestPage** (`StudioSuggest`) | Message Form Submit Button | lines 127-129 | `<button>` | **Functional** | Appends user message and simulates Copilot response. |
| **SuggestPage** (`StudioSuggest`) | "Cancel" Button | line 96 | `<Link>` | **Functional** | Navigates back to repo. |
| **LaunchPage** | Checklist Items (5 items) | lines 68-74 | `<div>` | **Functional** | Toggles item completion state and visual strikethrough. |
| **LaunchPage** | Before/After Logo Slider | lines 90-114 | `<div>` | **Functional** | Interactive mouse drag reveals before/after logo SVG diff. |
| **LaunchPage** | Merge Pull Request Button | lines 135-140 | `<button>` | **Functional** | Sets `merged = true`, triggers full-screen release celebration. |
| **BrandPage** | Audience Two Rings | line 39 | `<div>` | **Partial** | Whole container clicks to `setLens('classic')`. |
| **BrandPage** | Go-To-Market Cards (3) | lines 103-118 | `<div>` | **Inert** | Static divs without interactive selection. |
| **PresenterControls** | Tour Step Buttons (8) | lines 50-58 | `<button>` | **Functional** | Navigates to each demo milestone. |
| **PresenterControls** | Auto-play Tour Button | lines 45-47 | `<button>` | **Functional** | Loops through tour steps with 4s intervals. |
| **PresenterControls** | "Trigger Graduation Nudge" | lines 61-65 | `<button>` | **Placeholder** | Native `alert(...)` popup. |
| **OnboardingModal** | Classic Option | lines 38-48 | `<button>` | **Functional** | Sets lens to classic, stores onboarded, closes modal. |
| **OnboardingModal** | Studio Option | lines 49-59 | `<button>` | **Functional** | Sets lens to studio, stores onboarded, closes modal. |

---

### 1.4 Catalog of Existing Modals, Dropdowns & Popovers
The codebase contains the following modular UI overlay implementations that can be reused:

1. **`Dropdown` (`src/components/Shell.tsx:27-37`)**:
   - Generic, customizable container with backdrop overlay (`fixed inset-0 z-40`).
   - Supports custom position, styles, and Studio neobrutalist drop-shadow (`shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]`).
   - Already used for Notifications, Plus Menu, and User Menu.
   - **Reuse Opportunities**: Watch/Notification dropdown on RepoPage, Branch selector (`main ▼`), PR Label filter popover, Repository sorting dropdown.

2. **Studio Search Modal (`src/components/Shell.tsx:140-153`)**:
   - Command palette architecture: Full-screen dimmed backdrop (`bg-black/50 backdrop-blur-sm`), centered dialog box, prominent header input with keyboard autofocus, and recent items list.
   - **Reuse Opportunities**: Global Command Palette (`Cmd+K`), "New Repository" modal dialog, "Create Codespace" dialog, "Fork Repository" modal dialog.

3. **`OnboardingModal` (`src/components/OnboardingModal.tsx`)**:
   - Framer Motion modal overlay with smooth scale and opacity transitions.
   - Two-column choice architecture with rich iconography and dual-style visual cards.
   - **Reuse Opportunities**: Graduation Nudge celebration dialog, Lens switcher onboarding sheet.

4. **"Share my build" Modal (`src/pages/ProfilePage.tsx:107-132`)**:
   - High-fidelity preview modal with dark backdrop blur, inner asset card, action buttons with dual handlers (clipboard copy and download), and propagation-stopped backdrop dismiss.
   - **Reuse Opportunities**: CI Check Detail drawer/modal, Contribution Day Activity drawer, Propose File Changes dialog.

5. **`ToastRenderer` (`src/App.tsx:31-50`) & Zustand Toast Store (`src/store.ts`)**:
   - Fixed bottom-right toast queue with `AnimatePresence`, auto-dismiss timers (3000ms), and success/info color coding.
   - **Reuse Opportunities**: Dynamic feedback across all interactive actions (star toggling, branch switching, filtering, file saving).

6. **`PresenterControls` Panel (`src/components/PresenterControls.tsx`)**:
   - Hidden fixed drawer toggled with `Shift+P` featuring step navigation and automated tour execution.
   - **Reuse Opportunities**: Presenter demo runner for new navbar links (`/issues`, `/explore`, `/marketplace`).

---

### 1.5 Orphaned Store Discovery (`src/store/useAppStore.ts`)
Investigation revealed two Zustand stores in the repository:
1. `src/store.ts` (Active): Used by all components; manages `lens`, `onboarded`, and `toasts`.
2. `src/store/useAppStore.ts` (Orphaned / Unused): Contains unintegrated state definitions:
   - `peekMode: boolean; setPeekMode: (val: boolean) => void` (Matches `src/data/interactive-elements.md:5`: *"Peek Button (All pages) -> Opens split view with other lens"*)
   - `demoReviewsCount: number; incrementDemoReviews: () => void` (Matches `src/components/PresenterControls.tsx:62`: *"Graduation triggered (pretend you reviewed 20 PRs)"*)
   - `hasSeenClassicBanner: boolean; setHasSeenClassicBanner: (val: boolean) => void`

---

## 2. Logic Chain

1. **Premise 1**: Acceptance Criteria explicitly mandates: *"Codebase scan verifies that buttons no longer rely on identical, generic `addToast('Feature not available...')` or empty `alert()` handlers"*, and *"ensure every interactive element (buttons, toggles, actions) performs a distinct, observable behavior."*
2. **Observation Step 1**: Auditing the codebase located 14 `addToast` calls, 1 `alert()` call, 1 inert `<button>` without `onClick`, 4 static non-interactive cards/elements, and 3 missing core navigation components (PR tabs, Brand anchor nav, Repo action buttons).
3. **Observation Step 2**: All 14 `addToast` calls fall into three categories:
   - *Category A (Mock Action Confirmation)*: Calls that claim an action occurred without state backing (e.g. `Shell.tsx:78` "Marked all as read", `ProfilePage.tsx:56` "Starred repository!", `PRFilesPage.tsx:128` "Scrolled to ...").
   - *Category B (Modal/Workflow Preemption)*: Calls that stand in place of a modal or navigation flow (e.g. `Shell.tsx:89-91` "Creating new repository...", "Importing...", "New codespace starting...").
   - *Category C (Repetitive Item Toasts)*: Calls bound to dense grid items (e.g. 12 PR checks in `PRPage.tsx:185`, 350 contribution cells in `ProfilePage.tsx:75, 163`).
4. **Deduction**: Replacing these placeholders requires assigning a realistic, observable state-driven behavior to each element:
   - Modals for creation workflows (New Repo, New Codespace, Import Repo).
   - Real DOM manipulation for scroll actions (`scrollIntoView`).
   - Reactive Zustand/local state mutations with counters for Stars, Notifications, and Graduation.
   - Interactive popovers/drawers for dense items (PR checks, Contribution day details).
   - Real navigation or tab switching for PR sub-views and Profile sub-views.
5. **Observation Step 3**: The existing modal implementations (`Dropdown`, Search Overlay, `OnboardingModal`, Share Modal) provide battle-tested styling and animation primitives ready to be wired up for these behaviors.

---

## 3. Caveats & Constraints

1. **Read-Only Scope**: This report is purely analytical; no production source code has been altered during this survey.
2. **Dual Store Discrepancy**: `src/store/useAppStore.ts` exists alongside `src/store.ts`. All current imports reference `src/store.ts`. Any new global states (e.g. `notificationsCount`, `starredRepos`, `demoReviewsCount`, `peekMode`) should be added to `src/store.ts` (or the two store files should be unified).
3. **Route Dependencies**: Several interactive elements (such as navbar links `/issues`, `/codespaces`, `/marketplace`, `/explore` and repo links `/react/react/issues`) currently hit `PlaceholderPage`. Their interactive completeness depends on sibling survey work (Explorer 1 on Navbar Routing & Pages).
4. **Browser Clipboard Permissions**: `navigator.clipboard.writeText` requires user gesture activation in modern browsers; handlers must remain directly tied to user click events.

---

## 4. Conclusion & Actionable Recommendations

### 4.1 Specification of Proposed Distinct Behaviors

| Target Element | Current Placeholder | Proposed Distinct Observable Behavior | Implementation Mechanism |
|---|---|---|---|
| **Header "+" New repository** (`Shell.tsx:89`) | `addToast('Creating new repository...')` | Open **"Create Repository" Modal** with repo name input, public/private radio, and "Create" button that adds repo to state and navigates. | Reusable Search/Share modal pattern + local state. |
| **Header "+" Import repository** (`Shell.tsx:90`) | `addToast('Importing...')` | Open **"Import Repository" Modal** with clone URL field and simulated progress bar. | Modal dialog with simulated progress timer. |
| **Header "+" New codespace** (`Shell.tsx:91`) | `addToast('New codespace starting...')` | Open **"New Codespace" Configuration Sheet** with repo/branch selector and "Launch" action navigating to `/codespaces`. | Modal dialog + route transition. |
| **Header Notifications "Mark as read" / "Clear"** (`Shell.tsx:78, 161`) | `addToast('Marked all as read' / 'Cleared notifications')` | Decrement bell badge counter (e.g. `3` -> `0`), clear notification list items with exit animation, render "All caught up!" view. | Zustand `notificationsCount` state + bell badge. |
| **Header User "Sign Out"** (`Shell.tsx:176`) | `addToast('Logging out...')` | Toggle `signedIn: false`, swapping header avatar to "Sign In" button with toast containing "Undo" action. | Zustand `signedIn` boolean state. |
| **PR Label "Refactor"** (`PRPage.tsx:83`) | `addToast('Filtering by label: Refactor')` | Open **Label Filter Popover** displaying repo labels with active checkmarks, toggling filtered PR list. | `Dropdown` component with checkbox list. |
| **PR Checks Grid (12 cells)** (`PRPage.tsx:185`) | `addToast('Check ${i+1} passed')` | Clicking cell opens **CI Check Inspector Drawer / Modal** showing job name (`build-dom`, `test-ssr`), duration, and terminal log snippet. | Reusable Modal with tabbed job logs. |
| **PR Page Navigation Tabs** (`PRPage.tsx`) | Completely missing | Add top tab bar: `Conversation` (`/react/react/pull/28271`), `Commits` (1), `Checks` (12/12), and `Files changed` (`/react/react/pull/28271/changes`). | Standard GitHub tab bar with active route highlight. |
| **PR Files Change Map** (`PRFilesPage.tsx:128`) | `addToast('Scrolled to ...')` (fake scroll) | Assign `id={`file-${idx}`}` to diff cards; trigger `document.getElementById(...).scrollIntoView({ behavior: 'smooth' })` with card flash effect. | Native DOM `scrollIntoView` API + CSS keyframe pulse. |
| **Profile Pinned Repo Star Button** (`ProfilePage.tsx:56`) | `addToast('Starred repository!')` (static count) | Toggle star state: increment star count (`52.4k` -> `52.4k + 1`), turn star icon gold (`text-yellow-400 fill-yellow-400`), fire dynamic toast `"Starred {repo.repoName}"` / `"Unstarred {repo.repoName}"`. | Local `starredRepos: Record<string, boolean>` state. |
| **Profile Contribution Day Cells** (`ProfilePage.tsx:75, 163`) | `addToast('${contribs} contributions on this day')` | Open **Day Activity Detail Drawer / Popover** displaying date, contribution count, and list of 3 commits/PRs. | Popover / drawer overlay on hover or click. |
| **Profile Subnav Tabs** (`ProfilePage.tsx:33-36`) | Links change `?tab=...` without content change | Connect `tab` state to render distinct sub-views: `Overview` (current), `Repositories` (searchable list), `Projects` (kanban preview), `Packages` (npm registry cards). | `useSearchParams()` + conditional sub-view rendering. |
| **Studio Blob "Edit File" Button** (`BlobPage.tsx:79-81`) | Inert button (no `onClick`) | Clicking toggles an **interactive code editor** with monospaced `<textarea>`, "Cancel" and "Propose changes" buttons that save modifications. | Local `isEditing: boolean` state. |
| **Presenter "Trigger Graduation Nudge"** (`PresenterControls.tsx:61-65`) | Browser `alert(...)` | Open custom **Graduation Celebration Modal**: `"🎉 Milestone Reached: 20 PRs Reviewed! You've unlocked GitHub Studio."` with "Switch to Studio Lens" action button. | Reusable `OnboardingModal` style celebration card. |
| **Brand Page Audience Two Rings** (`BrandPage.tsx:39`) | Whole element sets classic lens | Separate click targets: Inner Ring ("The Spiritual Core") sets Classic lens; Outer Ring ("The Expanding Edge") sets Studio lens with animated pulse. | Separate `onClick` handlers on SVG/DOM ring layers. |
| **Brand Page Go-To-Market Stepper** (`BrandPage.tsx:103-118`) | Static non-interactive cards | Add `activeStep` (1, 2, 3) state. Clicking a card activates it, expands rollout milestone details, and updates preview graphics. | Local `activeStep: number` state + dynamic styling. |
| **Brand Page Color Swatches** (`BrandPage.tsx:66-77`) | Static divs | Add click handler: `navigator.clipboard.writeText(hex)` + toast `"Copied #2EA043 (Ship Green) to clipboard!"`. | Clipboard API + dynamic toast. |
| **Repo Page Classic Header Actions** (`RepoPage.tsx`) | Missing Star/Fork/Watch buttons | Add classic GitHub button group: `Star` (interactive toggle), `Fork` (opens Fork modal), `Watch` (opens notification dropdown). | Reusable button bar + modal. |

---

## 5. Verification Method

To independently verify the observations and validate future implementations:

1. **Verify No Generic Toasts Remain**:
   ```bash
   grep -rn "addToast('Feature not available" src/
   grep -rn "addToast('Creating new repository" src/
   grep -rn "addToast('Importing" src/
   grep -rn "addToast('New codespace" src/
   grep -rn "addToast('Logging out" src/
   grep -rn "addToast('Filtering by label" src/
   grep -rn "addToast('Check " src/
   grep -rn "addToast('Scrolled to" src/
   grep -rn "addToast('Starred repository" src/
   ```

2. **Verify No Browser `alert()` Remains**:
   ```bash
   grep -rn "alert(" src/
   ```
   *Expected outcome*: Zero matches.

3. **Verify No Empty or Inert Buttons**:
   ```bash
   grep -rn "onClick={() => {}}" src/
   grep -rn "<button className=" src/ | grep -v "onClick" | grep -v "type=\"submit\""
   ```
   *Expected outcome*: Zero matches.

4. **Verify TypeScript & Build Integrity**:
   ```bash
   npm run build
   ```
   *Expected outcome*: `tsc` succeeds without compiler errors and Vite builds the bundle cleanly.
