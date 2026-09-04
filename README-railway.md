# Railway deployment notes (Vite + React)

## 1) Build
Run:
```bash
npm run build
```

## 2) Static hosting vs SSR
This project is a **frontend-only** (Vite React). It should be deployed as a static site.

## 3) Railway settings (Environment Variables)
Add these Environment Variables in Railway (same values you used for `.env`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

> ⚠️ do **NOT** use `service_role_KEY` in the frontend. Remove it from `.env` and from Railway envs after you finish testing.

If you want to keep `SUPABASE` connection string for scripts/backends, keep it **only** in server-side environments.

## 4) Port
This is a frontend build; Vite dev port is irrelevant.

## 5) Verification
After deployment, open:
- `/` (Landing)
- `/login`
- `/signup`

Make sure the signup form works and auth redirects properly.

