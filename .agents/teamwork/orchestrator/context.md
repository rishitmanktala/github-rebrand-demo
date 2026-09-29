# Context & Domain Notes

## Project Context
- Repository: `/Users/ritesh/Documents/Cyfernode_alt`
- Concept: React-based GitHub rebrand concept demo with dual-lens architecture (Classic vs Studio mode) using Zustand.
- Key requirements:
  - R1: Replace `PlaceholderPage` with distinct, sensible pages for navbar links: Issues, Codespaces, Marketplace, Explore, Workspace, Discussions, Projects, Packages, etc.
  - R2: Realistic static JSON mock data fixtures (like `repo.react.json`, `pr.28271.json`) to populate all new pages.
  - R3: Audit and replace generic fallback button handlers (`addToast('Feature not available...')` or empty `alert()`) with distinct observable actions (state updates, modals, navigation).
  - Mode toggle: Alt+M or header toggle works seamlessly across all pages.
  - Integrity mode: development. Zero tolerance for fake implementations.
