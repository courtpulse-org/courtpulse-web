# CourtPulse Web

Monorepo for the CourtPulse V1 web apps (Lagos State pilot). It follows the PRD in
`CourtPulse V 1 Lean  Grassroot Launch.pdf`. There is no mobile app: lawyers use a
mobile-first web app, and registrars and admins use a lightweight portal that
works in a phone browser.

## Layout

```
apps/
  user-dashboard/     Lawyer app                    → http://localhost:3000
  registrar-portal/   Registrar + System Admin      → http://localhost:3001
packages/
  theme/              Chakra UI v3 design system ("Bench & Pulse")
  ui/                 Shared components: inputs, OTP, cards, court-status badges, 1-tap status group, icons
  types/              Domain types shared by both apps (court status, watchlist, briefs, users)
  utils/              Route factory, token storage, error handling, WAT date/time, Naira formatting
  eslint-config/      Shared ESLint flat configs
  typescript-config/  Shared tsconfig presets
```

Stack: Vite 7, React 18, TypeScript, Chakra UI v3, TanStack Query, React Router 7,
Formik + Yup, Axios, Turborepo, pnpm workspaces.

## PRD coverage

| PRD module                         | Lawyer app (`user-dashboard`)                | Portal (`registrar-portal`)                |
| ---------------------------------- | -------------------------------------------- | ------------------------------------------ |
| §2 Onboarding                      | Enrolment no. + phone OTP signup/login       | Email invitation; admin verification       |
| M1 Case watchlist & cause list OCR | `/watchlist`, `/cause-list` (camera upload)  | `/cause-list` (official list upload)       |
| M2 Crowdsourced verification       | `/pulse` live board, check-in, 1-tap reports | Admin → Consensus rules                    |
| M3 Registrar portal                | —                                            | `/` 1-tap console, `/broadcasts`           |
| M4 Brief-holding marketplace       | `/briefs` request, accept, notes, escrow     | Admin → Disputes, Escrow                   |
| M5 Virtual dock & remote dates     | `/dock` live call order, remote date picker  | `/dock` call-next control, `/remote-dates` |
| Gamification (Pulse Credits)       | `/wallet`                                    | Admin → Consensus rules (credit rules)     |

Each feature lives in `apps/<app>/src/features/<feature>/` with `api/` (service +
React Query hooks), `pages/`, `components/` and `routes/`. That structure matches the
SpeakFluent `soap-web` monorepo.

## Theme: "Bench & Pulse"

- **Judicial Navy** `#1F3A66`: the primary colour. It stands for authority, the bench and official notices.
- **Brass** `#B8892B`: the accent, used for the gavel and seal, rewards, and the edge that marks a watched matter.
- **Status palette**: each court status has its own colour, far enough apart to tell at a glance on a phone in sunlight:
  Judge on Bench = green, Sitting Late = amber, Not Sitting = red, In Recess = blue.
- **Type**: Fraunces (serif headings), Inter (body) and JetBrains Mono (suit and item numbers).
- **Touch targets**: a thumb-sized `xl` button size and a `status` button variant for the 1-tap controls.

Tokens live in `packages/theme/src`. Status → colour mapping is exported as
`COURT_STATUS_COLOR` so both apps stay in sync.

## Getting started

```sh
pnpm install                 # also generates Chakra theme typings (postinstall)
cp apps/user-dashboard/.env.example apps/user-dashboard/.env
cp apps/registrar-portal/.env.example apps/registrar-portal/.env
pnpm dev                     # both apps
pnpm dev:dashboard           # lawyer app only
pnpm dev:portal              # portal only
```

| Command            | What it does                |
| ------------------ | --------------------------- |
| `pnpm build`       | Build all packages and apps |
| `pnpm check-types` | Type-check everything       |
| `pnpm lint`        | ESLint                      |
| `pnpm format`      | Prettier                    |

Husky runs format, lint and type checks before each commit, checks the commit message with
commitlint (conventional commits), and runs affected checks before each push. CI
(`.github/workflows/ci.yml`) enforces the same checks on PRs to `main` and `staging`.

## Registrar portal: demo mode

The portal currently runs on **sample data in the browser**. It doesn't call any backend.
The data is fictional (Lagos divisions, courtrooms, judges, cause lists, counsel) and is
stored in localStorage. It reseeds itself each day, and **Settings → Reset demo data**
reseeds it on demand. Use the one-tap demo accounts on the login page:

| Account       | Email / password                              | Sees                     |
| ------------- | --------------------------------------------- | ------------------------ |
| Grace Adeniyi | `registrar@courtpulse.ng` / `Registrar12345!` | Ikeja Courts 1, 2 & 5    |
| Samuel Etim   | `s.etim@courtpulse.ng` / `Registrar12345!`    | Igbosere Courts 3, 7, 11 |
| Olumide Coker | `admin@courtpulse.ng` / `Admin12345!`         | Everything + admin       |

All data access goes through `apps/registrar-portal/src/mock/api.ts`. Pages use the React
Query hooks in `src/shared/api`. To go live, replace each function in `mock/api.ts` with an
axios call. The hooks and pages stay the same.

The portal goes past the PRD in these ways (the backend doesn't have them yet):

- **Sitting state machine**: Sitting → Judge on bench ⇄ Recess → Court rose, plus Sitting late and Not sitting. Statuses also exist for _tomorrow_, so a registrar can post the night before.
- **Not-sitting reasons**: indisposed, on leave (with a return date), chambers meeting, and others. Each post shows a preview of the SMS/WhatsApp text and the number of counsel it reaches.
- **Cause list management**: add, edit and reorder matters, record business of the day, and publish. Matters can be imported from a photo and reviewed before they go live. Suit numbers are normalised (`@repo/utils` `normalizeSuitNumber`).
- **In-court controls**: call a matter, then mark it heard, stand it down, adjourn it (with a hearing notice), reserve judgment or strike it out.
- **Bulk date-taking**: when the judge doesn't sit, the list's matters get dates spread across the judge's diary, and counsel get hearing notices in one pass.
- **Judge's diary**: shows how many matters are fixed for each day. Days can be blocked, and legal-calendar vacations and holidays are blocked automatically.
- **Date requests**: counsel propose dates and the registrar confirms one against the diary.
- **Alert log**: a record of every dispatch, with its reach and delivery.
- **Admin**: registrar ↔ courtroom assignment, judge assignment history per courtroom, the legal calendar, lawyer verification, and consensus rules.

## Backend contract

API paths are listed in each app's `src/shared/constants/query-paths.ts`, and response
envelopes are typed in `packages/types/src/api.ts`. Live courtroom data polls every
15s, which is the PRD's latency limit. Replace the polling with the WebSocket channel
(`VITE_APP_WS_URL`) once the backend exposes it. Money travels as kobo.
