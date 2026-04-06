---
name: next-guardrails
description: Use when editing Next.js App Router code in this repository. Applies server/client boundaries, mutation patterns, environment handling, and test expectations. Do not use for SvelteKit code or docs-only tasks.
---

Use this skill to reduce common App Router mistakes.

1. Default to Server Components.
- Add `'use client'` only when the component needs state, effects, event handlers, or browser APIs.
- Remember that once a file is a Client Component, its imports join the client bundle.

2. Prefer server-side mutations and data access.
- Use Server Actions for form submissions and mutations when the flow is form-driven.
- Keep secrets and non-public environment variables on the server.
- Only expose values through `NEXT_PUBLIC_*` when the browser truly needs them.

3. Keep domain logic out of route files when possible.
- Put reusable validation and business logic in `src/lib`.
- Test domain logic with Vitest before relying on UI-level checks.

4. Respect framework boundaries.
- Keep App Router file conventions inside `src/app`.
- Use Route Handlers only when you need an HTTP API surface rather than a form/action flow.

5. Verify by scope.
- For partial work, start narrow.
- Before finishing, run `just verify` or the equivalent full Next command set.

6. Use Playwright MCP for browser-only bugs.
- Reach for it when layout, hydration, focus, or interaction bugs are hard to reason about statically.
- If the issue is important enough to regress, back it with a committed Playwright test.

Reference principles:
- Next.js App Router defaults to Server Components.
- `'use client'` defines the client/server boundary.
- Forms are best handled with Server Actions when applicable.
