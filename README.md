<<<<<<< HEAD
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
cd server
# Edit .env with your MySQL credentials
npm install
node index.js          # Runs on http://localhost:5000
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
=======
# MediDoseCare
understand the name of repo then you can know the description.
>>>>>>> 0b3265c070a6d2b5f57283aa71956839439905bd
