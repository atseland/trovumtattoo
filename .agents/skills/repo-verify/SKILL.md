---
name: repo-verify
description: Use when you have made, reviewed, or are about to finalize code changes in this repository and need the smallest useful verification plan plus an honest finish check. Do not use for pure brainstorming or docs-only tasks with no code impact.
---

Use this skill to keep change verification strict and lightweight.

1. Classify the change:
- docs-only
- tests-only
- UI-only
- app logic
- config/build/tooling

2. During implementation, run the narrowest useful command first.
- Example: a single Vitest file before full-project verification.

3. Before final handoff on any code-affecting task, run the project-level verification command.
- Prefer `just verify` from the repository root.
- If full verification is impossible, say exactly why and run the next-smallest useful subset instead.

4. Never claim a task is complete if a verification command failed.
- Report the exact failing command.
- Report the first actionable error, not a vague summary.

5. If the change touched generated starter code, verify the generated project, not just the scaffolder.

6. For frontend work that depends on browser behavior, prefer Playwright MCP for quick reproduction or inspection, then encode the lasting check as a committed Playwright or Vitest test when appropriate.

Outputs:
- Commands run
- Result of each command
- Any skipped verification and why
