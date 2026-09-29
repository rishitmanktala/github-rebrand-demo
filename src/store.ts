import { create } from 'zustand';

export type Lens = 'classic' | 'studio';

export interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success';
}

export type ModalType = 'create-repo' | 'create-codespace' | 'graduation' | string | null;

export interface TourStep {
  id: string;
  title: string;
  body: string;
  /** CSS selector of the element to spotlight, or null for a centered modal */
  target: string | null;
  /** Which route to navigate to before showing this step */
  route: string | null;
  /** Which lens to enforce before showing this step */
  lens: Lens | null;
  /** Tooltip placement relative to target */
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  /** Optional lens switch to fire when this step mounts */
  mountAction?: 'switch-to-studio' | 'switch-to-classic';
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: '👋 Welcome to the GitHub v2.0 Concept Demo',
    body: "This is a live, interactive prototype of a redesigned GitHub. You'll be guided through each key surface — Classic, Studio, Pull Requests, and more. Press Next to begin.",
    target: null,
    route: '/react/react',
    lens: 'classic',
    placement: 'center',
  },
  {
    id: 'repo-classic',
    title: '📁 The Repo — Classic Lens',
    body: 'This is the react/react repository in Classic lens. Dense, keyboard-first, terminal-fidelity. Notice the familiar dark canvas, monospace fonts, and the Star / Fork / Watch controls.',
    target: '[data-tour="repo-header"]',
    route: '/react/react',
    lens: 'classic',
    placement: 'bottom',
  },
  {
    id: 'lens-switcher',
    title: '🔄 The Dual-Lens Switcher',
    body: 'This toggle lets you switch between Classic (developer-native) and Studio (activity-first, social) views of the same data. Press Peek for a live side-by-side split view.',
    target: '[data-tour="lens-switcher"]',
    route: '/react/react',
    lens: 'classic',
    placement: 'bottom',
    mountAction: 'switch-to-classic',
  },
  {
    id: 'repo-studio',
    title: '🎨 Same Repo — Studio Lens',
    body: 'Same data, completely different energy. Tactile paper canvas, neo-brutalist ink borders, vibrant accents. Studio makes code feel collaborative and alive.',
    target: '[data-tour="repo-header"]',
    route: '/react/react',
    lens: 'studio',
    placement: 'bottom',
    mountAction: 'switch-to-studio',
  },
  {
    id: 'pr-conversation',
    title: '💬 Pull Request — Live Timeline',
    body: 'PR #28271 has a full interactive timeline: commits, CI checks, and review approvals. Studio turns code review into a live workshop. The Merge button ships to production.',
    target: '[data-tour="pr-timeline"]',
    route: '/react/react/pull/28271',
    lens: 'studio',
    placement: 'right',
  },
  {
    id: 'pr-files',
    title: '🗂️ Files Changed — The Diff',
    body: "Studio's diff view transforms raw code hunks into a readable story. Use Unified / Split to switch modes. Press J / K to jump between files.",
    target: '[data-tour="diff-toolbar"]',
    route: '/react/react/pull/28271/changes',
    lens: 'studio',
    placement: 'bottom',
  },
  {
    id: 'profile',
    title: '🧑‍💻 Living Developer Profile',
    body: 'Contribution graph, pinned repos, and in Studio — a shareable build card. Click any day on the graph to see activity details. Your work, your narrative.',
    target: '[data-tour="profile-graph"]',
    route: '/shadcn',
    lens: 'studio',
    placement: 'top',
  },
  {
    id: 'launch',
    title: '🚀 The Launch PR',
    body: 'The v2.0 brand rebrand as a Pull Request. Interactive checklist, before/after logo slider, and a satisfying Merge button that ships to production. GitHub eating its own dogfood.',
    target: '[data-tour="merge-btn"]',
    route: '/launch',
    lens: 'studio',
    placement: 'left',
  },
  {
    id: 'brand',
    title: '🎯 Brand System',
    body: 'The complete design system — dual-audience rings, go-to-market stepper, and live design token previews for both lenses. Every surface is built on these tokens.',
    target: '[data-tour="brand-stepper"]',
    route: '/brand',
    lens: 'studio',
    placement: 'top',
  },
  {
    id: 'finish',
    title: '✅ Tour Complete!',
    body: "You've seen the full GitHub v2.0 concept. Now explore freely — every element is interactive. Switch lenses, open modals, star repos, trigger the merge animation. Press Shift+P for presenter controls.",
    target: null,
    route: null,
    lens: null,
    placement: 'center',
  },
];

interface AppState {
  lens: Lens;
  setLens: (lens: Lens) => void;
  toggleLens: () => void;
  onboarded: boolean;
  setOnboarded: (val: boolean) => void;

  toasts: Toast[];
  addToast: (message: string, type?: 'info' | 'success') => void;
  removeToast: (id: string) => void;

  notificationsCount: number;
  clearNotifications: () => void;

  starredRepos: Record<string, boolean>;
  toggleStarRepo: (repoKey: string) => void;

  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  // Guided tour
  tourActive: boolean;
  tourStep: number;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  jumpTourStep: (idx: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  lens: (localStorage.getItem('github-lens') as Lens) || 'classic',
  setLens: (lens) => {
    localStorage.setItem('github-lens', lens);
    set({ lens });
  },
  toggleLens: () => set((state) => {
    const newLens = state.lens === 'classic' ? 'studio' : 'classic';
    localStorage.setItem('github-lens', newLens);
    return { lens: newLens };
  }),
  onboarded: localStorage.getItem('github-onboarded') === 'true',
  setOnboarded: (val) => {
    localStorage.setItem('github-onboarded', String(val));
    set({ onboarded: val });
  },

  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  notificationsCount: 3,
  clearNotifications: () => set({ notificationsCount: 0 }),

  starredRepos: {
    'facebook/react': true,
    'shadcn/ui': true,
  },
  toggleStarRepo: (repoKey: string) => set((state) => ({
    starredRepos: {
      ...state.starredRepos,
      [repoKey]: !state.starredRepos[repoKey],
    },
  })),

  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),

  // Guided tour
  tourActive: false,
  tourStep: 0,
  startTour: () => set({ tourActive: true, tourStep: 0 }),
  nextTourStep: () => set((state) => {
    const next = state.tourStep + 1;
    if (next >= TOUR_STEPS.length) {
      return { tourActive: false, tourStep: 0 };
    }
    return { tourStep: next };
  }),
  prevTourStep: () => set((state) => ({
    tourStep: Math.max(0, state.tourStep - 1),
  })),
  endTour: () => set({ tourActive: false, tourStep: 0 }),
  jumpTourStep: (idx) => set({ tourStep: Math.max(0, Math.min(idx, TOUR_STEPS.length - 1)), tourActive: true }),
}));
