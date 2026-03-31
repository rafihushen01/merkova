# Merkova Frontend

Production-style React frontend for Merkova ecommerce, designed to work with the backend API and also serve as a learning-friendly real-world project.

This README is intentionally detailed so learners can understand architecture, boot process, route strategy, state management, and deployment workflow.

## Table of Contents

1. Project Overview
2. Tech Stack
3. Core Capabilities
4. Project Structure
5. Quick Start
6. Environment Variables
7. Scripts
8. Routing Map
9. State Management and Data Flow
10. Reliability Review (Frontend Entry and Routing)
11. Deployment Notes
12. Learning Path
13. Troubleshooting
14. License

## Project Overview

Merkova frontend provides:

- authentication and onboarding flows
- customer shopping interfaces
- seller dashboard and product/shop management pages
- super admin content operations (campaign/category/banner/navigation)
- integrated API communication using cookie-based sessions

Frontend entry path:

- `src/main.jsx` -> app bootstrap (`Provider`, `BrowserRouter`, root render)
- `src/App.jsx` -> route orchestration and protected/public navigation logic

## Tech Stack

- React 19
- Vite 7
- React Router DOM 7
- Redux Toolkit + React Redux
- Axios
- Framer Motion
- Tailwind CSS 4
- Firebase SDK (web auth integration utility)

## Core Capabilities

- Role-oriented page structure (customer, seller, admin, super admin)
- Protected routes and public routes
- Animated route transitions
- Redux-backed user + shop state
- Shop-owner auto-fetch hook
- Product/store dynamic routes (`/products/:itemid`, `/store/:shopid`)

## Project Structure

```text
frontend/
|-- public/
|-- src/
|   |-- main.jsx                      # root bootstrap (StrictMode + ErrorBoundary)
|   |-- App.jsx                       # route graph + route guards
|   |-- index.css
|   |-- Hooks/
|   |   |-- Usegetcurrentuser.jsx     # current user bootstrap hook
|   |   `-- useCurrentShopOwner.jsx   # shop-owner bootstrap hook
|   |-- pages/
|   |   |-- Home.jsx
|   |   |-- Signin.jsx
|   |   |-- Signup.jsx
|   |   |-- Customers/
|   |   |-- Admin/
|   |   |-- superadmin/
|   |   |-- SellerCentral/
|   |   `-- redux/
|   |       |-- Store.js
|   |       |-- User.js
|   |       `-- Shop.js
|   |-- seller/
|   |-- assets/
|   `-- asset/
|-- .env.example
|-- vite.config.js
|-- LICENSE
`-- README.md
```

## Quick Start

### 1) Install dependencies

```bash
cd frontend
npm install
```

### 2) Create env file

PowerShell:

```powershell
Copy-Item .env.example .env
```

Bash:

```bash
cp .env.example .env
```

Update values in `.env`.

### 3) Start development server

```bash
npm run dev
```

Default Vite URL is usually `http://localhost:5173`.

### 4) Build for production

```bash
npm run build
```

### 5) Preview production build

```bash
npm run preview
```

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SERVER_URL` | Yes | Backend API base URL (example: `http://localhost:5000`) |
| `VITE_FIREBASE_API` | Yes (if Firebase auth path used) | Firebase web API key |

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start local Vite dev server |
| `npm run build` | Generate production bundle |
| `npm run preview` | Serve production bundle locally |
| `npm run lint` | Run ESLint |

## Routing Map

Routes are defined in `src/App.jsx`.

### Public/Auth

| Path | Notes |
|---|---|
| `/signup` | Public signup page |
| `/signin` | Public signin page |
| `/forgetpass` | Password reset path |
| `/sellersignup` | Seller signup flow |

### Protected/Home

| Path | Notes |
|---|---|
| `/` | Protected home route (requires `userData`) |

### Customer

| Path | Notes |
|---|---|
| `/products/:itemid` | Product details page |
| `/store/:shopid` | Store details page |
| `/whychooseus` | Security/value page |
| `/AboutMerkova` | About page |

### Seller

| Path | Notes |
|---|---|
| `/sellerprofile` | Seller profile |
| `/createitem` | Create new item |
| `/seller/edititem/:itemid` | Edit item |
| `/AllShopItems` | Seller item list |
| `/createshop` | Create shop |
| `/editshop` | Edit shop |
| `/claimshop` | Claim shop flow |
| `/sellershopapproval` | Seller approval page |
| `/SellerShopView` | Seller shop view |
| `/seller/storedecor` | Store decor |
| `/MerkovaSellerChats` | Seller chat |

### Seller Central

| Path | Notes |
|---|---|
| `/MerkovaSellerCentral` | Seller central dashboard |
| `/sellerhomebanner` | Seller home banner management |

### Admin/Super Admin

| Path | Notes |
|---|---|
| `/homebanner` | Admin home banner page |
| `/campaign` | Campaign management |
| `/categorycreator` | Category management |
| `/navcus` | Navbar customization |
| `/sellerapproval` | Seller approval list |
| `/creator` | Created shop management |
| `/MerkovaOrganizeChats` | Super admin chat panel |

### Fallback

- Any unknown route now redirects to `/` (if authenticated) or `/signin` (if not authenticated).

## State Management and Data Flow

Redux store setup (`src/pages/redux/Store.js`) has two slices:

- `user` slice
- `shop` slice

Startup flow:

1. `main.jsx` mounts app with Redux provider.
2. `App.jsx` runs `useGetCurrentUser()` to hydrate user session from backend cookie.
3. If authenticated user exists, `useCurrentShopOwner()` fetches current shop owner data.
4. Route guards (`ProtectedRoute`, `PublicRoute`) redirect based on Redux `userData`.

## Reliability Review (Frontend Entry and Routing)

Frontend reliability improvements were applied in this update.

### `src/main.jsx` improvements

- Added `StrictMode` around the full app tree.
- Added `RootErrorBoundary` to catch top-level React crashes with a user-safe fallback UI.
- Added explicit root element presence check before rendering.

### `src/App.jsx` improvements

- Added loading guard while session bootstrap is in progress.
- Added wildcard fallback route (`*`) to prevent dead-end URL states.
- `useCurrentShopOwner` now supports controlled execution (`enabled`) and is called with current auth state.

### `src/Hooks/useCurrentShopOwner.jsx` improvements

- Added `enabled` parameter so unauthorized visitors do not trigger unnecessary shop-owner fetch logic.
- Suppressed user-facing error toast on 401 to reduce noise on unauthenticated sessions.
- Simplified and stabilized hook state transitions.

## Deployment Notes

Current repo already includes `vercel.json`, so Vercel deployment is straightforward.

Checklist:

1. Set `VITE_SERVER_URL` to your production backend URL.
2. Ensure backend CORS allowlist includes the deployed frontend domain.
3. Verify backend cookies are configured for cross-site production (`secure`, `sameSite`).
4. Run `npm run build` locally before deploy.

## Learning Path

Recommended study order for learners:

1. Read `src/main.jsx` to understand app bootstrap.
2. Read `src/App.jsx` route-by-route.
3. Follow one full flow:
   signup/signin -> Redux state update -> protected route navigation.
4. Read `src/Hooks/Usegetcurrentuser.jsx` and `src/Hooks/useCurrentShopOwner.jsx`.
5. Read Redux slices and track how components consume state.
6. Add one small feature:
   example: create a `NotFound` page instead of redirect-only fallback.
7. Add one reliability feature:
   example: axios interceptor for centralized API error handling.

## Troubleshooting

### Frontend cannot reach backend

- verify `VITE_SERVER_URL` in `.env`
- ensure backend is running
- confirm backend CORS includes frontend origin

### Auth seems to fail even after signin

- check browser cookie storage for `token`
- ensure axios requests use `withCredentials: true`
- verify backend cookie flags for local vs production mode

### Blank screen on crash

- check browser console
- root error boundary now displays a fallback UI for render-time app crashes

## License

This frontend is licensed under the MIT License.

See [LICENSE](./LICENSE) for full text.
