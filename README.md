# Fern

A personal budgeting app MVP — track net worth, accounts, and transactions in one place.

Built with React, TypeScript, and Vite from the Fern MVP design handoff.

## Screens

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

## Deployment

Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`
(it can also be run manually from the Actions tab). The workflow builds with
`--base=/<repo>/` so assets resolve under the project-site URL. If the first
run can't enable Pages automatically, set **Settings → Pages → Source** to
**GitHub Actions** once.

## Project structure

```
src/
  App.tsx          app shell: screen switching + shared state
  data.ts          static demo data (accounts, transactions, menus)
  components/      sidebar, menus, modals, charts, primitives
  screens/         Dashboard, Accounts, AccountDetail, Transactions, Settings
  index.css        design tokens + component styles
```
