# 🚀 Matrix Finance - Enterprise Finance & Loan Ledger Management System

Matrix Finance is an internal business administration, customer loan portfolio, and daily EMI ledger management system built with **React 19**, **TypeScript**, **Tailwind CSS**, **Dexie IndexedDB**, and a **Node.js Express + Firebase Realtime Database Backend**.

---

## 🌟 Key Features

- 📊 **Executive Financial Dashboard**: Real-time loan portfolio status, monthly collections, donut chart breakdown, and compact 7-day sparkline performance widgets.
- 👥 **Customer Directory**: Manage borrower profiles, view individual payment ledgers, and reset/onboard customer portfolios.
- 💳 **Loan Portfolio Management**: Track active, completed, overdue, and pending loans with automatic EMI calculations.
- 📄 **PDF & Excel Exports**: Download official Loan Completion & No Dues PDF Certificates and Excel CSV statements.
- ⏰ **Live Header Clock & Calendar**: Real-time date and time display with interactive Mini Sidebar Calendar ledger breakdown.
- 🔔 **System Alert Center**: Overdue notifications, customer onboarding alerts, with individual delete & clear all options.
- ↺ **5-Second UNDO Safety Timer**: 5-second dynamic countdown timer for restoring accidentally deleted loan files.
- 🔥 **Firebase Realtime Database Backend**: Dedicated Express backend connected to Firebase Realtime Database for live cross-device synchronization.

---

## 📁 Repository Structure

```
darun04/
├── frontend/             # React 19 + Vite + TypeScript + Tailwind CSS App
│   ├── src/              # Components, Pages, Context, Database, Services
│   ├── public/           # Static assets & custom Matrix Finance logo
│   └── package.json
└── backend/              # Node.js + Express + Firebase Admin SDK Backend
    ├── src/              # Server endpoints (/api/health, /api/stats)
    ├── database.rules.json
    └── package.json
```

---

## 🛠️ Quick Start

### 1. Run Frontend (React Dev Server)
```bash
cd frontend
npm install
npm run dev
```
👉 Frontend runs on **`http://localhost:5173/`**

### 2. Run Backend (Express + Firebase)
```bash
cd backend
npm install
npm start
```
👉 Backend service runs on **`http://localhost:5000`**

---

## 🔐 Credentials & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Dexie.js, Recharts, Framer Motion, jsPDF
- **Backend**: Node.js, Express.js, Firebase Admin SDK, Firebase Realtime Database
- **Persistence**: Browser LocalStorage & Local IndexedDB fallback

