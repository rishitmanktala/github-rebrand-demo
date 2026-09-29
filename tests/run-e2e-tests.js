#!/usr/bin/env node

/**
 * E2E & Integrity Test Suite for Cyfernode Alt (GitHub Rebrand Concept Demo)
 * 
 * Coverage: Tiers 1 - 4
 * - Tier 1: Feature Coverage (Static AST & Grep Audits: Routes, PlaceholderPage elimination, Mock Data fixtures)
 * - Tier 2: Boundary & Corner Cases (Static route precedence before /:user, Zustand store contract)
 * - Tier 3: Interactivity & Button Audit (Zero generic toasts, zero browser alerts, zero empty click handlers)
 * - Tier 4: Dual-Lens & Component Verification (Page components existence, dual-lens integration, build check)
 *
 * Usage:
 *   node tests/run-e2e-tests.js
 *   node tests/run-e2e-tests.js --tier=1
 *   node tests/run-e2e-tests.js --skip-build
 *   node tests/run-e2e-tests.js --bail
 *   node tests/run-e2e-tests.js --json
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ts = require('typescript');

// --- ANSI Colors ---
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

// --- CLI Arguments Parsing ---
const args = process.argv.slice(2);
const options = {
  tier: null,       // e.g. '1', '2', '3', '4'
  bail: false,      // Stop at first failure
  skipBuild: false, // Skip npm run build in Tier 4
  json: false,      // Print machine-readable JSON output
  verbose: false,   // Verbose logs
};

for (const arg of args) {
  if (arg.startsWith('--tier=')) {
    options.tier = arg.split('=')[1];
  } else if (arg === '--bail') {
    options.bail = true;
  } else if (arg === '--skip-build') {
    options.skipBuild = true;
  } else if (arg === '--json') {
    options.json = true;
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true;
  }
}

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// --- Required Entities Specification ---
const REQUIRED_CORE_ROUTES = [
  { path: '/issues', component: 'IssuesPage' },
  { path: '/codespaces', component: 'CodespacesPage' },
  { path: '/marketplace', component: 'MarketplacePage' },
  { path: '/explore', component: 'ExplorePage' },
  { path: '/workspace', component: 'WorkspacePage' },
  { path: '/discussions', component: 'DiscussionsPage' },
  { path: '/projects', component: 'ProjectsPage' },
  { path: '/packages', component: 'PackagesPage' },
  { path: '/pulls', component: 'PullsPage' },
  { path: '/repositories', component: 'RepositoriesPage' },
];

const REQUIRED_DATA_FIXTURES = [
  {
    filename: 'issues.json',
    validate: (data) => {
      const issues = Array.isArray(data) ? data : data.issues;
      if (!Array.isArray(issues) || issues.length === 0) return 'Must contain non-empty array of issues';
      const first = issues[0];
      if (!first.title || first.number === undefined) return 'Issue items must contain title and number';
      return null;
    }
  },
  {
    filename: 'codespaces.json',
    validate: (data) => {
      const cs = Array.isArray(data) ? data : (data.codespaces || data.templates);
      if (!Array.isArray(cs) || cs.length === 0) return 'Must contain non-empty array of codespaces or templates';
      return null;
    }
  },
  {
    filename: 'marketplace.json',
    validate: (data) => {
      const items = Array.isArray(data) ? data : (data.items || data.categories);
      if (!Array.isArray(items) || items.length === 0) return 'Must contain non-empty array of items or categories';
      return null;
    }
  },
  {
    filename: 'explore.json',
    validate: (data) => {
      const trending = Array.isArray(data) ? data : (data.trending || data.collections);
      if (!Array.isArray(trending) || trending.length === 0) return 'Must contain non-empty array of trending repos or collections';
      return null;
    }
  },
  {
    filename: 'workspace.json',
    validate: (data) => {
      const sessions = Array.isArray(data) ? data : (data.activeSessions || data.pinnedProjects || data.activityFeed);
      if (!Array.isArray(sessions) || sessions.length === 0) return 'Must contain non-empty array of sessions or activity';
      return null;
    }
  },
  {
    filename: 'discussions.json',
    validate: (data) => {
      const disc = Array.isArray(data) ? data : (data.discussions || data.categories);
      if (!Array.isArray(disc) || disc.length === 0) return 'Must contain non-empty array of discussions or categories';
      return null;
    }
  },
  {
    filename: 'projects.json',
    validate: (data) => {
      const proj = Array.isArray(data) ? data : (data.projects || data.columns);
      if (!Array.isArray(proj) || proj.length === 0) return 'Must contain non-empty array of projects or columns';
      return null;
    }
  },
  {
    filename: 'packages.json',
    validate: (data) => {
      const pkgs = Array.isArray(data) ? data : data.packages;
      if (!Array.isArray(pkgs) || pkgs.length === 0) return 'Must contain non-empty array of packages';
      return null;
    }
  },
  {
    filename: 'pulls.json',
    validate: (data) => {
      const pulls = Array.isArray(data) ? data : data.pulls;
      if (!Array.isArray(pulls) || pulls.length === 0) return 'Must contain non-empty array of pull requests';
      return null;
    }
  },
  {
    filename: 'repositories.json',
    validate: (data) => {
      const repos = Array.isArray(data) ? data : data.repositories;
      if (!Array.isArray(repos) || repos.length === 0) return 'Must contain non-empty array of repositories';
      return null;
    }
  }
];

const REQUIRED_PAGES = [
  'IssuesPage.tsx',
  'CodespacesPage.tsx',
  'MarketplacePage.tsx',
  'ExplorePage.tsx',
  'WorkspacePage.tsx',
  'DiscussionsPage.tsx',
  'ProjectsPage.tsx',
  'PackagesPage.tsx',
  'PullsPage.tsx',
  'RepositoriesPage.tsx'
];

// --- AST Helper Functions ---
function parseSourceFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const isTsx = filePath.endsWith('.tsx');
  return {
    sourceFile: ts.createSourceFile(
      path.basename(filePath),
      content,
      ts.ScriptTarget.Latest,
      true,
      isTsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    ),
    content
  };
}

function extractRoutesFromAppTsx(appTsxPath) {
  const { sourceFile, content } = parseSourceFile(appTsxPath);
  const routes = [];

  function visit(node) {
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const tagName = node.tagName.getText(sourceFile);
      if (tagName === 'Route') {
        let pathAttr = null;
        let elementAttr = null;

        for (const prop of node.attributes.properties) {
          if (ts.isJsxAttribute(prop)) {
            const attrName = prop.name.getText(sourceFile);
            if (attrName === 'path') {
              if (prop.initializer) {
                if (ts.isStringLiteral(prop.initializer)) {
                  pathAttr = prop.initializer.text;
                } else {
                  pathAttr = prop.initializer.getText(sourceFile).replace(/^[{'"]|['"}]$/g, '');
                }
              }
            } else if (attrName === 'element') {
              if (prop.initializer) {
                elementAttr = prop.initializer.getText(sourceFile);
              }
            }
          }
        }

        const startPos = node.getStart(sourceFile);
        const { line } = sourceFile.getLineAndCharacterOfPosition(startPos);
        routes.push({
          path: pathAttr,
          element: elementAttr,
          line: line + 1,
          startPos
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { routes, sourceFile, content };
}

function extractImports(sourceFile) {
  const imports = [];
  for (const stmt of sourceFile.statements) {
    if (ts.isImportDeclaration(stmt)) {
      const moduleSpecifier = stmt.moduleSpecifier.text;
      const defaultImport = stmt.importClause?.name?.text;
      const namedImports = [];
      if (stmt.importClause?.namedBindings && ts.isNamedImports(stmt.importClause.namedBindings)) {
        stmt.importClause.namedBindings.elements.forEach((el) => {
          namedImports.push(el.name.text);
        });
      }
      imports.push({ moduleSpecifier, defaultImport, namedImports });
    }
  }
  return imports;
}

function getAllSourceFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        results = results.concat(getAllSourceFiles(fullPath, extensions));
      }
    } else {
      if (extensions.some(ext => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

// --- Test Harness Engine ---
class TestHarness {
  constructor(opts) {
    this.opts = opts;
    this.tests = [];
    this.results = [];
    this.currentTier = null;
  }

  registerTest(id, tier, name, fn) {
    this.tests.push({ id, tier: String(tier), name, fn });
  }

  async run() {
    const startTime = Date.now();
    const filterTier = this.opts.tier ? String(this.opts.tier) : null;
    const testsToRun = filterTier 
      ? this.tests.filter(t => t.tier === filterTier)
      : this.tests;

    if (!this.opts.json) {
      console.log(`\n${colors.bold}${colors.cyan}======================================================================${colors.reset}`);
      console.log(`${colors.bold}${colors.cyan}  Cyfernode Alt — Automated E2E & Integrity Test Harness${colors.reset}`);
      console.log(`${colors.cyan}======================================================================${colors.reset}`);
      console.log(`${colors.gray}Environment: Node ${process.version} | Target: ${ROOT_DIR}${colors.reset}`);
      if (filterTier) {
        console.log(`${colors.yellow}Filter: Running Tier ${filterTier} tests only${colors.reset}`);
      }
      console.log('');
    }

    let currentPrintedTier = null;

    for (const test of testsToRun) {
      if (!this.opts.json && test.tier !== currentPrintedTier) {
        currentPrintedTier = test.tier;
        console.log(`${colors.bold}${colors.magenta}▶ TIER ${currentPrintedTier}: ${this.getTierTitle(currentPrintedTier)}${colors.reset}`);
      }

      const tStart = Date.now();
      let passed = false;
      let error = null;

      try {
        await test.fn();
        passed = true;
      } catch (err) {
        passed = false;
        error = err;
      }

      const durationMs = Date.now() - tStart;
      this.results.push({
        id: test.id,
        tier: test.tier,
        name: test.name,
        passed,
        durationMs,
        error: error ? { message: error.message, stack: error.stack } : null
      });

      if (!this.opts.json) {
        if (passed) {
          console.log(`  ${colors.green}✓${colors.reset} ${colors.gray}[${test.id}]${colors.reset} ${test.name} ${colors.dim}(${durationMs}ms)${colors.reset}`);
        } else {
          console.log(`  ${colors.red}✗${colors.reset} ${colors.bold}${colors.red}[${test.id}]${colors.reset} ${test.name} ${colors.dim}(${durationMs}ms)${colors.reset}`);
          console.log(`    ${colors.red}Error: ${error.message}${colors.reset}`);
          if (this.opts.verbose && error.stack) {
            console.log(`${colors.dim}${error.stack.split('\n').slice(1, 4).join('\n')}${colors.reset}`);
          }
        }
      }

      if (!passed && this.opts.bail) {
        if (!this.opts.json) {
          console.log(`\n${colors.yellow}Execution halted due to --bail flag.${colors.reset}`);
        }
        break;
      }
    }

    const totalDurationMs = Date.now() - startTime;
    return this.finish(totalDurationMs);
  }

  getTierTitle(tier) {
    switch (tier) {
      case '1': return 'Feature Coverage (Static AST & Grep Audits)';
      case '2': return 'Boundary & Corner Cases (Precedence & Store Contract)';
      case '3': return 'Interactivity & Button Audit (Zero Generic Toasts & Alerts)';
      case '4': return 'Dual-Lens & Component Verification';
      default: return `Tier ${tier}`;
    }
  }

  finish(totalDurationMs) {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;

    if (this.opts.json) {
      console.log(JSON.stringify({
        summary: { total, passed, failed, durationMs: totalDurationMs },
        results: this.results
      }, null, 2));
      return failed === 0 ? 0 : 1;
    }

    console.log(`\n${colors.bold}${colors.cyan}======================================================================${colors.reset}`);
    console.log(`${colors.bold}  TEST SUITE EXECUTION SUMMARY${colors.reset}`);
    console.log(`${colors.cyan}======================================================================${colors.reset}`);

    const tiers = ['1', '2', '3', '4'];
    for (const t of tiers) {
      const tierResults = this.results.filter(r => r.tier === t);
      if (tierResults.length === 0) continue;
      const tPassed = tierResults.filter(r => r.passed).length;
      const tFailed = tierResults.length - tPassed;
      const statusColor = tFailed === 0 ? colors.green : colors.red;
      console.log(`  Tier ${t} (${this.getTierTitle(t)}): ${statusColor}${tPassed}/${tierResults.length} Passed${colors.reset}${tFailed > 0 ? ` (${tFailed} Failed)` : ''}`);
    }

    console.log(`${colors.gray}----------------------------------------------------------------------${colors.reset}`);
    const overallColor = failed === 0 ? `${colors.bold}${colors.green}` : `${colors.bold}${colors.red}`;
    console.log(`  Total: ${overallColor}${passed}/${total} Tests Passed${colors.reset} | Failed: ${failed} | Duration: ${(totalDurationMs / 1000).toFixed(2)}s`);

    if (failed === 0) {
      console.log(`\n${colors.bold}${colors.green}🎉 ALL E2E AND INTEGRITY TESTS PASSED!${colors.reset}\n`);
      return 0;
    } else {
      console.log(`\n${colors.bold}${colors.red}❌ SOME TESTS FAILED. See detailed diagnostics above.${colors.reset}\n`);
      return 1;
    }
  }
}

// Instantiate Runner
const harness = new TestHarness(options);

// ============================================================================
// TIER 1: FEATURE COVERAGE (Static AST & Grep Audits)
// ============================================================================

// T1.1: Core Routes existence in App.tsx
for (const route of REQUIRED_CORE_ROUTES) {
  harness.registerTest(`T1.1-${route.path.substring(1)}`, 1, `Static route for ${route.path} is defined in src/App.tsx`, () => {
    const appTsxPath = path.join(SRC_DIR, 'App.tsx');
    const { routes } = extractRoutesFromAppTsx(appTsxPath);
    const match = routes.find(r => r.path === route.path);
    if (!match) {
      const foundPaths = routes.map(r => r.path).join(', ');
      throw new Error(`Route "${route.path}" not found in src/App.tsx. Found routes: [${foundPaths}]`);
    }
  });
}

// T1.2: Core Routes do NOT point to PlaceholderPage
for (const route of REQUIRED_CORE_ROUTES) {
  harness.registerTest(`T1.2-${route.path.substring(1)}`, 1, `Route ${route.path} does not render PlaceholderPage`, () => {
    const appTsxPath = path.join(SRC_DIR, 'App.tsx');
    const { routes } = extractRoutesFromAppTsx(appTsxPath);
    const match = routes.find(r => r.path === route.path);
    if (!match) {
      throw new Error(`Route "${route.path}" not found in src/App.tsx`);
    }
    if (match.element && match.element.includes('PlaceholderPage')) {
      throw new Error(`Route "${route.path}" still uses PlaceholderPage at line ${match.line}: ${match.element}`);
    }
    if (match.element && !match.element.includes(route.component)) {
      throw new Error(`Route "${route.path}" expected component <${route.component} />, but got: ${match.element}`);
    }
  });
}

// T1.3: PlaceholderPage is strictly reserved for wildcard route
harness.registerTest('T1.3-placeholder-wildcard', 1, 'PlaceholderPage is strictly reserved for wildcard route path="*"', () => {
  const appTsxPath = path.join(SRC_DIR, 'App.tsx');
  const { routes } = extractRoutesFromAppTsx(appTsxPath);
  const placeholderRoutes = routes.filter(r => r.element && r.element.includes('PlaceholderPage'));
  for (const r of placeholderRoutes) {
    if (r.path !== '*') {
      throw new Error(`PlaceholderPage used for non-wildcard route "${r.path}" at line ${r.line}`);
    }
  }
});

// T1.4: App.tsx imports all 10 page components
harness.registerTest('T1.4-app-imports', 1, 'src/App.tsx imports all 10 dedicated page components', () => {
  const appTsxPath = path.join(SRC_DIR, 'App.tsx');
  const { sourceFile } = parseSourceFile(appTsxPath);
  const imports = extractImports(sourceFile);
  const importedNames = new Set();
  imports.forEach(i => {
    if (i.defaultImport) importedNames.add(i.defaultImport);
    i.namedImports.forEach(n => importedNames.add(n));
  });

  const missing = [];
  for (const route of REQUIRED_CORE_ROUTES) {
    if (!importedNames.has(route.component)) {
      missing.push(route.component);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing component imports in App.tsx: ${missing.join(', ')}`);
  }
});

// T1.5 & T1.6: 10 Mock Data Fixtures existence, parsing, and semantic validation
for (const fixture of REQUIRED_DATA_FIXTURES) {
  harness.registerTest(`T1.5-${fixture.filename}`, 1, `Mock fixture src/data/${fixture.filename} exists and parses as valid JSON`, () => {
    const filePath = path.join(SRC_DIR, 'data', fixture.filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Fixture file does not exist: src/data/${fixture.filename}`);
    }
    const stat = fs.statSync(filePath);
    if (stat.size < 50) {
      throw new Error(`Fixture file is too small or empty (${stat.size} bytes): src/data/${fixture.filename}`);
    }

    let parsed;
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new Error(`Failed to parse src/data/${fixture.filename}: ${e.message}`);
    }

    const validationError = fixture.validate(parsed);
    if (validationError) {
      throw new Error(`Semantic validation failed for src/data/${fixture.filename}: ${validationError}`);
    }
  });
}

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (Precedence & Store Contract)
// ============================================================================

// T2.1: Route Precedence before /:user
harness.registerTest('T2.1-route-precedence', 2, 'All core static routes appear before /:user parameter route in App.tsx', () => {
  const appTsxPath = path.join(SRC_DIR, 'App.tsx');
  const { routes } = extractRoutesFromAppTsx(appTsxPath);

  const userRouteIndex = routes.findIndex(r => r.path === '/:user');
  if (userRouteIndex === -1) {
    // If no /:user route exists, precedence is trivial or modified
    return;
  }

  const violations = [];
  for (const req of REQUIRED_CORE_ROUTES) {
    const routeIndex = routes.findIndex(r => r.path === req.path);
    if (routeIndex === -1) {
      violations.push(`Route ${req.path} not found`);
    } else if (routeIndex > userRouteIndex) {
      violations.push(`Route "${req.path}" (line ${routes[routeIndex].line}) is declared AFTER "/:user" (line ${routes[userRouteIndex].line})`);
    }
  }

  if (violations.length > 0) {
    throw new Error(`Route precedence violation:\n      - ${violations.join('\n      - ')}`);
  }
});

// T2.2: Zustand Store Contract in src/store.ts
harness.registerTest('T2.2-store-contract', 2, 'src/store.ts satisfies AppState interface contract and exports useAppStore', () => {
  const storePath = path.join(SRC_DIR, 'store.ts');
  if (!fs.existsSync(storePath)) {
    throw new Error('src/store.ts does not exist');
  }

  const { content, sourceFile } = parseSourceFile(storePath);

  // Check required export useAppStore
  const hasUseAppStore = content.includes('export const useAppStore =') || content.includes('export function useAppStore');
  if (!hasUseAppStore) {
    throw new Error('src/store.ts does not export useAppStore');
  }

  // Check required state keys in store definition
  const requiredKeys = [
    'lens',
    'setLens',
    'toggleLens',
    'onboarded',
    'setOnboarded',
    'toasts',
    'addToast',
    'removeToast',
    'notificationsCount',
    'clearNotifications',
    'starredRepos',
    'toggleStarRepo',
    'activeModal',
    'setActiveModal'
  ];

  const missingKeys = [];
  for (const key of requiredKeys) {
    // Check if key is declared as property or method
    const regex = new RegExp(`\\b${key}\\b\\s*[:(]`);
    if (!regex.test(content)) {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length > 0) {
    throw new Error(`src/store.ts is missing required contract keys: ${missingKeys.join(', ')}`);
  }
});

// ============================================================================
// TIER 3: INTERACTIVITY & BUTTON AUDIT (Generic Toasts, Alerts, Empty Handlers)
// ============================================================================

// T3.1: Zero Generic Toasts
harness.registerTest('T3.1-generic-toasts', 3, 'Zero instances of generic placeholder toasts across codebase', () => {
  const sourceFiles = getAllSourceFiles(SRC_DIR);
  const genericPatterns = [
    /addToast\s*\(\s*['"]Feature not available/i,
    /addToast\s*\(\s*['"]Coming soon/i,
    /addToast\s*\(\s*['"]Not implemented/i,
    /addToast\s*\(\s*['"]TODO/i
  ];

  const violations = [];

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      // Ignore comments
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

      for (const pattern of genericPatterns) {
        if (pattern.test(line)) {
          const relPath = path.relative(ROOT_DIR, file);
          violations.push(`${relPath}:${idx + 1}: ${trimmed}`);
        }
      }
    });
  }

  if (violations.length > 0) {
    throw new Error(`Generic placeholder toast detected in ${violations.length} location(s):\n      - ${violations.join('\n      - ')}`);
  }
});

// T3.2: Zero Browser Alerts
harness.registerTest('T3.2-browser-alerts', 3, 'Zero instances of native window.alert() in src/ components', () => {
  const sourceFiles = getAllSourceFiles(SRC_DIR);
  const violations = [];

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

      // Match window.alert or alert(...) but not alertDescription or similar identifier
      if (/\b(?:window\.)?alert\s*\([^)]*\)/.test(line)) {
        const relPath = path.relative(ROOT_DIR, file);
        violations.push(`${relPath}:${idx + 1}: ${trimmed}`);
      }
    });
  }

  if (violations.length > 0) {
    throw new Error(`Native browser alert() call detected in ${violations.length} location(s):\n      - ${violations.join('\n      - ')}`);
  }
});

// T3.3: Zero Empty Click Handlers
harness.registerTest('T3.3-empty-click-handlers', 3, 'Zero empty onClick={() => {}} handlers across src/ components', () => {
  const sourceFiles = getAllSourceFiles(SRC_DIR);
  const emptyHandlerRegexes = [
    /onClick\s*=\s*\{\s*(?:\(\s*.*?\s*\)|[a-zA-Z0-9_]+)\s*=>\s*\{\s*\}\s*\}/,
    /onClick\s*=\s*\{\s*(?:\(\s*.*?\s*\)|[a-zA-Z0-9_]+)\s*=>\s*undefined\s*\}/,
    /onClick\s*=\s*\{\s*(?:\(\s*.*?\s*\)|[a-zA-Z0-9_]+)\s*=>\s*void\s+0\s*\}/
  ];

  const violations = [];

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

      for (const regex of emptyHandlerRegexes) {
        if (regex.test(line)) {
          const relPath = path.relative(ROOT_DIR, file);
          violations.push(`${relPath}:${idx + 1}: ${trimmed}`);
        }
      }
    });
  }

  if (violations.length > 0) {
    throw new Error(`Empty inert onClick handler detected in ${violations.length} location(s):\n      - ${violations.join('\n      - ')}`);
  }
});

// ============================================================================
// TIER 4: DUAL-LENS & COMPONENT VERIFICATION
// ============================================================================

// T4.1: Page component files existence
for (const pageFile of REQUIRED_PAGES) {
  harness.registerTest(`T4.1-${pageFile}`, 4, `Component src/pages/${pageFile} exists on disk`, () => {
    const fullPath = path.join(SRC_DIR, 'pages', pageFile);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Page component file does not exist: src/pages/${pageFile}`);
    }
  });
}

// T4.2: Page component dual-lens integration & design tokens
for (const pageFile of REQUIRED_PAGES) {
  harness.registerTest(`T4.2-${pageFile}`, 4, `Page ${pageFile} connects to useAppStore and implements dual-lens styling`, () => {
    const fullPath = path.join(SRC_DIR, 'pages', pageFile);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Page component file does not exist: src/pages/${pageFile}`);
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    // Check store / lens connection
    const connectsToStore = content.includes('useAppStore') || content.includes('lens');
    if (!connectsToStore) {
      throw new Error(`Page ${pageFile} does not reference useAppStore or lens state`);
    }

    // Check conditional lens handling
    const branchesOnLens = content.includes("lens === 'studio'") ||
                           content.includes("lens === 'classic'") ||
                           content.includes('Classic') && content.includes('Studio');
    if (!branchesOnLens) {
      throw new Error(`Page ${pageFile} does not contain dual-lens branching ('classic' vs 'studio')`);
    }

    // Check presence of dual-lens styling tokens
    const hasClassicTokens = content.includes('font-classic') || content.includes('bg-canvas') || content.includes('text-paper') || content.includes('gray-800') || content.includes('gray-900');
    const hasStudioTokens = content.includes('font-people') || content.includes('font-display') || content.includes('bg-paper-warm') || content.includes('border-ink') || content.includes('studio-texture') || content.includes('shadow-[');

    if (!hasClassicTokens) {
      throw new Error(`Page ${pageFile} is missing Classic design system styling tokens (font-classic, bg-canvas, text-paper)`);
    }
    if (!hasStudioTokens) {
      throw new Error(`Page ${pageFile} is missing Studio design system styling tokens (font-people, bg-paper-warm, border-ink, shadow)`);
    }
  });
}

// T4.3: Production build verification (npm run build)
harness.registerTest('T4.3-production-build', 4, 'Production build (npm run build) completes with zero errors', () => {
  if (options.skipBuild) {
    if (!options.json) {
      console.log(`    ${colors.yellow}[SKIPPED] ${colors.gray}npm run build skipped via --skip-build${colors.reset}`);
    }
    return;
  }

  const buildResult = spawnSync('npm', ['run', 'build'], {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    shell: true,
  });

  if (buildResult.status !== 0) {
    const errorOutput = buildResult.stderr || buildResult.stdout;
    throw new Error(`npm run build failed with exit code ${buildResult.status}:\n${errorOutput.slice(-1000)}`);
  }

  const distHtml = path.join(ROOT_DIR, 'dist', 'index.html');
  if (!fs.existsSync(distHtml)) {
    throw new Error('dist/index.html was not generated after build');
  }
});

// Run test suite
harness.run().then((exitCode) => {
  process.exit(exitCode);
}).catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
