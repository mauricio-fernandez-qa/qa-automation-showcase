// Builds the QA dashboard published on GitHub Pages: KPIs, run history, flaky tests, requirement coverage and the
// QA pipeline board. History lives in the published site itself (history.json): each build reads the previous one
// and appends the current run, so no database is needed.
// Usage: node scripts/dashboard/build.mjs   (env: HISTORY_URL, RUN_URL, GIT_SHA; defaults work locally)
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RESULTS = 'results/results.json';
const K6_SUMMARY = 'results/k6-summary.json';
const REPORT_DIR = 'playwright-report';
const OUT = 'site';
const MAX_RUNS = 30;
const TEMPLATE = 'scripts/dashboard/template.html';
const TC_ID = /^(TC-[A-Z]+-\d{2}):/;

function readJson(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
}

async function previousHistory() {
  const url = process.env.HISTORY_URL;
  if (!url) return readJson(join(OUT, 'history.json')) ?? [];
  try {
    const response = await fetch(url);
    return response.ok ? await response.json() : [];
  } catch {
    return [];
  }
}

/** Flattens Playwright's nested suites into one entry per test and project. */
function collectTests(suites, out = []) {
  for (const suite of suites ?? []) {
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests ?? []) {
        const durationMs = (t.results ?? []).reduce((sum, r) => sum + (r.duration ?? 0), 0);
        out.push({
          id: spec.title.match(TC_ID)?.[1] ?? spec.title,
          title: spec.title.replace(TC_ID, '').trim(),
          project: t.projectName,
          status: t.status, // expected | unexpected | flaky | skipped
          durationMs,
        });
      }
    }
    collectTests(suite.suites, out);
  }
  return out;
}

function k6Metrics() {
  const summary = readJson(K6_SUMMARY);
  const metrics = summary?.metrics;
  if (!metrics) return null;
  return {
    p95Ms: metrics.http_req_duration?.['p(95)'] ?? null,
    errorRate: metrics.http_req_failed?.value ?? metrics.http_req_failed?.rate ?? null,
    requests: metrics.http_reqs?.count ?? null,
  };
}

/** Reads the requirement column of docs/test-cases.md: TC ID -> requirement, priority. */
function testCatalog() {
  const rows = readFileSync('docs/test-cases.md', 'utf8')
    .split('\n')
    .filter((l) => /^\| TC-/.test(l));
  return Object.fromEntries(
    rows.map((l) => {
      const [id, req, title, technique, level, priority] = l
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());
      return [id, { req, title, technique, level, priority }];
    }),
  );
}

function pipelines() {
  return readdirSync('pipeline')
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => readJson(join('pipeline', f)));
}

const results = readJson(RESULTS);
if (!results) throw new Error(`${RESULTS} not found: run the tests first (the json reporter writes it).`);

const tests = collectTests(results.suites);
const count = (status) => tests.filter((t) => t.status === status).length;
const run = {
  date: results.stats?.startTime ?? new Date().toISOString(),
  sha: (process.env.GIT_SHA ?? 'local').slice(0, 7),
  url: process.env.RUN_URL ?? null,
  passed: count('expected'),
  failed: count('unexpected'),
  flaky: count('flaky'),
  skipped: count('skipped'),
  durationMs: Math.round(results.stats?.duration ?? 0),
  perf: k6Metrics(),
  tests,
};

const history = [...(await previousHistory()), run].slice(-MAX_RUNS);
const data = { generatedAt: new Date().toISOString(), history, catalog: testCatalog(), pipelines: pipelines() };

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'history.json'), JSON.stringify(history));
const page = readFileSync(TEMPLATE, 'utf8').replace(
  /\/\*__DATA__\*\/\s*null/,
  JSON.stringify(data).replace(/</g, '\\u003c'),
);
writeFileSync(join(OUT, 'index.html'), page);
if (existsSync(REPORT_DIR)) cpSync(REPORT_DIR, join(OUT, 'report'), { recursive: true });

console.log(
  `Dashboard: ${OUT}/index.html (${history.length} runs; last: ${run.passed} passed, ${run.failed} failed, ${run.flaky} flaky)`,
);
