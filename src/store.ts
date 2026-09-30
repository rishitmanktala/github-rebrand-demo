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
    title: '👋 Welcome! Here\'s what this is',
    body: "GitHub is where millions of people store, share, and work on code together — think of it like Google Docs, but for software. This demo shows what a redesigned GitHub could look like. Press Next to take a quick look around.",
    target: null,
    route: '/react/react',
    lens: 'classic',
    placement: 'center',
  },
  {
    id: 'repo-classic',
    title: '📁 A Project Page — Dark Style',
    body: 'This is a project page for "React" — one of the world\'s most popular tools for building websites. You can see the files, how many people are watching it, and how many have "starred" it (like a bookmark). This is the classic dark look.',
    target: '[data-tour="repo-header"]',
    route: '/react/react',
    lens: 'classic',
    placement: 'bottom',
  },
  {
    id: 'lens-switcher',
    title: '🔄 Two Looks, Same Content',
    body: 'See those two buttons — Classic and Studio? They\'re like switching between dark mode and light mode, but much more than just colors. The content stays the same; only how it\'s presented changes. Try clicking "Peek" to see both side by side.',
    target: '[data-tour="lens-switcher"]',
    route: '/react/react',
    lens: 'classic',
    placement: 'bottom',
    mountAction: 'switch-to-classic',
  },
  {
    id: 'repo-studio',
    title: '🎨 The Same Page — Bright & Bold',
    body: 'Same project, totally different feel. The Studio look uses a warm paper background, bold borders, and bright colours — designed to feel more welcoming and less like staring at a terminal screen.',
    target: '[data-tour="repo-header"]',
    route: '/react/react',
    lens: 'studio',
    placement: 'bottom',
    mountAction: 'switch-to-studio',
  },
  {
    id: 'pr-conversation',
    title: '💬 Proposing a Change — Like a Suggestion Box',
    body: 'When someone wants to change the code, they don\'t just edit it directly — they submit a "suggestion" called a Pull Request. Others can review it, leave comments, approve or reject it. This page shows the full conversation around one real suggestion.',
    target: '[data-tour="pr-timeline"]',
    route: '/react/react/pull/28271',
    lens: 'studio',
    placement: 'right',
  },
  {
    id: 'pr-files',
    title: '🗂️ What Changed — Side by Side',
    body: 'This shows exactly what lines of code were added (green) or removed (red) in the suggestion. It\'s like Track Changes in Microsoft Word — you can see before and after at a glance.',
    target: '[data-tour="diff-toolbar"]',
    route: '/react/react/pull/28271/changes',
    lens: 'studio',
    placement: 'bottom',
  },
  {
    id: 'profile',
    title: '🧑‍💻 A Developer\'s Public Profile',
    body: 'Every GitHub user has a profile page that shows their work history. The coloured grid you see is a "contribution graph" — each square is a day, and darker squares mean more work was done that day. Click any square to see what happened.',
    target: '[data-tour="profile-graph"]',
    route: '/shadcn',
    lens: 'studio',
    placement: 'top',
  },
  {
    id: 'launch',
    title: '🚀 The Big Release — Shipped Like a PR',
    body: 'Here\'s the fun part: this entire rebrand concept was packaged as a GitHub "suggestion" (Pull Request) itself. There\'s a checklist, a before/after logo comparison you can drag, and a big green Merge button. Click it to see what happens when a release ships.',
    target: '[data-tour="merge-btn"]',
    route: '/launch',
    lens: 'studio',
    placement: 'left',
  },
  {
    id: 'brand',
    title: '🎯 The Design System Behind It All',
    body: 'Every colour, font size, and spacing rule in this redesign is documented here. Think of it as the style guide or rulebook — designers and engineers use it to make sure everything looks consistent across the whole product.',
    target: '[data-tour="brand-stepper"]',
    route: '/brand',
    lens: 'studio',
    placement: 'top',
  },
  {
    id: 'finish',
    title: '✅ You\'re all caught up!',
    body: "That's the whole concept. Now you can explore freely — click anything, star a project, flip between the two looks, or hit the big Merge button on the Launch page for a fun surprise. Everything is interactive and safe to click.",
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
