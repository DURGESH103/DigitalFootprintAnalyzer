# Digital Footprint Analyzer — Frontend

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (dark theme)
- **Zustand** (state management)
- **Framer Motion** (animations)
- **Recharts** (charts)
- **Socket.io-client** (real-time)
- **Axios** (API + auto token refresh)

---

## Quick Start

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

Make sure the backend is running on `http://localhost:3000`.

---

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login / Signup (centered layout)
│   ├── (dashboard)/        # Protected pages (Navbar + Sidebar)
│   ├── layout.tsx          # Root layout + Toaster
│   ├── page.tsx            # Landing page
│   └── not-found.tsx
├── components/
│   ├── ui/                 # Button, Card, Input, Skeleton, Badge, ScoreRing, StatCard
│   ├── charts/             # LanguagePieChart, ActivityBarChart
│   └── layout/             # Navbar, Sidebar, ProtectedRoute
├── features/
│   ├── auth/               # LoginForm, SignupForm
│   ├── dashboard/          # AnalyzeForm, InsightBox
│   └── profile/            # GithubProfileCard
├── services/               # api.ts (axios), auth.service.ts, report.service.ts
├── store/                  # auth.store.ts, report.store.ts (Zustand)
├── hooks/                  # useAuth.ts, useSocket.ts
├── utils/                  # types.ts, helpers.ts
├── constants/              # index.ts
├── styles/                 # globals.css
└── middleware.ts           # Server-side route protection
```

---

## Key Features

### Authentication
- JWT stored in secure cookies (httpOnly-equivalent via `js-cookie` with `secure + sameSite`)
- Auto token refresh via Axios interceptor (queues concurrent requests during refresh)
- Server-side route protection via Next.js middleware
- Client-side protection via `ProtectedRoute` component

### Real-Time Analysis
- Socket.io connects with JWT auth token
- Progress events: 20% → 60% → 90% → 100%
- Auto-redirects to dashboard on completion
- Error state shown if analysis fails

### State Management
- `useAuthStore` — user, tokens, isAuthenticated (persisted to localStorage)
- `useReportStore` — reports list, current report, analysis progress

### Charts
- Language distribution: Recharts PieChart with custom tooltip
- Activity pattern: Recharts BarChart (day vs night)
- Score rings: Custom SVG with Framer Motion animation

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

## Pages

| Route | Description | Auth Required |
|---|---|---|
| `/` | Landing page | No |
| `/login` | Login form | No (redirects if logged in) |
| `/signup` | Signup form | No (redirects if logged in) |
| `/dashboard` | Main dashboard with reports | Yes |
| `/analysis` | Real-time analysis progress | Yes |
| `/profile` | User profile + report history | Yes |
