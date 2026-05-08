# 🏎️ Velox Treasury Engine (YC Demo Day Ready)

> A high-performance, enterprise-grade financial reconciliation and treasury platform built for modern startups.

![Velox Fintech Demo](https://raw.githubusercontent.com/daniel001-beep/Velox-Fintech/main/public/demo.png)

## 📋 Overview

Velox is an institutional-grade treasury dashboard designed to give CFOs a single pane of glass for fiat, crypto staking, and venture debt. Built on a state-of-the-art edge architecture, it features a strictly ACID-compliant "Atomic Transfer Engine," real-time ledger synchronization, and comprehensive enterprise security out of the box.

This repository represents the **core frontend, API architecture, and database logic** for the Velox platform.

### ✨ What's New (Demo Day Build)
✅ **Atomic Transfer Engine**: A slide-to-confirm transfer interface guaranteed by PostgreSQL `BEGIN/COMMIT` transactional locks to eliminate double-spend race conditions.  
✅ **Super Admin Hub**: A restricted control plane for order reconciliation and global system health monitoring.  
✅ **User Auditing & KYC**: A brand new User Management module tracking active sessions, KYC/AML statuses, and suspicious account freezing.  
✅ **Agentic Command Bar**: A `Cmd+K` AI-powered search bar for rapid data extraction and simulated CSV report generation.  
✅ **Mobile-First Responsiveness**: Re-engineered dashboard grid structures and touch-friendly horizontal table scrolling.  
✅ **Enterprise Security Hardening**: Implemented NextAuth RBAC middleware, Zero-Trust API routes, and XSS (Cross-Site Scripting) sanitization via DOMPurify.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Glassmorphism |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/) (Credentials + JWT) |
| **Database ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Database** | PostgreSQL (Supabase) with RLS |
| **Security** | DOMPurify (XSS Protection) |

---

## 🚀 Quick Start (Demo Mode)

Get the Velox Treasury Engine running locally in under 2 minutes.

### 1. Clone the repository
```bash
git clone https://github.com/daniel001-beep/Velox-Fintech.git
cd Velox-Fintech
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```
Fill in your `.env.local`:
- `AUTH_SECRET`: Generate one using `npx auth secret`
- `ADMIN_EMAIL`: `idowuisdaniel1@gmail.com` (Grants Super Admin access)

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application. 
*(Note: To bypass the login screen for demo purposes, enter the authorized `ADMIN_EMAIL` and any password).*

---

## 📂 Architecture

```text
app/
├── api/                  # Zero-Trust API routes (auth, admin, db-health)
├── auth/                 # Authentication pages (signin, signup)
├── components/           # Reusable UI (AgenticCommandBar, SendMoneyCard)
├── fintech/              # Core Application
│   ├── admin/            # Super Admin Hub (Orders, User Management)
│   ├── dashboard/        # Main portfolio analytics view
│   ├── ledger/           # Atomic Transfer Engine & Transaction history
│   ├── marketplace/      # Venture Debt & Crypto Staking products
│   └── security/         # Security auditing and Active Sessions
└── page.tsx              # Root redirect middleware
```

---

## 🔐 Security & Compliance (Defense In Depth)

Velox is designed to handle institutional capital. Security is not an afterthought.

- **Role-Based Access Control (RBAC)**: All administrative endpoints (`/admin/*`) are strictly firewalled by Next.js Edge Middleware. Unauthorized sessions are instantly rejected.
- **XSS Protection**: All user-generated text (like Transfer Notes) is sanitized via `DOMPurify` before hitting the database or the DOM.
- **Zero-Trust APIs**: Every backend endpoint independently validates the cryptographic JWT signature before executing operations.
- **ACID Transactions**: Financial ledger mutations are grouped into strict PostgreSQL RPC functions ensuring database consistency under heavy concurrent load.

---

## 🤝 Contributing

We welcome contributions from the open-source community! 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

*Velox Treasury Engine - Move fast. Settle securely.*
