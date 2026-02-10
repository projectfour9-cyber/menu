## Purpose
This file helps AI coding agents get productive quickly in this repository by summarizing the architecture, developer workflows, conventions, and concrete code examples.

## Quick start
- Run locally: `npm install` then `npm run dev` (powered by Vite). See package.json scripts.
- Required env: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` before running.

## Big-picture architecture
- Frontend: React + Vite single-page app. Entry points: `index.tsx` and `App.tsx`.
- UI: `components/` contains the main UI surface: `MenuForm.tsx`, `MenuPreview.tsx`, `DishBank.tsx`, `MenuHistory.tsx`, `Auth.tsx`.
- Data & backend: app uses Supabase (JS client in `services/supabaseService.ts`). There is no separate backend server; logic runs client-side and queries Supabase directly.
- DB schema and migrations: `supabase/migrations/` and `supabase/seed.sql` — use these to understand tables (`dishes`, `sub_menu_items`, `banners`, `profiles`, `menus`).

## Key data flows (concrete examples)
- Menu generation: user completes `MenuForm` -> `App.tsx` calls `fetchMenuFromBackend` in `services/supabaseService.ts` -> function queries `dishes` and `sub_menu_items`, builds buckets, and returns a `GeneratedMenu` object used by `MenuPreview`.
- Menu history: `saveMenuToHistory` in `services/supabaseService.ts` inserts into the `menus` table; `fetchMenuHistory` reads it for `MenuHistory`.
- Auth: Supabase auth is used in `App.tsx` (calls to `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange`). User profiles are fetched via `getUserProfile`.

## Project-specific conventions and patterns
- Category normalization: `categoryToBucket` maps DB `category` strings to frontend composition buckets (`appetizers`, `mains`, `liveStations`, `sides`, `desserts`, `beverages`). Modify this function when adding new categories.
- Cuisine mapping: `fetchDishesByCuisine` contains a `mappings` object that maps UI cuisine names to DB `cuisine` values (e.g., "Indian" -> [`Punjabi/North Indian`, `South Indian`, `Mughlai`]). When adding cuisines, update this mapping and the `cuisineOptions` list in `components/MenuForm.tsx`.
- Banners: banner selection prefers DB `banners` table (queried by `fetchBannerForCuisine`) and falls back to `BANNER_COLLECTION` in `services/supabaseService.ts`.
- Deprecated AI integration: `services/geminiService.ts` currently exports nothing and is marked deprecated — do not rely on it.

## Files to inspect for common tasks
- UI flow: [App.tsx](App.tsx)
- Form and defaults: [components/MenuForm.tsx](components/MenuForm.tsx)
- Menu generation & DB access: [services/supabaseService.ts](services/supabaseService.ts)
- DB migrations & seeds: [supabase/migrations/](supabase/migrations/) and [supabase/seed.sql](supabase/seed.sql)
- Supabase config: [supabase/config.toml](supabase/config.toml)

## Environment & runtime notes
- Vite dev server (`npm run dev`) uses environment variables prefixed with `VITE_` available via `import.meta.env` (see `services/supabaseService.ts` reading `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`).
- The app is TypeScript; ensure `typescript` and `ts-node` dev dependencies are used when adding scripts or Node utilities.

## PR / code change guidance for AI agents
- Small UI changes: prefer editing components under `components/`; follow the existing tailwind-like utility classes and component structure.
- DB changes: update `supabase/migrations/` SQL and, if necessary, update mapping logic in `services/supabaseService.ts`.
- Adding cuisines or categories: update both UI (`components/MenuForm.tsx` `cuisineOptions`) and server logic (`fetchDishesByCuisine` mapping and `BANNER_COLLECTION` if applicable).
- Tests & scripts: this repo has no test harness. Do not add tests that require a production Supabase instance — instead mock `supabase` client for unit tests.

## Common troubleshooting
- If menu images are missing, check `fetchBannerForCuisine` and `BANNER_COLLECTION` fallbacks in `services/supabaseService.ts`.
- If auth behaves unexpectedly, inspect `App.tsx` for `supabase.auth.getSession()` usage and confirm env variables are correct.

## When in doubt, read these first
- [App.tsx](App.tsx) — app entry and high-level flows.
- [services/supabaseService.ts](services/supabaseService.ts) — canonical place for data access and business rules.
- [supabase/migrations/](supabase/migrations/) — DB schema authoritative source.

---
If any sections are unclear or you want more code-level examples (line-level pointers, expanded mappings, or sample DB rows), tell me which area to expand and I will update this file.
