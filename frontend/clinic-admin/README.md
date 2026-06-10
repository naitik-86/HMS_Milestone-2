# ClinicAdmin — Veterinary Management System

Restructured React + Tailwind admin panel for a veterinary clinic.

## Tech
- React 19
- Vite 6 (dev server on http://localhost:3000)
- Tailwind CSS 3.4
- Recharts (dashboard analytics)
- Lucide-react icons

## Getting started
```bash
npm install      # or: bun install / pnpm install
npm run dev      # opens http://localhost:3000
npm run build
npm run preview
```

## Folder structure
```
src/
  main.jsx                # React entry
  App.jsx                 # Top-level shell + page switcher
  index.css               # Global styles + Tailwind directives
  styles/
    tokens.js             # Shared inline style tokens (lbl, btnPrimary, ...)
  data/                   # All mock data + constants (per domain)
    constants.js
    staff.js
    doctors.js
    dashboard.js
    lab.js
    groomer.js
    kennel.js
  components/
    layout/               # Sidebar, Header
    common/               # Modal (shared overlay)
  features/               # One folder per page/feature
    dashboard/
    staff/
    doctors/
    lab/
    groomer/
    kennel/
    settings/
    reports/
```

Each feature folder owns its page component (and any large sub-forms). Mock data
and shared style tokens are imported from `data/` and `styles/tokens.js` so
individual page files stay focused on UI.
