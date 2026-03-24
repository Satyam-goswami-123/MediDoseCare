# Medi Dose Care — Implementation Plan (Updated)

A premium 20-screen healthcare platform for senior citizens built as a **full-stack web app**:

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MySQL 8 |
| Styling | Vanilla CSS (no Tailwind) |
| State | React Context + useState |
| HTTP | Axios |

---

## Folder Structure

```
MediDoseCare/
├── client/                    (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/        Reusable UI (BottomNav, Card, Button, Modal…)
│   │   ├── pages/             20 screen pages
│   │   ├── routes/            React Router route definitions
│   │   ├── context/           Global state (auth, medicines, vitals)
│   │   ├── hooks/             Custom hooks (useApi, useAuth)
│   │   ├── api/               Axios instances & endpoint helpers
│   │   ├── assets/            Images, icons
│   │   ├── styles/            index.css (design tokens)
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
│
├── server/                    (Node.js + Express)
│   ├── models/                MySQL schemas via mysql2
│   ├── routes/                API route files
│   ├── controllers/           Business logic
│   ├── middleware/             Auth (JWT), error handler
│   ├── config/                DB connection (db.js)
│   └── index.js               Entry point
│
└── README.md
```

---

## Proposed Changes

### Backend — Server

#### [NEW] server/index.js
Express app entry: mounts all routes, CORS, JSON middleware, PORT 5000.

#### [NEW] server/config/db.js
MySQL2 connection pool using env vars (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`).

#### [NEW] server/models/
| File | Purpose |
|------|---------|
| `User.js` | users table (id, name, phone, role: patient/doctor/caregiver) |
| `Medicine.js` | medicines table (id, user\_id, name, dose, frequency, times) |
| `HealthLog.js` | health\_logs (id, user\_id, bp, sugar, heart\_rate, recorded\_at) |
| `Prescription.js` | prescriptions (id, user\_id, doctor, date, image\_url, notes) |
| `Notification.js` | notifications (id, user\_id, message, type, read, created\_at) |

#### [NEW] server/routes/ + server/controllers/
| Route File | Endpoints |
|-----------|-----------|
| `auth.routes.js` | `POST /api/auth/send-otp`, `POST /api/auth/verify-otp` |
| `medicines.routes.js` | CRUD `/api/medicines` |
| `health.routes.js` | CRUD `/api/health` |
| `prescriptions.routes.js` | CRUD `/api/prescriptions` |
| `notifications.routes.js` | GET/PATCH `/api/notifications` |
| `sos.routes.js` | `POST /api/sos/trigger` |
| `users.routes.js` | GET/PUT `/api/users/profile` |

---

### Frontend — Client

#### [NEW] src/styles/index.css
Design tokens:
- `--bg-primary: #0D0F14` | `--bg-card: #161B25`
- `--blue: #3B82F6` (health) | `--green: #22C55E` (meds) | `--red: #EF4444` (SOS) | `--purple: #A855F7` (Rx) | `--gold: #EAB308` (achievements)
- Font: `Inter` from Google Fonts; large base size (18px) for elderly accessibility

#### [NEW] src/routes/AppRoutes.jsx
React Router v6 routes for all 20 screens.

#### [NEW] src/components/
| Component | Description |
|-----------|-------------|
| `BottomNav.jsx` | 5-tab nav (Home, Meds, Health, Prescriptions, Profile) |
| `Card.jsx` | Reusable glassmorphism-style dark card |
| `Button.jsx` | Primary/ghost/danger variants |
| `VitalsChart.jsx` | SVG sparkline chart for BP/Sugar/HR |
| `MedicineCard.jsx` | Medicine row with status badge (upcoming/taken/missed) |
| `SosButton.jsx` | Pulsating red SOS button |
| `Modal.jsx` | Overlay modal |
| `OtpInput.jsx` | 4-digit OTP box |
| `BadgeCard.jsx` | Achievement badge display |

#### [NEW] src/pages/ — 20 Screens

| # | File | Route | Color |
|---|------|-------|-------|
| 1 | `SplashPage.jsx` | `/` | Brand gradient |
| 2 | `Onboarding1Page.jsx` | `/onboarding/1` | Blue |
| 3 | `Onboarding2Page.jsx` | `/onboarding/2` | Green |
| 4 | `Onboarding3Page.jsx` | `/onboarding/3` | Red |
| 5 | `LoginPage.jsx` | `/login` | Dark neutral |
| 6 | `HomePage.jsx` | `/home` | Multi-color |
| 7 | `MedicineListPage.jsx` | `/medicines` | Green |
| 8 | `AddMedicinePage.jsx` | `/medicines/add` | Green |
| 9 | `ReminderDetailPage.jsx` | `/medicines/:id` | Green/Amber |
| 10 | `HealthDashboardPage.jsx` | `/health` | Blue |
| 11 | `VitalsDetailPage.jsx` | `/health/:type` | Blue |
| 12 | `PrescriptionsPage.jsx` | `/prescriptions` | Purple |
| 13 | `ViewPrescriptionPage.jsx` | `/prescriptions/:id` | Purple |
| 14 | `SosPage.jsx` | `/sos` | Red |
| 15 | `CareNetworkPage.jsx` | `/care-network` | Teal |
| 16 | `NotificationsPage.jsx` | `/notifications` | Neutral |
| 17 | `ProfilePage.jsx` | `/profile` | Neutral |
| 18 | `MedHistoryPage.jsx` | `/history` | Amber |
| 19 | `AiCoachPage.jsx` | `/ai-coach` | Indigo |
| 20 | `AchievementsPage.jsx` | `/achievements` | Gold |

---

## Verification Plan

### Automated
1. `npm run dev` in `/client` — verify Vite dev server starts on port 5173
2. `node index.js` in `/server` — verify Express starts on port 5000
3. Test API endpoints with browser subagent navigating all 20 screens

### Manual
- Open `http://localhost:5173` in Chrome DevTools → iPhone 14 Pro frame
- Walk complete flow: Splash → Onboarding → Login → Home → Add Medicine → Reminder → Mark Taken → Health Monitor → SOS → Achievements
- Verify charts render, SOS countdown fires, OTP flow accepts 4 digits
