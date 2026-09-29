#!/usr/bin/env node

/**
 * Adversarial Routing & Deep-Link Test Harness
 * 
 * Verifies:
 * 1. All 10 Core Navbar Routes (/pulls, /issues, /codespaces, /marketplace, /explore,
 *    /workspace, /discussions, /projects, /packages, /repositories)
 * 2. Single-segment profile routing (/:user like /shadcn, /torvalds, /user-123)
 * 3. Route collisions & static route precedence (including /launch, /brand vs /:user)
 * 4. Wildcard fallback for unknown routes (path="*")
 * 5. Edge cases: Trailing slashes, deep links, blob splat routes, query parameters, malformed paths
 */

const fs = require('fs');
const path = require('path');
const { matchRoutes } = require('react-router');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

let passed = 0;
let failed = 0;
const results = [];

function assertTest(name, condition, details = '') {
  if (condition) {
    passed++;
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
    results.push({ name, status: 'PASS', details });
  } else {
    failed++;
    console.log(`  ${colors.red}✗${colors.reset} ${name}${details ? ': ' + details : ''}`);
    results.push({ name, status: 'FAIL', details });
  }
}

// 1. Parse routes from src/App.tsx directly to ensure fidelity to actual codebase
const appCode = fs.readFileSync(path.join(SRC_DIR, 'App.tsx'), 'utf-8');
const routeRegex = /<Route\s+path="([^"]+)"\s+element=\{<([^ />]+)/g;
const declaredRoutes = [];
let match;
while ((match = routeRegex.exec(appCode)) !== null) {
  declaredRoutes.push({ path: match[1], component: match[2] });
}

console.log(`\n${colors.bold}${colors.cyan}======================================================================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}  Adversarial Routing & Deep-Link Empirical Test Suite${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}======================================================================${colors.reset}\n`);

console.log(`${colors.yellow}▶ SECTION 1: Route Declarations & Precedence in src/App.tsx${colors.reset}`);

// Check all 10 core routes exist in App.tsx
const CORE_10_ROUTES = [
  { path: '/pulls', component: 'PullsPage' },
  { path: '/issues', component: 'IssuesPage' },
  { path: '/codespaces', component: 'CodespacesPage' },
  { path: '/marketplace', component: 'MarketplacePage' },
  { path: '/explore', component: 'ExplorePage' },
  { path: '/workspace', component: 'WorkspacePage' },
  { path: '/discussions', component: 'DiscussionsPage' },
  { path: '/projects', component: 'ProjectsPage' },
  { path: '/packages', component: 'PackagesPage' },
  { path: '/repositories', component: 'RepositoriesPage' },
];

CORE_10_ROUTES.forEach(route => {
  const found = declaredRoutes.find(r => r.path === route.path);
  assertTest(
    `[Route Declared] ${route.path} -> ${route.component}`,
    found && found.component === route.component,
    found ? `Found component ${found.component}` : 'Route not declared'
  );
});

// Check that PlaceholderPage is NOT used for any core route
CORE_10_ROUTES.forEach(route => {
  const found = declaredRoutes.find(r => r.path === route.path);
  assertTest(
    `[No Placeholder] ${route.path} does not use PlaceholderPage`,
    found && found.component !== 'PlaceholderPage',
    `Uses ${found ? found.component : 'none'}`
  );
});

// Check static precedence before /:user
const userRouteIdx = declaredRoutes.findIndex(r => r.path === '/:user');
assertTest(
  `[Precedence] /:user parameter route is present in declared routes`,
  userRouteIdx !== -1,
  `userRouteIdx = ${userRouteIdx}`
);

CORE_10_ROUTES.forEach(route => {
  const idx = declaredRoutes.findIndex(r => r.path === route.path);
  assertTest(
    `[Precedence] Core route ${route.path} declared before /:user`,
    idx !== -1 && idx < userRouteIdx,
    `Index: ${idx} vs /:user Index: ${userRouteIdx}`
  );
});

// Check other static routes in App.tsx
['/launch', '/brand'].forEach(sp => {
  const idx = declaredRoutes.findIndex(r => r.path === sp);
  assertTest(
    `[Route Declared] Static auxiliary route ${sp} is declared`,
    idx !== -1,
    `Declared at index ${idx}`
  );
});

console.log(`\n${colors.yellow}▶ SECTION 2: React Router Empirical Route Resolution (${declaredRoutes.length} declared routes)${colors.reset}`);

// Convert declared routes into react-router route definitions
const reactRouterRoutes = declaredRoutes.map(r => ({
  path: r.path,
  component: r.component
}));

// Test 10 Core Routes Resolution
CORE_10_ROUTES.forEach(r => {
  const matched = matchRoutes(reactRouterRoutes, r.path);
  const topMatch = matched && matched[0];
  assertTest(
    `[Core Resolution] ${r.path} resolves to ${r.component}`,
    topMatch && topMatch.route.component === r.component,
    `Resolved to ${topMatch ? topMatch.route.component : 'NONE'}`
  );
});

// Test Single-Segment Profile Routing (/:user)
const TEST_USERS = [
  'shadcn',
  'torvalds',
  'gaearon',
  'sophiebits',
  'user-with-hyphens',
  'user_with_underscore',
  'user.with.dot',
  '12345'
];

TEST_USERS.forEach(u => {
  const p = `/${u}`;
  const matched = matchRoutes(reactRouterRoutes, p);
  const topMatch = matched && matched[0];
  assertTest(
    `[Profile Route] ${p} resolves to ProfilePage with :user="${u}"`,
    topMatch && topMatch.route.component === 'ProfilePage' && topMatch.params.user === u,
    `Matched: ${topMatch ? topMatch.route.component : 'NONE'}, params: ${JSON.stringify(topMatch ? topMatch.params : {})}`
  );
});

// Test Route Collision Immunity: Static routes vs /:user
console.log(`\n${colors.yellow}▶ SECTION 3: Route Collision Stress-Testing (Static vs Parametric Capture)${colors.reset}`);

const STATIC_COLLISION_CANDIDATES = [
  { path: '/pulls', expected: 'PullsPage' },
  { path: '/issues', expected: 'IssuesPage' },
  { path: '/codespaces', expected: 'CodespacesPage' },
  { path: '/marketplace', expected: 'MarketplacePage' },
  { path: '/explore', expected: 'ExplorePage' },
  { path: '/workspace', expected: 'WorkspacePage' },
  { path: '/discussions', expected: 'DiscussionsPage' },
  { path: '/projects', expected: 'ProjectsPage' },
  { path: '/packages', expected: 'PackagesPage' },
  { path: '/repositories', expected: 'RepositoriesPage' },
  { path: '/launch', expected: 'LaunchPage' },
  { path: '/brand', expected: 'BrandPage' },
];

STATIC_COLLISION_CANDIDATES.forEach(c => {
  const matched = matchRoutes(reactRouterRoutes, c.path);
  const topMatch = matched && matched[0];
  assertTest(
    `[Collision Immunity] ${c.path} NOT captured by /:user (resolves to ${c.expected})`,
    topMatch && topMatch.route.component === c.expected && topMatch.route.path === c.path,
    `Resolved to ${topMatch ? topMatch.route.component + ' (' + topMatch.route.path + ')' : 'NONE'}`
  );
});

// Test Deep-Link Routes
console.log(`\n${colors.yellow}▶ SECTION 4: Deep Links & Splat Route Resolution${colors.reset}`);

const DEEP_LINKS = [
  { path: '/facebook/react', expected: 'RepoPage', params: { owner: 'facebook', repo: 'react' } },
  { path: '/shadcn/ui', expected: 'RepoPage', params: { owner: 'shadcn', repo: 'ui' } },
  { path: '/facebook/react/pull/28271', expected: 'PRPage', params: { owner: 'facebook', repo: 'react', id: '28271' } },
  { path: '/facebook/react/pull/28271/changes', expected: 'PRFilesPage', params: { owner: 'facebook', repo: 'react', id: '28271' } },
  { path: '/facebook/react/suggest', expected: 'SuggestPage', params: { owner: 'facebook', repo: 'react' } },
  { path: '/facebook/react/blob/main/packages/react/index.js', expected: 'BlobPage', params: { owner: 'facebook', repo: 'react', '*': 'main/packages/react/index.js' } },
  { path: '/facebook/react/blob/README.md', expected: 'BlobPage', params: { owner: 'facebook', repo: 'react', '*': 'README.md' } },
  { path: '/facebook/react/blob/deeply/nested/directory/structure/file.tsx', expected: 'BlobPage', params: { owner: 'facebook', repo: 'react', '*': 'deeply/nested/directory/structure/file.tsx' } },
];

DEEP_LINKS.forEach(dl => {
  const matched = matchRoutes(reactRouterRoutes, dl.path);
  const topMatch = matched && matched[0];
  const paramsMatch = topMatch && Object.keys(dl.params).every(k => topMatch.params[k] === dl.params[k]);
  assertTest(
    `[Deep Link] ${dl.path} -> ${dl.expected}`,
    topMatch && topMatch.route.component === dl.expected && paramsMatch,
    `Resolved: ${topMatch ? topMatch.route.component : 'NONE'}, params: ${JSON.stringify(topMatch ? topMatch.params : {})}`
  );
});

// Test Trailing Slash Edge Cases
console.log(`\n${colors.yellow}▶ SECTION 5: Trailing Slash Canonicalization & Tolerance${colors.reset}`);

const TRAILING_SLASH_TESTS = [
  { path: '/issues/', expectedComponent: 'IssuesPage' },
  { path: '/pulls/', expectedComponent: 'PullsPage' },
  { path: '/codespaces/', expectedComponent: 'CodespacesPage' },
  { path: '/marketplace/', expectedComponent: 'MarketplacePage' },
  { path: '/explore/', expectedComponent: 'ExplorePage' },
  { path: '/workspace/', expectedComponent: 'WorkspacePage' },
  { path: '/discussions/', expectedComponent: 'DiscussionsPage' },
  { path: '/projects/', expectedComponent: 'ProjectsPage' },
  { path: '/packages/', expectedComponent: 'PackagesPage' },
  { path: '/repositories/', expectedComponent: 'RepositoriesPage' },
  { path: '/shadcn/', expectedComponent: 'ProfilePage' },
  { path: '/launch/', expectedComponent: 'LaunchPage' },
  { path: '/brand/', expectedComponent: 'BrandPage' },
  { path: '/facebook/react/', expectedComponent: 'RepoPage' },
  { path: '/facebook/react/pull/28271/', expectedComponent: 'PRPage' },
  { path: '/facebook/react/pull/28271/changes/', expectedComponent: 'PRFilesPage' },
];

TRAILING_SLASH_TESTS.forEach(t => {
  const matched = matchRoutes(reactRouterRoutes, t.path);
  const topMatch = matched && matched[0];
  assertTest(
    `[Trailing Slash] ${t.path} matches ${t.expectedComponent}`,
    topMatch && topMatch.route.component === t.expectedComponent,
    `Resolved: ${topMatch ? topMatch.route.component : 'NONE'}`
  );
});

// Test Query Parameters
console.log(`\n${colors.yellow}▶ SECTION 6: Query Parameter Permutations${colors.reset}`);

const QUERY_PARAM_TESTS = [
  { path: '/issues?q=is:open+is:issue', expectedComponent: 'IssuesPage' },
  { path: '/issues?state=closed&label=bug', expectedComponent: 'IssuesPage' },
  { path: '/pulls?q=is:pr+is:open', expectedComponent: 'PullsPage' },
  { path: '/explore?since=daily&spoken_language_code=en', expectedComponent: 'ExplorePage' },
  { path: '/marketplace?category=ai&sort=stars', expectedComponent: 'MarketplacePage' },
  { path: '/shadcn?tab=repositories', expectedComponent: 'ProfilePage' },
  { path: '/shadcn?tab=overview&view=pinned', expectedComponent: 'ProfilePage' },
  { path: '/facebook/react?branch=main', expectedComponent: 'RepoPage' },
  { path: '/facebook/react/pull/28271?diff=unified&w=1', expectedComponent: 'PRPage' },
];

QUERY_PARAM_TESTS.forEach(qp => {
  // react-router matchRoutes operates on pathname
  const url = new URL('http://localhost' + qp.path);
  const matched = matchRoutes(reactRouterRoutes, url.pathname);
  const topMatch = matched && matched[0];
  assertTest(
    `[Query Params] ${qp.path} pathname resolves to ${qp.expectedComponent}`,
    topMatch && topMatch.route.component === qp.expectedComponent,
    `Resolved: ${topMatch ? topMatch.route.component : 'NONE'}`
  );
});

// Test Wildcard Fallbacks
console.log(`\n${colors.yellow}▶ SECTION 7: Wildcard Fallback (* -> PlaceholderPage)${colors.reset}`);

const WILDCARD_TESTS = [
  '/nonexistent/extra/deep/path',
  '/foo/bar/baz',
  '/issues/nonexistent/subroute',
  '/pulls/123/unsupported',
  '/explore/trending/subtopic/deep',
  '/random/unknown/route/test/123',
  '/404/not/found'
];

WILDCARD_TESTS.forEach(wp => {
  const matched = matchRoutes(reactRouterRoutes, wp);
  const topMatch = matched && matched[0];
  assertTest(
    `[Wildcard Fallback] ${wp} routes to PlaceholderPage`,
    topMatch && topMatch.route.component === 'PlaceholderPage' && topMatch.route.path === '*',
    `Matched: ${topMatch ? topMatch.route.component + ' (' + topMatch.route.path + ')' : 'NONE'}`
  );
});

// Summary
console.log(`\n${colors.bold}${colors.cyan}======================================================================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}  TEST SUMMARY: ${passed} Passed | ${failed} Failed${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}======================================================================${colors.reset}\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log(`${colors.green}All routing assertions passed successfully!${colors.reset}\n`);
}
