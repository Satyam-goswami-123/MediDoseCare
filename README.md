# MediDose Care 💊

A full-stack healthcare platform for senior citizens — smart medicine reminders, health monitoring, prescription management, and emergency SOS.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MySQL 8 |

## Project Structure
```
MediDoseCare/
├── client/   — React + Vite frontend (20 screens)
└── server/   — Node.js + Express API
```

## Quick Start

### 1. Database Setup
```sql
-- In MySQL Workbench or CLI:
source server/schema.sql
```

### 2. Server Setup
```bash
cd MediDoseCare
# Install backend dependencies at repo root
npm install
node server/index.js   # Runs on http://localhost:5000
```

Create `.env` in repository root with:
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=medidosecare

# Auth
JWT_SECRET=change_this_secret

# Email OTP (required for real email OTP delivery)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
SMTP_FROM="MediDoseCare <your_email@gmail.com>"
CLIENT_URL=http://localhost:5173
```

### 3. Client Setup
```bash
cd client
npm install
npm run dev            # Runs on http://localhost:5173
```

### 4. Open App
Open http://localhost:5173 in Chrome DevTools > iPhone 14 Pro device frame

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/send-otp | Send OTP |
| POST | /api/auth/verify-otp | Verify OTP & login |
| GET | /api/medicines | Get medicines |
| POST | /api/medicines | Add medicine |
| GET | /api/health | Get health logs |
| POST | /api/health | Log vitals |
| GET | /api/prescriptions | Get prescriptions |
| POST | /api/sos/trigger | Trigger SOS |
| GET | /api/notifications | Get notifications |
| GET | /api/users/profile | Get profile |

## Features
- 💊 Medicine reminders with taken/missed status
- ❤️ Health vitals tracking (BP, Sugar, HR, SpO₂)
- 📋 Digital prescription storage
- 🆘 One-tap Emergency SOS with countdown
- 🤖 AI health coach with personalized insights
- 🏆 Gamification — streaks, badges, weekly heatmap
- 👥 Care network — doctors & caregivers
- 📱 OTP-based authentication
- 🎙️ Voice assistant integration ready

> **Note:** The app runs in demo mode without MySQL connection — all demo data is pre-loaded in the React context.
