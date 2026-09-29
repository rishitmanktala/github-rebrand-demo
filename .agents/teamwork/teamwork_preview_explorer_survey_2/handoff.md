# Handoff Report: Mock Data & Zustand Store Architecture Survey

**Explorer**: Survey Explorer 2 (Mock Data & Zustand Store)  
**Working Directory**: `/Users/ritesh/Documents/Cyfernode_alt/.agents/teamwork/teamwork_preview_explorer_survey_2`  
**Date**: 2026-09-29  
**Target Audience**: Orchestrator & Downstream Implementer Agents  

---

## 1. Observation

### 1.1 Zustand Store Architecture & The Two Store Files
Direct inspection revealed two distinct store definitions in the project:
1. **`src/store.ts` (Active Canonical Store)**:
   - Line 1: `import { create } from 'zustand';`
   - Lines 3–21: Defines `Lens = 'classic' | 'studio'`, `Toast { id: string; message: string; type?: 'info' | 'success'; }`, and `AppState`:
     ```ts
     interface AppState {
       lens: Lens;
       setLens: (lens: Lens) => void;
       toggleLens: () => void;
       onboarded: boolean;
       setOnboarded: (val: boolean) => void;
       toasts: Toast[];
       addToast: (message: string, type?: 'info' | 'success') => void;
       removeToast: (id: string) => void;
     }
     ```
   - Lines 23–49: Implements state with manual `localStorage` synchronization:
     - `lens`: Initialized from `localStorage.getItem('github-lens') || 'classic'`.
     - `setLens(lens)`: Updates state and calls `localStorage.setItem('github-lens', lens)`.
     - `toggleLens()`: Switches between `'classic'` and `'studio'`, updates `localStorage`.
     - `onboarded`: Initialized from `localStorage.getItem('github-onboarded') === 'true'`.
     - `addToast()`: Generates random ID, sets 3000ms timeout for automatic dismissal.
   - Grep search confirmed that **all 13 consuming files** in `src/` import from `'../store'` or `'./store'` (`src/store.ts`).
2. **`src/store/useAppStore.ts` (Orphaned / Unused Store File)**:
   - Lines 1–41: Implements `useAppStore` using `zustand/middleware` `persist` (`name: 'github-rebrand-storage'`).
   - Contains fields: `lens`, `hasSeenOnboarding`, `hasSeenSplash`, `peekMode`, `demoReviewsCount`, `hasSeenClassicBanner`.
   - Grep search for `store/useAppStore` yielded **0 results**. It is not imported anywhere.

### 1.2 Classic vs. Studio Dual-Lens Architecture
The dual-lens concept bifurcates GitHub into two complementary visual and interaction models:
1. **Mode State & Toggle Mechanisms**:
   - `lens: 'classic' | 'studio'` in `useAppStore`.
   - **Keyboard Shortcut**: `App.tsx` lines 57–63:
     ```ts
     const handleKeyDown = (e: KeyboardEvent) => {
       if (e.altKey && e.key.toLowerCase() === 'm') {
         toggleLens();
       }
     };
     ```
   - **Header Switcher**: `Shell.tsx` lines 7–25: `LensSwitcher` component provides segmented toggle buttons (`Classic` and `Studio`), rendered in both `ClassicHeader` and `StudioHeader`.
   - **Presenter Controls**: `PresenterControls.tsx` lines 25–26: Steps 2 and 3 call `setLens('classic')` and `setLens('studio')` respectively.
   - **Onboarding Modal**: `OnboardingModal.tsx` lines 19–23: Allows initial selection between Classic and Studio.
   - **Brand Page**: `BrandPage.tsx` line 39: Interactive graphic sets lens to `'classic'`.
   - **Document Title**: `App.tsx` line 56: Dynamically sets `document.title = \`GitHub ${lens === 'studio' ? 'Studio' : 'Classic'}\``.
2. **Styling Differences (Tokens & CSS)**:
   - **Root Element**: `App.tsx` line 69:
     ```tsx
     <div className={`min-h-screen flex flex-col ${lens === 'studio' ? 'font-people bg-paper-warm text-ink' : 'font-classic bg-canvas text-paper'}`}>
     ```
   - **Tailwind Tokens (`tailwind.config.js`)**:
     - Classic Palette: `canvas: "#0D1117"`, `paper: "#F0F6FC"`, `contrib` greens (`#161B22` to `#39D353`).
     - Studio Palette: `paper-warm: "#EDECE9"`, `ink: "#0A0A0A"`, `ship-green: "#2EA043"`, `merge-purple: "#A371F7"`, `review-amber: "#D29922"`, `ai-blue: "#58A6FF"`, `highlight-yellow: "#FFF9A3"`, `diff-red: "#F85149"`.
     - Fonts:
       - `font-classic`: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`
       - `font-people`: `Figtree, "Source Sans 3", sans-serif`
       - `font-display`: `"Inter Tight", sans-serif`
       - `font-code`: `'JetBrains Mono', monospace`
     - Textures (`src/index.css` lines 11–22): `.studio-texture` injects an SVG fractal noise pseudo-element at 5% opacity.
     - Studio Shadows & Borders: Heavy solid ink borders (`border-2 border-ink`, `border-4 border-ink`), hard neo-brutalist drop shadows (`shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]` and `shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]`), and mechanical button depress transitions (`hover:translate-y-1 hover:shadow-none transition`).
3. **Component Variation Architecture**:
   - Header: `Shell.tsx` lines 189–199 uses Framer Motion `<AnimatePresence mode="wait">` to cross-fade between `<ClassicHeader />` and `<StudioHeader />`.
   - Pages: Each page reads `const { lens } = useAppStore();` and conditionally renders `<Classic[Page] />` or `<Studio[Page] />` (e.g. `RepoPage.tsx:206`, `ProfilePage.tsx:227`, `PRPage.tsx:211`, `PRFilesPage.tsx:142`, `SuggestPage.tsx:139`).

### 1.3 Existing JSON Mock Fixtures
Found in `src/data/`:
1. `src/data/repo.react.json` (31 lines, 654 bytes): Fields: `owner`, `name`, `about`, `stars`, `forks`, `files: [{name, message, time}]`, `readme`, `languages`.
2. `src/data/pr.28271.json` (20 lines, 462 bytes): Fields: `id`, `title`, `author`, `state`, `description`, `events: [{type, author, body, text}]`, `reviewers`, `labels`.
3. `src/data/pr.28271.files.json` (63 lines, 1491 bytes): Fields: `changedFiles`, `additions`, `deletions`, `files: [{path, status, additions, deletions, hunks}]`, `intents: [{name, description, files}]`.
4. `src/data/profile.shadcn.json` (33 lines, 1067 bytes): Fields: `name`, `login`, `bio`, `followers`, `following`, `pinnedRepos: [{repoName, desc, lang, stars}]`.
5. TypeScript integration: `tsconfig.app.json` specifies `"resolveJsonModule": true`. All fixtures are imported using ES module syntax (`import data from '../data/foo.json'`). Types are currently implicitly inferred from JSON shape without separate interface declarations.

### 1.4 Critical Routing Discovery (`App.tsx`)
In `src/App.tsx`:
```tsx
<Routes>
  <Route path="/" element={<Navigate to="/react/react" replace />} />
  <Route path="/:user" element={<ProfilePage />} />
  <Route path="/:owner/:repo" element={<RepoPage />} />
  ...
  <Route path="*" element={<PlaceholderPage />} />
</Routes>
```
Route `path="/:user"` is placed **ahead** of potential top-level routes. Any single-segment route like `/issues`, `/explore`, `/marketplace`, `/codespaces`, `/workspace`, `/discussions`, `/projects`, or `/packages` matches `/:user` and incorrectly renders `ProfilePage` unless explicit static routes are defined **above** `/:user`.

---

## 2. Logic Chain

1. **Store Resolution**:
   - *Observation*: `src/store.ts` is imported by 13 files; `src/store/useAppStore.ts` is imported by 0 files.
   - *Deduction*: `src/store.ts` is the sole operational source of truth. Any enhancements to global state (such as interactive button states, bookmarking/starring, active filters) must be made in `src/store.ts` to avoid breaking changes or split brain state.
2. **Dual-Lens Design Contract**:
   - *Observation*: Classic mode uses dark canvas (`#0D1117`), dense tables, standard GitHub aesthetics. Studio mode uses warm paper (`#EDECE9`), `.studio-texture`, neo-brutalist solid black borders, hard drop shadows, uppercase Figtree/Inter Tight typography, and functional colors (`highlight-yellow`, `ship-green`, `ai-blue`, `review-amber`).
   - *Deduction*: Every newly created page MUST provide both a `<Classic[Page] />` and a `<Studio[Page] />` sub-component, toggled by `lens === 'classic'`, adhering strictly to these two distinct design grammars.
3. **Mock Data Delivery**:
   - *Observation*: Existing pages load static data via direct JSON imports (`import data from '../data/*.json'`).
   - *Deduction*: New pages should follow the exact same convention. Static JSON files must be created in `src/data/` and imported directly. To ensure robustness, TypeScript interface definitions should be documented and implemented.
4. **Interactive Element Mandate**:
   - *Observation*: `interactive-elements.md` and codebase grep show generic `addToast('Feature not available...')`, `alert()`, or unhandled buttons.
   - *Deduction*: Buttons on new pages and existing headers must execute genuine local state mutations, open dedicated dialogs/drawers, copy text to clipboard with success feedback, or update filter criteria.

---

## 3. Detailed Data Schemas for Required Mock JSON Fixtures

To ensure rich, realistic UI rendering across both Classic and Studio modes, the following 8 mock fixtures are required in `src/data/`.

### 3.1 `src/data/issues.json`
- **Associated Routes**: `/issues`, `/:owner/:repo/issues`
- **Classic UI Needs**: Issue list table with open/closed counters, author/label/milestone filters, issue number, author avatar, comments count, label pills.
- **Studio UI Needs**: Momentum banner ("Triage Velocity"), Copilot issue diagnosis badge, "Triage with Copilot" action, priority badges (`BLOCKER`, `RFC`, `GOOD FIRST ISSUE`), reaction counters.

**TypeScript Interface**:
```ts
export interface IssueLabel {
  id: string;
  name: string;
  color: string; // hex code
  description: string;
}

export interface IssueItem {
  id: number;
  number: number;
  title: string;
  repo: string; // e.g. "facebook/react"
  author: {
    login: string;
    avatarUrl: string;
  };
  state: "open" | "closed";
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  labels: IssueLabel[];
  assignee?: {
    login: string;
    avatarUrl: string;
  };
  aiSummary: string; // Copilot plain-English summary for Studio
  category: "bug" | "feature" | "rfc" | "perf";
  reactionsCount: number;
  body: string;
}

export interface IssuesData {
  stats: {
    openCount: number;
    closedCount: number;
    triageNeeded: number;
    aiAssisted: number;
  };
  issues: IssueItem[];
}
```

**JSON Fixture Specification (`src/data/issues.json`)**:
```json
{
  "stats": {
    "openCount": 842,
    "closedCount": 12450,
    "triageNeeded": 14,
    "aiAssisted": 128
  },
  "issues": [
    {
      "id": 29810,
      "number": 29810,
      "title": "useActionState hook causes hydration mismatch when server action throws",
      "repo": "facebook/react",
      "author": {
        "login": "acdlite",
        "avatarUrl": "https://github.com/acdlite.png"
      },
      "state": "open",
      "createdAt": "2024-03-24T14:22:00Z",
      "updatedAt": "2024-03-25T09:15:00Z",
      "commentsCount": 18,
      "labels": [
        { "id": "l1", "name": "Status: Unconfirmed", "color": "#d4c5f9", "description": "Needs reproduction" },
        { "id": "l2", "name": "Component: Server Actions", "color": "#58A6FF", "description": "Server action runtime" },
        { "id": "l3", "name": "Priority: Blocker", "color": "#F85149", "description": "High priority issue" }
      ],
      "assignee": {
        "login": "sebmarkbage",
        "avatarUrl": "https://github.com/sebmarkbage.png"
      },
      "aiSummary": "Server action failure during SSR fails to serialize rejection payload to client stream, causing mismatch at client boundary.",
      "category": "bug",
      "reactionsCount": 42,
      "body": "When a server action throws an error during initial render, the client reconciliation logic fails to catch the boundary and throws a hydration mismatch error instead of unwrapping the error boundary."
    },
    {
      "id": 29785,
      "number": 29785,
      "title": "RFC: Standardized View Transition Primitives for Concurrent Transitions",
      "repo": "facebook/react",
      "author": {
        "login": "gaearon",
        "avatarUrl": "https://github.com/gaearon.png"
      },
      "state": "open",
      "createdAt": "2024-03-22T10:11:00Z",
      "updatedAt": "2024-03-24T16:00:00Z",
      "commentsCount": 47,
      "labels": [
        { "id": "l4", "name": "Type: Discussion", "color": "#FFF9A3", "description": "Proposal / RFC" },
        { "id": "l5", "name": "React 19", "color": "#2EA043", "description": "Scheduled for React 19" }
      ],
      "aiSummary": "Proposal to introduce `<ViewTransition>` component to synchronize CSS View Transitions API with React Suspense and Transitions.",
      "category": "rfc",
      "reactionsCount": 115,
      "body": "This proposal defines how the Document View Transitions API coordinates with React's concurrent scheduler."
    },
    {
      "id": 29650,
      "number": 29650,
      "title": "Compiler: Memoization bail-out in loops with nested destructuring",
      "repo": "facebook/react",
      "author": {
        "login": "josephsavona",
        "avatarUrl": "https://github.com/josephsavona.png"
      },
      "state": "open",
      "createdAt": "2024-03-20T18:45:00Z",
      "updatedAt": "2024-03-23T11:20:00Z",
      "commentsCount": 7,
      "labels": [
        { "id": "l6", "name": "React Compiler", "color": "#A371F7", "description": "Compiler analysis" }
      ],
      "aiSummary": "Optimisation pass fails to infer immutable bindings when array destructuring is used inside a mapped loop.",
      "category": "perf",
      "reactionsCount": 29,
      "body": "The React Compiler aborts memoization when detecting complex destructuring inside iterator expressions."
    }
  ]
}
```

---

### 3.2 `src/data/codespaces.json`
- **Associated Routes**: `/codespaces`, `/:owner/:repo/codespaces`
- **Classic UI Needs**: List of active/stopped user codespaces, machine specs (cores, RAM), last used timestamp, kebab menu (Open in browser, Open in VS Code, Stop, Delete), usage limits progress bar.
- **Studio UI Needs**: "Instant Workshop" hero, interactive pulse status cards (Running / Idle / Stopped), resource dials (CPU / Memory load), 1-click "Launch Session", collaborative guest invite button, starter template cards.

**TypeScript Interface**:
```ts
export interface CodespaceMachine {
  cores: number;
  ramGb: number;
  storageGb: number;
  type: string;
}

export interface CodespaceItem {
  id: string;
  name: string; // e.g. "supreme-space-journey"
  displayName: string;
  repo: string;
  branch: string;
  state: "Running" | "Available" | "Shutdown" | "Rebuilding";
  lastUsed: string;
  createdAt: string;
  machine: CodespaceMachine;
  location: string;
  collaboratorsCount: number;
}

export interface CodespaceTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  repo: string;
  badge: string;
}

export interface CodespacesData {
  user: string;
  activeUsage: {
    usedHours: number;
    totalHours: number;
    storageGb: number;
    storageLimitGb: number;
  };
  codespaces: CodespaceItem[];
  templates: CodespaceTemplate[];
}
```

**JSON Fixture Specification (`src/data/codespaces.json`)**:
```json
{
  "user": "demo-user",
  "activeUsage": {
    "usedHours": 24,
    "totalHours": 60,
    "storageGb": 8.4,
    "storageLimitGb": 15.0
  },
  "codespaces": [
    {
      "id": "cs_01hjk98",
      "name": "glowing-eureka-7vx5w",
      "displayName": "React 19 Canary Playground",
      "repo": "facebook/react",
      "branch": "main",
      "state": "Running",
      "lastUsed": "10 minutes ago",
      "createdAt": "2024-03-20T12:00:00Z",
      "machine": {
        "cores": 4,
        "ramGb": 16,
        "storageGb": 32,
        "type": "Standard 4-core (16GB RAM)"
      },
      "location": "US East (N. Virginia)",
      "collaboratorsCount": 2
    },
    {
      "id": "cs_02mno45",
      "name": "fluffy-disco-9q12p",
      "displayName": "shadcn/ui Component Lab",
      "repo": "shadcn/ui",
      "branch": "feat/neo-brutalist",
      "state": "Available",
      "lastUsed": "2 days ago",
      "createdAt": "2024-03-15T09:30:00Z",
      "machine": {
        "cores": 2,
        "ramGb": 8,
        "storageGb": 32,
        "type": "Basic 2-core (8GB RAM)"
      },
      "location": "Europe West (Frankfurt)",
      "collaboratorsCount": 0
    },
    {
      "id": "cs_03xyz78",
      "name": "turbo-guacamole-3k45l",
      "displayName": "Cyfernode Rebrand v2 Prototype",
      "repo": "cyfernode/studio",
      "branch": "brand-v2",
      "state": "Shutdown",
      "lastUsed": "5 days ago",
      "createdAt": "2024-03-10T14:15:00Z",
      "machine": {
        "cores": 8,
        "ramGb": 32,
        "storageGb": 64,
        "type": "Performance 8-core (32GB RAM)"
      },
      "location": "US West (Oregon)",
      "collaboratorsCount": 1
    }
  ],
  "templates": [
    {
      "id": "tmpl_react19",
      "title": "React 19 + Server Components",
      "description": "Pre-configured environment with Node 20, Vite, Tailwind CSS, and React 19 Canary.",
      "icon": "Code2",
      "repo": "facebook/react",
      "badge": "Official"
    },
    {
      "id": "tmpl_next15",
      "title": "Next.js App Router + shadcn/ui",
      "description": "Fullstack workspace with Turbopack, Tailwind v4, and Radix UI components pre-installed.",
      "icon": "Layout",
      "repo": "shadcn/ui",
      "badge": "Popular"
    },
    {
      "id": "tmpl_rust_wasm",
      "title": "Rust + WebAssembly Studio",
      "description": "High-performance Rust toolchain with wasm-pack and interactive browser preview.",
      "icon": "Cpu",
      "repo": "rustwasm/wasm-pack",
      "badge": "Systems"
    }
  ]
}
```

---

### 3.3 `src/data/marketplace.json`
- **Associated Routes**: `/marketplace`
- **Classic UI Needs**: Category sidebar (Actions, Apps, Copilot Extensions), verified creator badges, star rating, install counts, pricing badges (`Free`, `Paid`, `Free Trial`), search/filter inputs.
- **Studio UI Needs**: "Extend the Workshop" hero, bold plugin cards with high-contrast color tags (`AI`, `DevOps`, `Quality`), 1-click "Install to Workshop" toggle with instant state update, category carousel, featured developer showcase.

**TypeScript Interface**:
```ts
export interface MarketplaceItem {
  id: string;
  slug: string;
  name: string;
  type: "action" | "app" | "copilot-extension";
  publisher: {
    name: string;
    verified: boolean;
    avatarUrl: string;
  };
  shortDescription: string;
  fullDescription: string;
  icon: string; // Lucide icon identifier
  badgeColor: string; // Tailwind color class or hex
  category: "Continuous Integration" | "AI & ML" | "Code Quality" | "Security" | "Deployment" | "Utilities";
  rating: number;
  ratingCount: number;
  installs: string;
  pricing: "Free" | "Free Trial" | "Paid";
  featured: boolean;
  tags: string[];
  installed?: boolean;
}

export interface MarketplaceData {
  categories: string[];
  featuredItem: MarketplaceItem;
  items: MarketplaceItem[];
}
```

**JSON Fixture Specification (`src/data/marketplace.json`)**:
```json
{
  "categories": [
    "All Categories",
    "AI & ML",
    "Continuous Integration",
    "Code Quality",
    "Security",
    "Deployment",
    "Utilities"
  ],
  "featuredItem": {
    "id": "ext_copilot_radar",
    "slug": "copilot-radar",
    "name": "GitHub Copilot Radar",
    "type": "copilot-extension",
    "publisher": {
      "name": "GitHub Next",
      "verified": true,
      "avatarUrl": "/brand/logo.png"
    },
    "shortDescription": "Continuous architectural analysis and plain-English PR diff summaries directly in your workflow.",
    "fullDescription": "Copilot Radar monitors commits across monorepos, predicts breaking API changes, and drafts plain-English explanations for PR reviewers before code review begins.",
    "icon": "Sparkles",
    "badgeColor": "bg-ai-blue",
    "category": "AI & ML",
    "rating": 4.9,
    "ratingCount": 2480,
    "installs": "1.2M",
    "pricing": "Free",
    "featured": true,
    "tags": ["AI", "Copilot", "Architecture", "PR Reviews"],
    "installed": false
  },
  "items": [
    {
      "id": "ext_docker_action",
      "slug": "docker-build-push",
      "name": "Docker Build & Push",
      "type": "action",
      "publisher": {
        "name": "Docker Inc.",
        "verified": true,
        "avatarUrl": "https://github.com/docker.png"
      },
      "shortDescription": "Build and push Docker container images with Buildx and multi-platform cache support.",
      "fullDescription": "Official GitHub Action to build and push Docker images using Buildx with full BuildKit caching options.",
      "icon": "Box",
      "badgeColor": "bg-ship-green",
      "category": "Deployment",
      "rating": 4.8,
      "ratingCount": 8920,
      "installs": "5.6M",
      "pricing": "Free",
      "featured": false,
      "tags": ["Docker", "CI/CD", "Containers"],
      "installed": true
    },
    {
      "id": "ext_codeql",
      "slug": "codeql-security-scanner",
      "name": "CodeQL Semantic Analysis",
      "type": "action",
      "publisher": {
        "name": "GitHub Security Lab",
        "verified": true,
        "avatarUrl": "/brand/logo.png"
      },
      "shortDescription": "Discover zero-day vulnerabilities and SQL injection attacks using semantic code queries.",
      "fullDescription": "Industry-standard semantic AST code analysis engine finding vulnerabilities before code merges.",
      "icon": "ShieldCheck",
      "badgeColor": "bg-review-amber",
      "category": "Security",
      "rating": 4.9,
      "ratingCount": 4210,
      "installs": "3.8M",
      "pricing": "Free",
      "featured": false,
      "tags": ["Security", "SAST", "Vulnerabilities"],
      "installed": true
    },
    {
      "id": "ext_prettier_check",
      "slug": "prettier-format-bot",
      "name": "Prettier Action Pro",
      "type": "action",
      "publisher": {
        "name": "Prettier Team",
        "verified": true,
        "avatarUrl": "https://github.com/prettier.png"
      },
      "shortDescription": "Automatically check and apply opinionated code formatting on PR commits.",
      "fullDescription": "Runs Prettier on pull requests and commits fixes automatically or comments on formatting errors.",
      "icon": "CheckCircle2",
      "badgeColor": "bg-highlight-yellow",
      "category": "Code Quality",
      "rating": 4.7,
      "ratingCount": 1540,
      "installs": "2.1M",
      "pricing": "Free",
      "featured": false,
      "tags": ["Formatting", "Linting", "JavaScript"],
      "installed": false
    },
    {
      "id": "ext_sentry_release",
      "slug": "sentry-release-tracking",
      "name": "Sentry Release Health",
      "type": "app",
      "publisher": {
        "name": "Sentry",
        "verified": true,
        "avatarUrl": "https://github.com/getsentry.png"
      },
      "shortDescription": "Track deployments, notify developers of new regressions, and associate stack traces to commits.",
      "fullDescription": "Real-time error tracking and crash reporting correlated with GitHub commits and pull requests.",
      "icon": "AlertTriangle",
      "badgeColor": "bg-diff-red",
      "category": "Continuous Integration",
      "rating": 4.8,
      "ratingCount": 3120,
      "installs": "1.9M",
      "pricing": "Free Trial",
      "featured": false,
      "tags": ["Monitoring", "Sentry", "Telemetry"],
      "installed": false
    }
  ]
}
```

---

### 3.4 `src/data/explore.json`
- **Associated Routes**: `/explore`
- **Classic UI Needs**: Trending tab (Today, This week, This month), Language dropdown, Trending repositories with stars/forks counters, contributor avatar stacks, "Star" button.
- **Studio UI Needs**: "Radar: What the Community is Shipping Right Now", visual momentum indicators (`+1,420 stars this week`), Topic clouds (`#generative-ui`, `#local-first`), Builder spotlight interviews, interactive star/follow actions.

**TypeScript Interface**:
```ts
export interface TrendingRepo {
  owner: string;
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: string;
  forks: string;
  starsToday: number;
  builtBy: Array<{
    login: string;
    avatarUrl: string;
  }>;
  topicTags: string[];
  momentumScore: number;
  velocityText: string;
}

export interface ExploreCollection {
  id: string;
  title: string;
  description: string;
  curator: string;
  itemCount: number;
  color: string;
}

export interface ExploreData {
  trendingTimeframes: string[];
  languages: string[];
  trending: TrendingRepo[];
  collections: ExploreCollection[];
  spotlightStory: {
    headline: string;
    subline: string;
    author: string;
    repo: string;
    readTime: string;
  };
}
```

**JSON Fixture Specification (`src/data/explore.json`)**:
```json
{
  "trendingTimeframes": ["today", "this_week", "this_month"],
  "languages": ["All Languages", "TypeScript", "JavaScript", "Rust", "Python", "Go"],
  "spotlightStory": {
    "headline": "How the React Core Team Separated Server from Client",
    "subline": "An inside look into PR #28271 and the architectural rethinking of modern web runtimes.",
    "author": "gnoff & sebmarkbage",
    "repo": "facebook/react",
    "readTime": "5 min read"
  },
  "trending": [
    {
      "owner": "shadcn",
      "name": "ui",
      "description": "Composable, accessible components with thoughtful defaults. Build your own component library with code you can customize.",
      "language": "TypeScript",
      "languageColor": "#3178c6",
      "stars": "125k",
      "forks": "14.2k",
      "starsToday": 892,
      "builtBy": [
        { "login": "shadcn", "avatarUrl": "https://github.com/shadcn.png" },
        { "login": "leerob", "avatarUrl": "https://github.com/leerob.png" }
      ],
      "topicTags": ["react", "tailwind", "radix-ui", "components"],
      "momentumScore": 99,
      "velocityText": "+4,210 stars this week"
    },
    {
      "owner": "facebook",
      "name": "react",
      "description": "The library for web and native user interfaces.",
      "language": "JavaScript",
      "languageColor": "#f1e05a",
      "stars": "211k",
      "forks": "44k",
      "starsToday": 415,
      "builtBy": [
        { "login": "acdlite", "avatarUrl": "https://github.com/acdlite.png" },
        { "login": "sebmarkbage", "avatarUrl": "https://github.com/sebmarkbage.png" },
        { "login": "gaearon", "avatarUrl": "https://github.com/gaearon.png" }
      ],
      "topicTags": ["javascript", "library", "ui", "declarative"],
      "momentumScore": 95,
      "velocityText": "+2,840 stars this week"
    },
    {
      "owner": "astral-sh",
      "name": "uv",
      "description": "An extremely fast Python package and project manager, written in Rust.",
      "language": "Rust",
      "languageColor": "#dea584",
      "stars": "38k",
      "forks": "1.4k",
      "starsToday": 630,
      "builtBy": [
        { "login": "charliermarsh", "avatarUrl": "https://github.com/charliermarsh.png" }
      ],
      "topicTags": ["python", "rust", "package-manager", "cli"],
      "momentumScore": 92,
      "velocityText": "+3,150 stars this week"
    },
    {
      "owner": "tailwindlabs",
      "name": "tailwindcss",
      "description": "A utility-first CSS framework for rapid UI development.",
      "language": "Rust",
      "languageColor": "#dea584",
      "stars": "84k",
      "forks": "4.1k",
      "starsToday": 320,
      "builtBy": [
        { "login": "adamwathan", "avatarUrl": "https://github.com/adamwathan.png" }
      ],
      "topicTags": ["css", "framework", "oxide", "compiler"],
      "momentumScore": 88,
      "velocityText": "+1,980 stars this week"
    }
  ],
  "collections": [
    {
      "id": "col_ai_toolkits",
      "title": "Local-First AI Toolkits",
      "description": "Libraries for running LLMs, embedding models, and vector stores directly in client browsers and edge runtimes.",
      "curator": "github-editorial",
      "itemCount": 16,
      "color": "border-ai-blue"
    },
    {
      "id": "col_design_systems",
      "title": "Modern Design Systems 2024",
      "description": "Next-generation design systems marrying neo-brutalism, fluid typography, and accessibility.",
      "curator": "design-guild",
      "itemCount": 24,
      "color": "border-highlight-yellow"
    }
  ]
}
```

---

### 3.5 `src/data/workspace.json`
- **Associated Routes**: `/workspace`
- **Classic UI Needs**: Multi-repo dashboard, pending pull request review requests, recent commit stream, team assignments.
- **Studio UI Needs**: "The Shared Workshop" command center, live collaborative pairing sessions, cross-repo momentum timeline, visual team status (Online / Pairing / Offline), quick actions ("Pair with Copilot", "Start RFC", "Launch Monorepo Codespace").

**TypeScript Interface**:
```ts
export interface WorkspaceSession {
  id: string;
  title: string;
  type: "pairing" | "rfc-review" | "incident-triage" | "design-sync";
  activeParticipants: Array<{
    login: string;
    name: string;
    avatarUrl: string;
    status: "active" | "speaking" | "idle";
  }>;
  targetRepo: string;
  prOrIssueId?: number;
  startedAt: string;
}

export interface ActivityFeedItem {
  id: string;
  type: "pr_merge" | "rfc_created" | "deployment" | "security_alert";
  actor: {
    login: string;
    avatarUrl: string;
  };
  target: string;
  message: string;
  timestamp: string;
  badgeColor: string;
}

export interface PinnedProject {
  name: string;
  description: string;
  branch: string;
  health: "healthy" | "failing" | "building";
  openPrs: number;
  pendingReviews: number;
}

export interface WorkspaceData {
  workspaceName: string;
  tagline: string;
  activeSessions: WorkspaceSession[];
  pinnedProjects: PinnedProject[];
  activityFeed: ActivityFeedItem[];
  teamMembers: Array<{
    login: string;
    name: string;
    role: string;
    avatarUrl: string;
    isOnline: boolean;
  }>;
}
```

**JSON Fixture Specification (`src/data/workspace.json`)**:
```json
{
  "workspaceName": "React & Ecosystem Workshop",
  "tagline": "Unified collaborative canvas for core maintainers and partners.",
  "activeSessions": [
    {
      "id": "sess_01",
      "title": "PR #28271 Final Review: react-dom/client split",
      "type": "rfc-review",
      "activeParticipants": [
        { "login": "gnoff", "name": "Lauren", "avatarUrl": "https://github.com/gnoff.png", "status": "speaking" },
        { "login": "sebmarkbage", "name": "Sebastian", "avatarUrl": "https://github.com/sebmarkbage.png", "status": "active" }
      ],
      "targetRepo": "facebook/react",
      "prOrIssueId": 28271,
      "startedAt": "24 minutes ago"
    },
    {
      "id": "sess_02",
      "title": "shadcn/ui Neo-Brutalist Theme Architecture",
      "type": "pairing",
      "activeParticipants": [
        { "login": "shadcn", "name": "Shad", "avatarUrl": "https://github.com/shadcn.png", "status": "speaking" }
      ],
      "targetRepo": "shadcn/ui",
      "startedAt": "1 hour ago"
    }
  ],
  "pinnedProjects": [
    {
      "name": "facebook/react",
      "description": "Core React library repository and canary release line.",
      "branch": "main",
      "health": "healthy",
      "openPrs": 245,
      "pendingReviews": 8
    },
    {
      "name": "shadcn/ui",
      "description": "Component architecture and CLI codegen distribution.",
      "branch": "main",
      "health": "healthy",
      "openPrs": 42,
      "pendingReviews": 3
    }
  ],
  "activityFeed": [
    {
      "id": "act_01",
      "type": "pr_merge",
      "actor": { "login": "gnoff", "avatarUrl": "https://github.com/gnoff.png" },
      "target": "facebook/react #28271",
      "message": "Merged pull request: Move all client code to react-dom/client",
      "timestamp": "2 hours ago",
      "badgeColor": "bg-ship-green text-white"
    },
    {
      "id": "act_02",
      "type": "deployment",
      "actor": { "login": "facebook-bot", "avatarUrl": "/brand/logo.png" },
      "target": "react-canary-v19.0.0-alpha",
      "message": "Automated canary release published to npm registry",
      "timestamp": "3 hours ago",
      "badgeColor": "bg-ai-blue text-white"
    },
    {
      "id": "act_03",
      "type": "rfc_created",
      "actor": { "login": "gaearon", "avatarUrl": "https://github.com/gaearon.png" },
      "target": "facebook/react #29785",
      "message": "Opened new RFC for View Transition primitives in concurrent mode",
      "timestamp": "1 day ago",
      "badgeColor": "bg-highlight-yellow text-ink"
    }
  ],
  "teamMembers": [
    { "login": "sebmarkbage", "name": "Sebastian Markbåge", "role": "Architect", "avatarUrl": "https://github.com/sebmarkbage.png", "isOnline": true },
    { "login": "gnoff", "name": "Lauren Tan", "role": "Maintainer", "avatarUrl": "https://github.com/gnoff.png", "isOnline": true },
    { "login": "acdlite", "name": "Andrew Clark", "role": "Compiler Lead", "avatarUrl": "https://github.com/acdlite.png", "isOnline": true },
    { "login": "shadcn", "name": "Shad", "role": "Collaborator", "avatarUrl": "https://github.com/shadcn.png", "isOnline": false }
  ]
}
```

---

### 3.6 `src/data/discussions.json`
- **Associated Routes**: `/discussions`, `/:owner/:repo/discussions`
- **Classic UI Needs**: Category listing sidebar (Announcements, General, Ideas, Q&A, Show & Tell), upvote vote counters, answered checkmark badges, participant avatars, "New Discussion" button.
- **Studio UI Needs**: "The Open Forum" editorial grid, pinned community highlight card, visual sentiment indicator, Copilot Discussion Digest card, interactive upvote click toggling with toast confirmation.

**TypeScript Interface**:
```ts
export interface DiscussionCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export interface DiscussionItem {
  id: number;
  title: string;
  category: "Announcements" | "Ideas" | "Q&A" | "Show and tell" | "General";
  categoryColor: string;
  author: {
    login: string;
    avatarUrl: string;
    badge?: string;
  };
  createdAt: string;
  upvotes: number;
  isUpvoted?: boolean;
  answersCount: number;
  isAnswered: boolean;
  previewText: string;
  pinned?: boolean;
}

export interface DiscussionsData {
  repo: string;
  categories: DiscussionCategory[];
  discussions: DiscussionItem[];
}
```

**JSON Fixture Specification (`src/data/discussions.json`)**:
```json
{
  "repo": "facebook/react",
  "categories": [
    { "id": "cat_ann", "name": "Announcements", "icon": "Megaphone", "description": "Official updates from maintainers", "count": 28 },
    { "id": "cat_ideas", "name": "Ideas", "icon": "Lightbulb", "description": "Feature suggestions and architectural brainstorming", "count": 142 },
    { "id": "cat_qa", "name": "Q&A", "icon": "HelpCircle", "description": "Ask the community and get verified answers", "count": 389 },
    { "id": "cat_show", "name": "Show and tell", "icon": "Sparkles", "description": "Share what you built with the community", "count": 215 },
    { "id": "cat_gen", "name": "General", "icon": "MessageSquare", "description": "Anything relevant to the ecosystem", "count": 180 }
  ],
  "discussions": [
    {
      "id": 1402,
      "title": "React 19 Readiness: How should libraries prepare for the Action hooks?",
      "category": "Announcements",
      "categoryColor": "bg-ship-green text-white",
      "author": {
        "login": "acdlite",
        "avatarUrl": "https://github.com/acdlite.png",
        "badge": "Maintainer"
      },
      "createdAt": "3 days ago",
      "upvotes": 342,
      "isUpvoted": true,
      "answersCount": 54,
      "isAnswered": true,
      "previewText": "We are preparing to cut the first release candidate for React 19. Here is a guide on adapting form libraries and query caches for useActionState and useOptimistic.",
      "pinned": true
    },
    {
      "id": 1398,
      "title": "Idea: First-class Support for Signal primitives alongside React State",
      "category": "Ideas",
      "categoryColor": "bg-highlight-yellow text-ink",
      "author": {
        "login": "gaearon",
        "avatarUrl": "https://github.com/gaearon.png",
        "badge": "Core Alum"
      },
      "createdAt": "5 days ago",
      "upvotes": 218,
      "isUpvoted": false,
      "answersCount": 89,
      "isAnswered": false,
      "previewText": "Can fine-grained reactivity coordinate with React's scheduling model without sacrificing time-slicing and interruption? Let's discuss trade-offs.",
      "pinned": false
    },
    {
      "id": 1375,
      "title": "Why does Server Component rendering throw on client-only window access instead of warning?",
      "category": "Q&A",
      "categoryColor": "bg-ai-blue text-white",
      "author": {
        "login": "shadcn",
        "avatarUrl": "https://github.com/shadcn.png",
        "badge": "Top Builder"
      },
      "createdAt": "1 week ago",
      "upvotes": 124,
      "isUpvoted": false,
      "answersCount": 12,
      "isAnswered": true,
      "previewText": "When components inadvertently evaluate window or localStorage in the RSC module scope, the server process exits immediately. Here is the canonical isolation pattern.",
      "pinned": false
    }
  ]
}
```

---

### 3.7 `src/data/projects.json`
- **Associated Routes**: `/projects`, `/:user?tab=projects`
- **Classic UI Needs**: List of project boards, progress meter (To Do, In Progress, Done percentages), linked repositories, card counts, board status (Open/Closed).
- **Studio UI Needs**: "Flight Deck / Project Fabric", high-contrast Kanban board columns with draggable/reorderable cards, estimate badges, milestone burndown progress bar, interactive "Add Card" trigger.

**TypeScript Interface**:
```ts
export interface ProjectCard {
  id: string;
  title: string;
  type: "issue" | "pr" | "note";
  identifier?: string;
  assignee?: {
    login: string;
    avatarUrl: string;
  };
  labels: Array<{ name: string; color: string }>;
  estimate?: string;
}

export interface ProjectColumn {
  id: string;
  name: string;
  count: number;
  color: string;
  cards: ProjectCard[];
}

export interface ProjectItem {
  id: string;
  number: number;
  title: string;
  description: string;
  state: "open" | "closed";
  updatedAt: string;
  progress: {
    todo: number;
    inProgress: number;
    done: number;
    percentComplete: number;
  };
  columns: ProjectColumn[];
}

export interface ProjectsData {
  owner: string;
  totalProjects: number;
  projects: ProjectItem[];
}
```

**JSON Fixture Specification (`src/data/projects.json`)**:
```json
{
  "owner": "facebook",
  "totalProjects": 4,
  "projects": [
    {
      "id": "proj_react19",
      "number": 1,
      "title": "React 19 Release Flight Deck",
      "description": "Tracking all breaking changes, compiler stabilization, and documentation rollouts for the React 19 milestone.",
      "state": "open",
      "updatedAt": "Yesterday",
      "progress": {
        "todo": 4,
        "inProgress": 3,
        "done": 18,
        "percentComplete": 72
      },
      "columns": [
        {
          "id": "col_todo",
          "name": "Backlog & Triage",
          "count": 4,
          "color": "border-gray-500",
          "cards": [
            {
              "id": "card_01",
              "title": "Document useActionState migration patterns",
              "type": "issue",
              "identifier": "#29810",
              "assignee": { "login": "acdlite", "avatarUrl": "https://github.com/acdlite.png" },
              "labels": [{ "name": "Docs", "color": "#58A6FF" }],
              "estimate": "2d"
            },
            {
              "id": "card_02",
              "title": "Deprecate UMD script builds in react-dom",
              "type": "issue",
              "identifier": "#29712",
              "assignee": { "login": "sebmarkbage", "avatarUrl": "https://github.com/sebmarkbage.png" },
              "labels": [{ "name": "Breaking", "color": "#F85149" }],
              "estimate": "1d"
            }
          ]
        },
        {
          "id": "col_in_prog",
          "name": "In Progress / Active Review",
          "count": 3,
          "color": "border-review-amber",
          "cards": [
            {
              "id": "card_03",
              "title": "Move all client code to react-dom/client",
              "type": "pr",
              "identifier": "#28271",
              "assignee": { "login": "gnoff", "avatarUrl": "https://github.com/gnoff.png" },
              "labels": [{ "name": "Refactor", "color": "#2EA043" }],
              "estimate": "3d"
            }
          ]
        },
        {
          "id": "col_done",
          "name": "Shipped v2.0",
          "count": 18,
          "color": "border-ship-green",
          "cards": [
            {
              "id": "card_04",
              "title": "React Compiler Beta Announcement",
              "type": "note",
              "assignee": { "login": "josephsavona", "avatarUrl": "https://github.com/josephsavona.png" },
              "labels": [{ "name": "Shipped", "color": "#A371F7" }]
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 3.8 `src/data/packages.json`
- **Associated Routes**: `/packages`, `/:user?tab=packages`
- **Classic UI Needs**: Registry ecosystem tabs (npm, Docker, Maven, RubyGems), package cards with ecosystem badges, download counters, version tags, 1-click install command copy button.
- **Studio UI Needs**: "Artifact Warehouse" layout, dependency health score, SHA256 integrity guarantee badge, interactive "Copy Command" with toast animation, expandable version history drawer.

**TypeScript Interface**:
```ts
export interface PackageItem {
  id: string;
  name: string;
  description: string;
  ecosystem: "npm" | "Docker" | "Maven" | "RubyGems" | "NuGet";
  latestVersion: string;
  downloadsTotal: string;
  downloadsThisMonth: string;
  visibility: "public" | "private";
  publishedAt: string;
  repository: string;
  installCommand: string;
  license: string;
  tags: string[];
  dependenciesCount: number;
}

export interface PackagesData {
  owner: string;
  ecosystemFilters: string[];
  packages: PackageItem[];
}
```

**JSON Fixture Specification (`src/data/packages.json`)**:
```json
{
  "owner": "shadcn",
  "ecosystemFilters": ["All", "npm", "Docker", "Maven", "RubyGems"],
  "packages": [
    {
      "id": "pkg_shadcn_ui",
      "name": "@shadcn/ui",
      "description": "Component CLI and primitives distribution for modern web applications.",
      "ecosystem": "npm",
      "latestVersion": "v0.9.4",
      "downloadsTotal": "18.4M",
      "downloadsThisMonth": "2.6M",
      "visibility": "public",
      "publishedAt": "2 days ago",
      "repository": "shadcn/ui",
      "installCommand": "npx shadcn@latest init",
      "license": "MIT",
      "tags": ["react", "components", "tailwind", "radix"],
      "dependenciesCount": 4
    },
    {
      "id": "pkg_react",
      "name": "react",
      "description": "The library for web and native user interfaces.",
      "ecosystem": "npm",
      "latestVersion": "v18.3.1",
      "downloadsTotal": "410M",
      "downloadsThisMonth": "38M",
      "visibility": "public",
      "publishedAt": "2 weeks ago",
      "repository": "facebook/react",
      "installCommand": "npm install react@latest",
      "license": "MIT",
      "tags": ["ui", "javascript", "runtime"],
      "dependenciesCount": 0
    },
    {
      "id": "pkg_react_dom",
      "name": "react-dom",
      "description": "DOM renderer for React with client and server entry points.",
      "ecosystem": "npm",
      "latestVersion": "v18.3.1",
      "downloadsTotal": "395M",
      "downloadsThisMonth": "36M",
      "visibility": "public",
      "publishedAt": "2 weeks ago",
      "repository": "facebook/react",
      "installCommand": "npm install react-dom@latest",
      "license": "MIT",
      "tags": ["dom", "renderer"],
      "dependenciesCount": 1
    },
    {
      "id": "pkg_cyfernode_runner",
      "name": "ghcr.io/cyfernode/studio-runner",
      "description": "Pre-warmed OCI container image for instant Codespaces execution.",
      "ecosystem": "Docker",
      "latestVersion": "2.0.0-distroless",
      "downloadsTotal": "1.2M",
      "downloadsThisMonth": "180k",
      "visibility": "public",
      "publishedAt": "3 days ago",
      "repository": "cyfernode/studio",
      "installCommand": "docker pull ghcr.io/cyfernode/studio-runner:2.0.0",
      "license": "Apache-2.0",
      "tags": ["container", "codespaces", "ci"],
      "dependenciesCount": 0
    }
  ]
}
```

---

## 4. Caveats & Architectural Recommendations

1. **Routing Shadow Risk in `App.tsx`**:
   - In `App.tsx`, `<Route path="/:user" element={<ProfilePage />} />` will shadow `/issues`, `/codespaces`, `/marketplace`, `/explore`, `/workspace`, `/discussions`, `/projects`, and `/packages`.
   - **Remedy**: The new static routes MUST be inserted immediately before `<Route path="/:user" ... />`.
2. **Dual Store Confusion**:
   - `src/store.ts` is the active store. `src/store/useAppStore.ts` is orphaned.
   - **Remedy**: Do not write new logic to `src/store/useAppStore.ts`. Extend `src/store.ts` for any global interactive features.
3. **Interactive Buttons Without Handlers**:
   - Buttons currently with no-op or placeholder alerts (e.g. `PresenterControls.tsx` line 62, `Shell.tsx` lines 89–91, `BlobPage.tsx` line 79) should be given real interactive behaviors:
     - "New repository" -> Opens a Modal with repo name input and creates repo in local state.
     - "New codespace" -> Launches simulation with toast and navigates to `/codespaces`.
     - "Star" -> Toggles starred state and increments count.
     - "Upvote" -> Toggles upvoted state and updates count.
     - "Copy install command" -> Writes to `navigator.clipboard` and shows success toast.
4. **Scope Boundaries**:
   - Only survey and architectural specification were performed per the read-only explorer mission. No code was modified in `src/`.

---

## 5. Conclusion & Action Plan for Implementation

The codebase has a clean foundation:
- `src/store.ts` provides simple and reliable state with `lens` and `toasts`.
- Classic mode (dark, high-density, traditional) and Studio mode (warm paper, neo-brutalist, editorial) are well-defined in `tailwind.config.js` and existing pages.
- Existing JSON fixtures in `src/data/` establish a clear standard for static data ingestion.

**Next Steps for Implementation Team**:
1. Create the 8 JSON fixture files in `src/data/` using the exact schemas specified in Section 3.
2. Build 8 new page components under `src/pages/` (each containing `<Classic[Page] />` and `<Studio[Page] />`).
3. Wire the new pages into `src/App.tsx` ahead of `/:user`.
4. Replace placeholder toast messages with concrete interactive state handlers across headers and pages.

---

## 6. Verification Method

To independently verify the observations and schema consistency:
1. **Build Validation**:
   ```bash
   cd /Users/ritesh/Documents/Cyfernode_alt && npm run build
   ```
   *Expected outcome*: Exits with code 0 (`tsc && vite build` succeeds).
2. **Store Usage Audit**:
   ```bash
   grep -rn "from.*store" /Users/ritesh/Documents/Cyfernode_alt/src
   ```
   *Expected outcome*: Confirms all imports reference `src/store.ts` and none reference `src/store/useAppStore.ts`.
3. **Inspect Existing Fixtures**:
   Check `src/data/repo.react.json`, `src/data/pr.28271.json`, `src/data/pr.28271.files.json`, `src/data/profile.shadcn.json` to verify schema compatibility.
4. **Verify Route Precedence**:
   Inspect `src/App.tsx` lines 74–86 to confirm `/:user` position relative to new routes.
