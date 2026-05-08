# 🏎️ Velox Fintech Dashboard

> An enterprise-grade financial management platform with real-time portfolio analytics, secure transaction handling, and AI-powered insights.

![Velox Fintech Demo](https://raw.githubusercontent.com/daniel001-beep/Velox-Fintech/main/public/demo.png)

## 📋 Overview

Velox Fintech is a highly scalable, high-concurrency financial operations dashboard. Built for modern financial institutions, it features an enterprise "glassmorphism" aesthetic, real-time data visualization, and an autonomous financial marketplace.

This repository represents the **core frontend and API architecture** for the Velox Fintech product, built on a state-of-the-art Next.js 15 stack.

### Key Features
✅ **Real-Time Portfolio Analytics**: Interactive `Recharts` data visualization for asset allocation and performance tracking.  
✅ **Financial Marketplace**: Browse and integrate modular financial APIs (Fraud Detection, Multi-Currency Engines, etc.).  
✅ **Enterprise Security**: Row Level Security (RLS) data isolation and NextAuth.js authentication.  
✅ **AI-Powered Insights**: Integrated AI chat assistant for rapid financial querying and ledger analysis.  
✅ **Zero-Trust Architecture**: Admin-only control planes and strict API route protection.  

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Authentication** | [NextAuth.js v5 (Auth.js)](https://authjs.dev/) |
| **Database ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Database** | PostgreSQL |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Quick Start

Get the Velox Fintech dashboard running locally in under 3 minutes.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/daniel001-beep/Velox-Fintech.git
cd Velox-Fintech
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Copy the example environment file:
\`\`\`bash
cp .env.example .env.local
\`\`\`
Fill in your credentials in `.env.local`:
- `AUTH_SECRET`: Generate one using \`npx auth secret\`
- `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`: Your Google OAuth credentials
- `POSTGRES_URL`: Your PostgreSQL connection string

### 4. Database Migrations
Push the Drizzle schema to your database:
\`\`\`bash
npm run db:push
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Repository Architecture

We maintain a strict, domain-driven folder structure to ensure high development velocity and maintainability.

\`\`\`
app/
├── api/                  # Secure API routes (auth, admin, db-health)
├── auth/                 # Authentication pages (signin, signup)
├── components/           # Reusable UI components and charts
├── fintech/              # Core Application
│   ├── admin/            # Protected admin control plane
│   ├── dashboard/        # Main portfolio analytics view
│   ├── ledger/           # Transaction history and ledgers
│   ├── marketplace/      # Financial API product discovery
│   └── security/         # Security and audit logs
├── db-status/            # System health monitoring
└── page.tsx              # Root redirect to /fintech/dashboard
\`\`\`

---

## 🔐 Security & Compliance

Velox Fintech is designed with **SOC 2 Type II** compliance in mind. 
- **Authentication**: All API routes and pages are protected by NextAuth middleware. Unauthenticated users are strictly redirected.
- **Data Isolation**: Database queries enforce strict `userId` checks (RLS equivalents at the application layer) to prevent cross-tenant data leakage.
- **Admin Access**: Role-based access control (RBAC) ensures only users with the `isAdmin` flag can access the `/fintech/admin` routes or administrative APIs.

---

## 🤝 Contributing

We welcome contributions from the open-source community! 
1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

---
**License:** Proprietary - Velox Fintech | Built by [Idowu Daniel](https://mail.google.com/mail/?view=cm&fs=1&to=idowuisdaniel1@gmail.com&su=Inquiry%20regarding%20Velox%20Fintech%20Architecture)

*Velox Fintech - Built for the future of finance.*
