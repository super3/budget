# Alder

A personal budgeting app MVP — track net worth, accounts, and transactions in one place.

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
