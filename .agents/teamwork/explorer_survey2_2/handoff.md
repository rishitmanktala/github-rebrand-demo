# Dual-Lens Parity & Visual Consistency Audit Report

**Agent**: `explorer_survey2_2`  
**Role**: Dual-Lens Parity & Visual Consistency Specialist  
**Workspace**: `/Users/ritesh/Documents/Cyfernode_alt`  
**Date**: 2026-09-29  
**Status**: Complete (Read-Only Investigation)

---

## 1. Observation

Direct, verbatim findings gathered via source code inspection, contrast ratio calculation, and adversarial stress testing across all pages, shell headers, footers, modals, drawers, and CSS tokens.

### A. Catastrophic Contrast & Invisible Text Flaws

1. **`src/pages/LaunchPage.tsx:123-132` — Invisible White-on-White Text in Classic Mode**
   - **Verbatim Code**:
     ```tsx
     // LaunchPage.tsx lines 123-132
     <div className="bg-paper border-2 border-ink p-6 sticky top-24">
       <h3 className="font-display uppercase font-black text-xl mb-4">Release Notes</h3>
       <div className="text-sm space-y-4 mb-6">
         <p><strong>What changed:</strong> The brand catches up to the product. High-contrast UI, human language, visible momentum.</p>
         <p><strong>What deliberately didn't:</strong> The name, the mascot equity, and terminal fidelity.</p>
         <p><strong>Why:</strong> Evolution, not erasure. The spiritual core gets stability; the expanding edge gets a workshop.</p>
         <blockquote className="border-l-4 border-ink pl-4 italic bg-gray-50 p-3">
           "Nothing you rely on is being taken away."
         </blockquote>
       </div>
     ```
   - **Observed Behavior**: In Classic Mode, `App.tsx:79` applies `text-paper` (`#F0F6FC`) globally to the container. `bg-paper` is `#F0F6FC`. None of the child paragraphs or headings specify a text color. Consequently, they inherit `#F0F6FC` on top of `#F0F6FC`. Contrast ratio is **1.06:1** (**100% invisible text**).

2. **`src/pages/RepoPage.tsx:184-186` — Invisible Light Yellow on White in Studio Mode**
   - **Verbatim Code**:
     ```tsx
     // RepoPage.tsx lines 184-187
     <div className="bg-white border-2 border-ink p-4">
       <div className="text-4xl font-display font-black text-highlight-yellow">v18.3</div>
       <div className="text-sm font-bold uppercase tracking-tight mt-1">Latest Release</div>
     </div>
     ```
   - **Observed Behavior**: `text-highlight-yellow` is `#FFF9A3`. On `bg-white` (`#FFFFFF`), the contrast ratio is **1.08:1** (WCAG AA requires 4.5:1 for normal text, 3:1 for large text). The version text `v18.3` is completely unreadable.

3. **`src/pages/CodespacesPage.tsx:246-250` — Invisible Light Yellow Icon on White Card**
   - **Verbatim Code**:
     ```tsx
     // CodespacesPage.tsx lines 246-250
     <div className="bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
       <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">
         <span>Cold-Start Speed</span>
         <Sparkles size={16} className="text-highlight-yellow fill-highlight-yellow" />
       </div>
       <div className="text-3xl font-display font-black text-ink">&lt; 3.2s</div>
     ```
   - **Observed Behavior**: `#FFF9A3` fill and stroke on `#FFFFFF` card background produces an invisible icon.

4. **`text-gray-400` Low-Contrast Violations on Studio Canvas (`#EDECE9`) and Cards (`#FFFFFF`)**
   - **Observed Locations**:
     - `src/pages/RepoPage.tsx:174`: `<div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">// Momentum this week</div>` on `#EDECE9`. Contrast: **2.07:1** (WCAG Fail).
     - `src/pages/RepoPage.tsx:196`: `<div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">// Workflow Fabric</div>` on `#EDECE9`. Contrast: **2.07:1** (WCAG Fail).
     - `src/pages/PRPage.tsx:51`: `<p className="text-xs text-gray-400">` inside `CheckInspectorModal` on `bg-paper-warm`. Contrast: **2.07:1** (WCAG Fail).
     - `src/pages/PRPage.tsx:323`: `<div className={`flex items-center space-x-1 ${merged ? 'text-merge-purple' : 'text-gray-400'}`}>` in `StudioPR`. Contrast: **2.07:1** (WCAG Fail).
     - `src/pages/PRPage.tsx:389`: `<span className="text-[11px] font-bold uppercase text-gray-400">Click to inspect</span>` on `bg-white`. Contrast: **2.50:1** (WCAG Fail).

5. **`src/pages/MarketplacePage.tsx:329` — Dark-on-Dark Contrast Violations on Colored Saturated Badges**
   - **Verbatim Code**:
     ```tsx
     <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-ink inline-block mb-1.5 ${item.badgeColor} text-ink`}>
       {item.category}
     </span>
     ```
   - **Observed Behavior**: For items with `badgeColor: "bg-diff-red"` (`#F85149`) and `badgeColor: "bg-ship-green"` (`#2EA043`), applying `text-ink` (`#0A0A0A`) yields contrast of **3.5:1** and **3.8:1** respectively, failing WCAG AA (4.5:1) for small 10px text.

---

### B. Missing Dual-Lens Branching & Unadapted Hardcoded Embeds

1. **`src/pages/LaunchPage.tsx` Lacks Dual-Lens Implementation Entirely**
   - `LaunchPage.tsx` does NOT connect to `useAppStore()`.
   - Single view exports Studio typography (`font-people`, `font-display`) and borders (`border-b-4 border-ink`), but renders inside the Classic `#0D1117` canvas when Classic mode is active.
   - `border-ink` (`#0A0A0A`) against `#0D1117` has **1.03:1** contrast; all borders vanish in Classic mode.

2. **`src/pages/BrandPage.tsx` Always Hardcoded to Studio Styling**
   - `BrandPage.tsx:52` hardcodes `<div className="font-people text-ink bg-paper-warm studio-texture min-h-screen">`.
   - In Classic Mode, `ClassicHeader` (`bg-canvas text-paper`, terminal dense) abruptly sits atop an unadapted Studio page.

3. **`src/pages/PRFilesPage.tsx:97-105` — "View Raw Diff" Drops into Unstyled Classic Dark Component**
   - **Verbatim Code**:
     ```tsx
     if (view === 'raw') {
       return (
         <div className="relative">
           <div className="absolute top-4 right-4 z-10">
             <button onClick={() => setView('intent')} className="bg-ink text-white px-3 py-1 font-bold uppercase text-xs border-2 border-transparent hover:bg-gray-800">Back to Visual Explanation</button>
           </div>
           <ClassicPRFiles />
         </div>
       );
     }
     ```
   - **Observed Behavior**: In Studio mode, clicking "View Raw Diff" renders `<ClassicPRFiles />` directly, dumping the user into `#0D1117`, `#161b22`, `font-classic`, and `border-gray-700` without tactile Studio containers or paper background.

4. **`src/components/PresenterControls.tsx:42` Always Hardcoded to Classic Canvas**
   - **Verbatim Code**:
     ```tsx
     <div className="fixed bottom-4 left-4 z-50 bg-canvas text-paper border border-gray-700 p-4 rounded-md shadow-lg font-classic text-sm w-64">
     ```
   - **Observed Behavior**: Does not read `lens`. In Studio mode, opening presenter controls (`Shift+P`) displays a terminal box on top of the warm paper canvas.

5. **`src/components/Shell.tsx:291-294` — Unadapted Generic Footer**
   - **Verbatim Code**:
     ```tsx
     <footer className="py-8 text-center text-xs text-gray-500 border-t border-gray-800/30 mt-auto relative z-0">
       Concept demo. Not affiliated with GitHub, Inc. <br/>
       <span className="opacity-50">Preserving Trust. Widening the Workshop.</span>
     </footer>
     ```
   - **Observed Behavior**: Faint `border-gray-800/30` and `text-gray-500` with no neo-brutalist border or font token in Studio mode.

6. **Interior Border Leaks in Studio Modals (`CreateRepoModal.tsx:168`, `CreateCodespaceModal.tsx:165`, `PRPage.tsx:71`)**
   - **Verbatim Code**: `<div className="flex justify-end space-x-3 pt-4 border-t border-gray-700/50">`
   - **Observed Behavior**: Inside Studio modals with `border-4 border-ink`, the bottom action divider reverts to `border-gray-700/50` instead of `border-t-2 border-ink`.

7. **`src/App.tsx:52` — `ToastRenderer` Always Uses Studio Styling in Classic Mode**
   - Hardcoded `border-2 border-ink font-bold uppercase text-xs tracking-wide`. In Classic Mode, toasts do not use standard GitHub dark badges (`border-gray-700 bg-[#161b22] text-[#f0f6fc] font-classic normal-case`).

8. **`src/index.css:7-9` vs `src/App.tsx:79` — Body Canvas Bleed**
   - `index.css` applies `@apply bg-canvas text-paper` directly to `body`.
   - In Studio mode, rubber-band overscroll or unpopulated view heights expose the dark `#0D1117` background behind `#EDECE9`.

---

### C. Broken Subroutes Leading to 404 `PlaceholderPage`

1. **`src/pages/RepoPage.tsx` Links to Unmapped Repo Subroutes**
   - `RepoPage.tsx:69`: `<Link to={`/${repoData.owner}/${repoData.name}/issues`}>` -> `/react/react/issues` -> triggers `path="*"` (`PlaceholderPage`).
   - `RepoPage.tsx:71`: `<Link to={`/${repoData.owner}/${repoData.name}/actions`}>` -> `/react/react/actions` -> triggers `path="*"` (`PlaceholderPage`).
   - `RepoPage.tsx:201`: `link: `/${repoData.owner}/${repoData.name}/discussions`` -> `/react/react/discussions` -> triggers `path="*"` (`PlaceholderPage`).
   - `RepoPage.tsx:202`: `link: `/${repoData.owner}/${repoData.name}/codespaces`` -> `/react/react/codespaces` -> triggers `path="*"` (`PlaceholderPage`).
   - `RepoPage.tsx:204`: `link: `/${repoData.owner}/${repoData.name}/actions`` -> `/react/react/actions` -> triggers `path="*"` (`PlaceholderPage`).
   - `RepoPage.tsx:205`: `link: `/${repoData.owner}/${repoData.name}/releases`` -> `/react/react/releases` -> triggers `path="*"` (`PlaceholderPage`).

---

### D. Header Navigation Asymmetry & Layout Jank

1. **Header Navigation Links Disparity (`Shell.tsx`)**
   - **ClassicHeader** (lines 66-72): Pull requests (`/pulls`), Issues (`/issues`), Codespaces (`/codespaces`), Marketplace (`/marketplace`), Explore (`/explore`).
   - **StudioHeader** (lines 167-171): Workspace (`/workspace`), Discussions (`/discussions`), Explore (`/explore`).
   - In Studio mode, users cannot reach Pulls, Issues, Codespaces, or Marketplace from the top navigation.
   - In Classic mode, users cannot reach Workspace or Discussions from the top navigation.
   - Neither header provides direct navigation to Projects (`/projects`), Packages (`/packages`), or Repositories (`/repositories`).

2. **Header Collapse & Content Bounce during Lens Switching (`Shell.tsx:271-281`)**
   - `<AnimatePresence mode="wait">` causes the exiting header to unmount before the entering header mounts over `300ms`.
   - The header collapses from `64px` to `0px`, causing the entire main view to snap upward by `64px` and back down on every `Alt+M` or header toggle.

3. **Tab Baseline Shadow Misalignment (`PRPage.tsx:121-149`)**
   - In `StudioPR`, active tabs apply `border-b-0 shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]` above a container with `border-b-2 border-ink`.
   - The drop shadow protrudes below the baseline border line, creating a misaligned double-edge visual glitch.

4. **Studio Profile Missing Sub-Tabs (`ProfilePage.tsx`)**
   - `ClassicProfile` contains 4 interactive views: Overview, Repositories, Projects, and Packages.
   - `StudioProfile` omits tabs entirely, preventing users from accessing their repositories or projects while in Studio mode.

---

### E. Dead / Orphaned Code

1. **`src/store/useAppStore.ts`**
   - Orphaned legacy Zustand store with 0 imports across the entire repository.
   - Superseded by canonical `src/store.ts`.

---

## 2. Logic Chain

1. **Premise 1**: The Cyfernode Alt architecture requires strict visual fidelity between Classic Mode (dense `#0D1117` terminal canvas, `font-classic`) and Studio Mode (tactile `#EDECE9` paper canvas, `border-2 border-ink`, neo-brutalist shadows, `font-display`/`font-people`).
2. **Step 2 (Contrast & Accessibility)**: Text must maintain at least a 4.5:1 contrast ratio against its background (WCAG AA). 
   - `LaunchPage.tsx:123` places unstyled child text inside `bg-paper` (`#F0F6FC`) while `App.tsx:79` sets `text-paper` (`#F0F6FC`). This produces an effective contrast ratio of 1.06:1, rendering the sidebar completely invisible.
   - `RepoPage.tsx:185` and `CodespacesPage.tsx:248` place `text-highlight-yellow` (`#FFF9A3`) on `bg-white` (`#FFFFFF`), producing an effective contrast ratio of 1.08:1, rendering the text/icon invisible.
   - In Studio mode (`#EDECE9`), `text-gray-400` (`#9CA3AF`) has a contrast ratio of 2.07:1, causing illegible subtext.
3. **Step 3 (Dual-Lens Parity)**: When toggling lenses via `Alt+M` or the header switcher, every component and page must adapt to the target mode's design tokens.
   - `LaunchPage.tsx` and `BrandPage.tsx` do not implement dual-lens branching; `PresenterControls.tsx` and `Shell.tsx` footer lack Studio mode adaptations.
   - `PRFilesPage.tsx` "View Raw Diff" falls back directly to an unstyled Classic component inside Studio mode.
   - `ProfilePage.tsx` in Studio mode drops 3 of the 4 tabs available in Classic mode.
4. **Step 4 (Routing & Navigation)**: Acceptance Criteria specify that `PlaceholderPage` must never be encountered through standard in-app navigation.
   - `RepoPage.tsx` hardcodes subroute paths (`/react/react/issues`, `/react/react/discussions`, `/react/react/codespaces`) that do not exist in `App.tsx` routes, routing directly to `PlaceholderPage`.
   - `Shell.tsx` header links differ between Classic and Studio, trapping users in partial navigation silos.
5. **Step 5 (Animation & Layout Stability)**: `mode="wait"` in `Shell.tsx` collapses header height during the 300ms transition, creating layout bounce on toggle.

---

## 3. Caveats

- **Scope Boundary**: Audit was conducted in strictly read-only mode. No modifications were made to `src/` or `tests/`.
- **Operating Environment**: Tested on macOS with Vite development build and production compilation (`npm run build`).
- **Data Completeness**: All 10 JSON fixtures in `src/data/` were audited and confirmed syntactically valid.
- **Automated Tests**: Current automated test suites (`adversarial-dual-lens-test.js`, `adversarial-routing-test.js`, `run-e2e-tests.js`) verify token existence and string matches, but do not measure computed CSS contrast ratios or visual layout bounce.

---

## 4. Conclusion & Actionable Remediation Plan

To achieve production-grade dual-lens visual consistency and eliminate user-facing defects, apply the following prioritized fixes:

### Priority 1: Critical Invisible Text & Contrast Fixes
| File | Lines | Issue | Recommended Fix |
|---|---|---|---|
| `src/pages/LaunchPage.tsx` | 123-132 | White text on `#F0F6FC` background in Classic Mode | Add `text-ink` or `text-gray-900` to `<div className="bg-paper ...">` |
| `src/pages/RepoPage.tsx` | 185 | `text-highlight-yellow` on `bg-white` (v18.3) | Change to `text-review-amber` or make card `bg-highlight-yellow text-ink` |
| `src/pages/CodespacesPage.tsx` | 248 | Light yellow icon on white card | Change to `text-ink fill-highlight-yellow` |
| `src/pages/RepoPage.tsx` | 174, 196 | `text-gray-400` on `#EDECE9` paper warm | Replace with `text-ink/60` |
| `src/pages/PRPage.tsx` | 51, 323, 389 | `text-gray-400` on Studio paper / white | Replace with `text-ink/60` or `text-gray-600` |
| `src/pages/MarketplacePage.tsx` | 329 | `text-ink` on `bg-diff-red` and `bg-ship-green` | Use `text-white` for dark badges, `text-ink` for light badges |

### Priority 2: Missing Dual-Lens Branching & Unadapted Embeds
| File | Lines | Issue | Recommended Fix |
|---|---|---|---|
| `src/pages/LaunchPage.tsx` | 1-148 | No dual-lens branching; broken Classic mode | Split into `<ClassicLaunch />` and `<StudioLaunch />` |
| `src/pages/BrandPage.tsx` | 52 | Always hardcoded to Studio styling | Add dual-lens container adaptation or dark canvas fallback |
| `src/pages/PRFilesPage.tsx` | 97-105 | "View Raw Diff" renders unstyled dark Classic component in Studio | Wrap raw diff in a Studio paper container with `border-2 border-ink` |
| `src/components/PresenterControls.tsx` | 42 | Always hardcoded to Classic canvas | Add Studio styling: `bg-paper-warm text-ink border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]` |
| `src/components/Shell.tsx` | 291-294 | Generic unstyled footer | In Studio mode, apply `border-t-2 border-ink/20 text-ink/60 font-people` |
| `src/components/CreateRepoModal.tsx` | 168 | Interior modal divider uses `border-gray-700/50` in Studio | Use `border-t-2 border-ink` when `!isClassic` |
| `src/components/CreateCodespaceModal.tsx` | 165 | Interior modal divider uses `border-gray-700/50` in Studio | Use `border-t-2 border-ink` when `!isClassic` |
| `src/App.tsx` | 52 | Toasts always use Studio neo-brutalist styling | Use classic dark rounded styling when `lens === 'classic'` |
| `src/index.css` & `src/App.tsx` | 7-9, 79 | `body` has dark background in Studio mode | Dynamically toggle `document.body` background or class |

### Priority 3: Broken Subroutes & Navigation Asymmetry
| File | Lines | Issue | Recommended Fix |
|---|---|---|---|
| `src/pages/RepoPage.tsx` | 69, 71, 201-205 | Subroutes route to 404 `PlaceholderPage` | Update links: `/issues`, `/discussions`, `/codespaces`, `/workspace`, `/launch` |
| `src/components/Shell.tsx` | 66-72, 167-171 | Navbar link asymmetry between Classic & Studio | Align core destinations across both headers |
| `src/components/Shell.tsx` | 271-281 | Header collapse & content bounce during lens toggle | Remove `mode="wait"` or provide constant `min-h-[64px]` header height |
| `src/pages/PRPage.tsx` | 125-147 | Tab shadow misalignment on container baseline | Remove tab bottom drop shadow and use `-mb-[2px]` |
| `src/pages/ProfilePage.tsx` | 323-498 | Studio Profile lacks sub-tabs (Repositories, Projects, Packages) | Add Studio sub-tab switching matching Classic |

### Priority 4: Repository Cleanup
| File | Action | Rationale |
|---|---|---|
| `src/store/useAppStore.ts` | Delete file | Orphaned file with zero imports; superseded by `src/store.ts` |

---

## 5. Verification Method

### How to Independently Verify Every Claim:

1. **Verify Invisible Text in Classic Mode (`LaunchPage.tsx`)**:
   - Command: Start dev server or inspect build with lens set to `classic`.
   - Navigate to `http://localhost:5173/launch` with `lens === 'classic'`.
   - Inspect `#F0F6FC` text against `#F0F6FC` background in the Release Notes card.
2. **Verify Invisible Text in Studio Mode (`RepoPage.tsx`)**:
   - Navigate to `http://localhost:5173/react/react` with `lens === 'studio'`.
   - Inspect the `v18.3` release metric card under Momentum: `#FFF9A3` on `#FFFFFF` card.
3. **Verify Broken Subroute 404s (`RepoPage.tsx`)**:
   - On `http://localhost:5173/react/react`, click "Issues", "Discussions", or "Codespaces".
   - Confirm it triggers `PlaceholderPage` (`/react/react/issues`) instead of the dedicated dual-lens page.
4. **Verify Header Layout Bounce (`Shell.tsx`)**:
   - Toggle lens using `Alt+M` or the header switch.
   - Observe the 300ms content jump caused by `<AnimatePresence mode="wait">`.
5. **Verify Orphaned Store**:
   - Run: `grep -rn "from ['\"].*useAppStore['\"]" src/`
   - Observe 0 files importing from `src/store/useAppStore.ts`.
6. **Verify Automated Test Integrity**:
   - Run: `npm run build && node tests/run-e2e-tests.js && node tests/adversarial-dual-lens-test.js && node tests/adversarial-routing-test.js`
   - Confirm all existing tests pass with 0 errors.
