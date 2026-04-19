<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project-specific guardrails

- Route protection is implemented via `proxy.ts` + `lib/supabase/proxy.ts` (Next 16 `proxy`, not `middleware.ts`). Keep auth redirects for `/session` aligned there.
- App Router uses route groups: public landing in `app/(home)`, authenticated/guest experience in `app/(protected)`, auth flows in `app/auth`.
- Use the repository layer for DB writes/reads (`lib/repositories/**`) and keep server actions in `app/**/actions.ts`; actions return `ActionResult` via `actionSuccess` / `actionError` from `lib/types/actions.ts`.
- Prisma client is generated to `generated/prisma` (`prisma/schema.prisma` generator output). Import types/client from `@/generated/prisma/*` and do not hand-edit files under `generated/prisma/`.
- Prisma CLI in this repo is Bun-oriented (`prisma.config.ts` + `README.md`): use `bunx --bun prisma migrate dev --name <name>` and `bunx --bun prisma generate`.
- Session UI live-updates via Supabase realtime in `lib/hooks/use-session-realtime.ts` watching `participants`, `votes`, and `sessions`; keep table names and filters in sync with schema changes.
