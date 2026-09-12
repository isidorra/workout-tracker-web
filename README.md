# Workout Tracker

Angular app for logging workouts and seeing how the week and month are going.

Guests land on a short pitch. After sign-in, home becomes a dashboard, and `/workouts` holds the full history. English and Serbian, light and dark — the first visit follows the browser and OS; later choices stick.

## Features

**Auth** — register, sign in, and restore the session on load. Access tokens go out as `Bearer` headers. Refresh uses an `HttpOnly` cookie, so the dev server proxies `/api` same-origin.

**Dashboard** — this week’s count, time trained, and average difficulty/fatigue, plus whether anything was logged today and what the last session was. Progress steps through a month week by week.

**Workouts** — paginated list of cardio, strength, flexibility, and mixed sessions, filterable by type. Log a workout from home or the list: type, local date and time, duration, calories, difficulty and fatigue (1–10), optional notes.

## Architecture

Standalone Angular, one feature folder per domain. Pages lazy-load. NgRx state is provided where it is needed: auth globally, dashboard on `/`, workouts on `/` and `/workouts` (home opens the log dialog).

```
pages  →  features (store, effects, API)  →  /api
```

| Folder              | Role                                        |
| ------------------- | ------------------------------------------- |
| `src/app/auth`      | Session, guards, interceptor, token refresh |
| `src/app/dashboard` | Week summary and monthly progress           |
| `src/app/workouts`  | List, create, and the log-workout dialog    |
| `src/app/pages`     | Routed screens                              |
| `public/i18n`       | `en.json` and `sr.json`                     |

## Stack

- Angular 22, Angular Material, SCSS
- NgRx Store + Effects
- Transloco (`en`, `sr`)
- Dev proxy in `proxy.conf.mjs`

## Getting started

Needs Node, npm, and the API on port 8080.

```bash
cp .env.example .env   # optional; API_URL defaults to http://localhost:8080
npm install
npm start              # http://localhost:4200
```

`npm run build` for a production bundle. `npm run format` runs Prettier.
