# Rules for AI agents working in this repo

This repo is maintained with Claude Code. These rules apply to every agent and every change.

1. **Read `CONVENTIONS.md` before writing or changing a test, page object or helper.**
2. **Explore before automating.** Open the real app (Playwright MCP) and check the DOM, the flow and the network
   before writing a locator. Never guess a selector.
3. **One test = one test case.** Title `TC-AREA-NN: Verify|Validate ...`, listed in `docs/test-cases.md`.
4. **Fix in the page object, not test by test.** If a locator changes, it changes in one place.
5. **Never adjust an expected result to make a test pass.** A failing test is either a bug in the app (report it with
   evidence) or a wrong test (fix the test and say why). Decide which with evidence, not by guessing.
6. **`npm run check` must be green** (typecheck, ESLint, Prettier, conventions). Hooks enforce it: the edit hook
   checks every file you touch, and the stop hook does not let a session end with violations.
7. **A human approves.** Agents propose tests, reviews and bug reports; a person reviews them before merging.

## Agents

| Agent              | What it does                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `test-automator`   | Turns a test case into a test: explores the app, writes POM + spec, runs it twice        |
| `rules-reviewer`   | Reviews new tests against `CONVENTIONS.md` and reports what to fix (read-only)           |
| `bug-investigator` | Takes a failing test to a root cause and drafts the bug report with evidence (read-only) |
