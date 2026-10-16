# InvestPlus Frontend Prototype

Responsive React + Vite frontend for:
- Public landing page (`/`)
- Member dashboard (`/member`)
- Admin dashboard (`/admin`)
- Placeholder routes for the planned member/admin sections

## Requirements
- Node.js 20 or newer recommended
- npm

## Run locally (Windows PowerShell)
1. Extract this ZIP.
2. Open PowerShell in the extracted `investplus-frontend` folder.
3. Run:

```powershell
npm.cmd install
npm.cmd run dev
```

4. Open the local URL printed by Vite (usually `http://localhost:5173`).

To build for production:

```powershell
npm.cmd run build
```

## Important
This is a frontend-only prototype. It uses hard-coded sample data and has no real authentication, database, payment integration, or actual financial ledger. The buttons and navigation demonstrate the interface only. Do not accept deposits or represent the sample values as actual balances or guaranteed returns.

Before any real-money launch, connect a secure Node.js API and PostgreSQL database, implement server-side role checks, verified payment callbacks, an auditable double-entry or equivalent financial ledger, idempotent transaction processing, and appropriate Kenyan legal/regulatory review.
