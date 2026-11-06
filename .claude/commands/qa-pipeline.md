---
description: Run the QA pipeline for one requirement, step by step, with a human approval gate after each step
argument-hint: REQ-NN
---

Run the QA pipeline for requirement **$ARGUMENTS**. The state lives in `pipeline/$ARGUMENTS.json`; create it from an
existing one if it does not exist. After **every** step: update that step's `status` and `evidence` in the JSON, show
the result, and **stop until the human approves** ("ok" / "go"). Never run two steps without approval.

| #   | Step                 | Who                      | Output                                                                       |
| --- | -------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| 1   | Requirement analysis | you                      | `docs/requirements/$ARGUMENTS-*.md`: user story, acceptance criteria, risk   |
| 2   | Test design          | `test-designer` agent    | new rows in `docs/test-cases.md` (ISTQB technique, level, priority)          |
| 3   | Automation           | `test-automator` agent   | page objects + specs, each test titled with its TC ID, run twice             |
| 4   | Rules review         | `rules-reviewer` agent   | findings by severity; fix every High and Medium, then re-review              |
| 5   | Execution            | you                      | `npm run check` + `npx playwright test`; record passed / failed / flaky      |
| 6   | Bug investigation    | `bug-investigator` agent | for each failure: app bug (draft report with evidence) or test issue (fixed) |
| 7   | Human sign-off       | the human                | only the human sets this step to `done`, with their name in `evidence`       |

Rules:

- A step is `done` only with evidence (a file, a command output, a run). Otherwise it stays `pending` or `blocked`.
- Never change an expected result to make a test pass (see `CLAUDE.md`).
- Step 7 is never done by an agent.
- The dashboard (GitHub Pages) reads `pipeline/*.json`, so the board shows each requirement's progress after the
  next CI run.
