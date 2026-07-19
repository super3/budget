# Alder

A personal budgeting app MVP — track net worth, accounts, and transactions in one place.

[![Test Status](https://img.shields.io/github/actions/workflow/status/super3/alder/test.yml?branch=main&label=tests)](https://github.com/super3/alder/actions/workflows/test.yml)
[![Site Status](https://img.shields.io/website?url=https%3A%2F%2Faldermoney.com&label=site&up_message=live&down_message=down)](https://aldermoney.com)
[![API Status](https://img.shields.io/website?url=https%3A%2F%2Falder-production.up.railway.app%2Fhealth&label=api&up_message=live&down_message=down)](https://alder-production.up.railway.app/health)
[![Coverage Status](https://coveralls.io/repos/github/super3/alder/badge.svg?branch=main)](https://coveralls.io/github/super3/alder?branch=main)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?label=license)](https://github.com/super3/alder/blob/main/LICENSE)

Built with React, TypeScript, and Vite from the Fern MVP design handoff
(the product has since been renamed from Fern to Alder — aldermoney.com).

## Pages

The landing page is the homepage; the app lives at `#app` (hash-based, so
direct links work on GitHub Pages without server-side routing). "See the
demo" opens the app; "Sign out" returns to the landing page.

- **Landing** — hero with waitlist signup, product preview, stats strip, feature rows, CTA, and footer

## App screens

- **Dashboard** — net worth chart, recent transactions, and monthly cash flow, with a Customize menu to show/hide each card
- **Accounts** — net worth history plus collapsible account groups (cash, credit cards, investments, property, loans) and an asset/liability summary with totals or percent view
- **Account detail** — balance history and recent activity for a single account
- **Transactions** — day-grouped transaction list with category tags, date-range and filter menus
- **Settings** — profile, preferences, notification toggles, security, and connected institutions

## Development

```sh
npm install
npm run dev
```

Other scripts:

```sh
npm run build    # typecheck + production build
npm run lint     # oxlint
npm run preview  # serve the production build
```

## Clerk (waitlist + login)

The landing-page waitlist forms submit to [Clerk](https://clerk.com)'s
waitlist (`clerk.joinWaitlist`), the nav "Log in" opens Clerk's sign-in
modal, and a signed-in user's name/email replace the demo persona in the
app sidebar (Sign out ends the Clerk session). Setup:

The publishable key is hardcoded in `src/clerk.ts` (publishable keys are
public by design). To use a different Clerk instance — e.g. a production
`pk_live` key — set `VITE_CLERK_PUBLISHABLE_KEY`, which overrides the
default: locally via `.env.local` (see `.env.example`), and in deploys via
a repository **Actions variable** (Settings → Secrets and variables →
Actions → Variables). Waitlist sign-up mode must be enabled in the Clerk
dashboard (Configure → Restrictions).

## Backend (Plaid API)

`server/` is an Express API that connects real bank accounts through
[Plaid](https://plaid.com/docs/) — Link token creation, public-token
exchange, real-time balances (`/accounts/balance/get`), and cursor-based
transaction sync (`/transactions/sync`) with a webhook receiver. Requests
are authenticated with Clerk; data lives in Postgres with
`node-pg-migrate` migrations that run automatically on `npm start`.

```sh
cd server
npm install
cp .env.example .env   # fill in Plaid + Clerk keys
npm run dev
```

Sandbox smoke test (no UI, uses /sandbox/public_token/create):

```sh
cd server && npm run spike
```

Tests (Jest + supertest + pg-mem, 100% coverage enforced by the config —
same setup as llmjob; also run in CI via `.github/workflows/test.yml`):

```sh
cd server && npm test
```

Deploys on Railway: create a service from this repo with **Root Directory
`server`**, attach the Postgres database (`DATABASE_URL` via
`${{Postgres.DATABASE_URL}}`), and set the variables from `.env.example`.

## Deployment

Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`
(it can also be run manually from the Actions tab), using the standard
`actions/deploy-pages` flow with **Settings → Pages → Source** set to
**GitHub Actions**. The site is served at the root of the custom domain
(aldermoney.com, set under Settings → Pages), so the workflow builds with
`--base=/`. If the custom domain is ever removed, switch the build back to
`--base=/<repo>/` for the github.io project-site URL.

If a deploy is rejected with "not allowed to deploy to github-pages due to
environment protection rules", the `github-pages` environment's deployment
branch policy doesn't allow `main` — delete the environment under
**Settings → Environments** (it is recreated correctly on the next run) or
add `main` to its allowed deployment branches.

## Project structure

```
src/
  App.tsx          app shell: screen switching + shared state
  data.ts          static demo data (accounts, transactions, menus)
  components/      sidebar, menus, modals, charts, primitives
  screens/         Dashboard, Accounts, AccountDetail, Transactions, Settings
  index.css        design tokens + component styles
```
