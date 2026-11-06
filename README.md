# QA Automation Showcase

[![CI](https://github.com/mauricio-fernandez-qa/qa-automation-showcase/actions/workflows/ci.yml/badge.svg)](https://github.com/mauricio-fernandez-qa/qa-automation-showcase/actions/workflows/ci.yml)
[![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2EAD33?logo=playwright)](https://playwright.dev)
[![k6](https://img.shields.io/badge/k6-performance-7D64FF?logo=k6)](https://k6.io)

End-to-end, API and performance tests for an online store, plus the **AI-assisted QA workflow** I use at work:
Claude Code agents that automate, review and investigate, with hooks that block any change that breaks the team's rules.

**Live test report:** https://mauricio-fernandez-qa.github.io/qa-automation-showcase/

The app under test is [Practice Software Testing](https://practicesoftwaretesting.com), a public demo store built for
test automation practice: catalog, cart, checkout with several payment methods, and a REST API.

## What is covered

| Suite       | Tool                       | What it checks                                                                         |
| ----------- | -------------------------- | -------------------------------------------------------------------------------------- |
| E2E         | Playwright + TypeScript    | Sign-in, search, cart totals, checkout with card and cash on delivery, card validation |
| API         | Playwright `request` + Zod | Response contracts, pagination, search, auth and access control                        |
| Performance | k6                         | Catalog API under load: p95 < 1.5 s, < 1% errors                                       |

19 test cases, all automated. Design and priorities in [docs/test-cases.md](docs/test-cases.md).

> **Note:** the demo site sits behind Cloudflare, which shows a bot check to GitHub runners on the "My account" page.
> That one test (TC-AUTH-01, tagged `@blocked-in-ci`) runs locally only. Sign-in is still covered in CI, because every
> checkout test signs in.

## How it is built

```
src/
  pages/      Page Object Model: locators and user actions, no assertions
  api/        API contracts (Zod schemas), endpoints, auth and buyable-product helpers
  data/       Shared test data, no constants copied into specs
  helpers/    Small utilities (price parsing)
  fixtures.ts Page objects injected into every test
tests/
  e2e/        UI tests, Arrange / Act / Assert
  api/        API tests
perf/         k6 load test
scripts/      Convention checker + Claude Code hook
.claude/      AI agents and hooks
```

- **Risk first**: checkout and payment get the most cases, because that is where a bug costs money.
- **Stable locators**: role, label, text or `data-test` id. No CSS classes, no XPath, no hard waits.
- **Contract tests**: a test fails if an API field disappears or changes type.
- **Quality gate in CI**: types, ESLint, Prettier and team conventions run before any test.

## AI-assisted QA workflow

The repo is maintained with [Claude Code](https://claude.com/claude-code). The point is not "AI writes tests", it is
**AI works inside the same rules a senior reviewer would enforce**:

| Piece                                                    | Role                                                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`test-automator`](.claude/agents/test-automator.md)     | Explores the real app, writes the page object and the test, runs it twice                  |
| [`rules-reviewer`](.claude/agents/rules-reviewer.md)     | Reviews every change against [CONVENTIONS.md](CONVENTIONS.md), by severity                 |
| [`bug-investigator`](.claude/agents/bug-investigator.md) | Takes a failure to its root cause and drafts the bug report with evidence                  |
| [Hooks](.claude/settings.json)                           | After every edit, lint + conventions run on the file; a session cannot end with violations |
| [CLAUDE.md](CLAUDE.md)                                   | The rules: explore before automating, never change an expected result to make a test pass  |

Every result still goes through a human review before it is merged.

## Run it

```bash
npm ci
npx playwright install chromium
cp .env.example .env

npm test              # API + E2E
npm run test:e2e      # E2E only
npm run test:api      # API only
npm run report        # open the HTML report
npm run check         # quality gate
k6 run perf/products-load.js
```

## About me

Mauricio Fernandez, QA Automation Engineer / SDET.
[LinkedIn](https://www.linkedin.com/in/mauricio-fernandez-qa/)
