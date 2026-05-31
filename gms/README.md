# ⚡ TITAN GMS ⚡

### **High-Octane Enterprise Gym Management System (MERN Stack)**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Tech Stack](https://img.shields.io/badge/tech--stack-MERN-orange.svg)](#)
[![Design](https://img.shields.io/badge/design-high--octane%20dark-blueviolet.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](#)

---

## Project Vision & Design Philosophy

**TITAN GMS** is a premium, full-stack, enterprise-grade gym management platform designed for strength laboratories, boutique athletic clubs, and high-performance training centers. 

Instead of traditional, sterile white panels common in corporate SaaS templates, TITAN GMS commands authority with a **High-Octane Industrial Aesthetic**—featuring high-contrast deep grays, pure blacks, and a vibrant **Electric Lime / Neon Yellow** accent palette (`#D4FF00`). The interface feels alive, incorporating glassmorphism, micro-animations, custom confirmations, and real-time state notifications.

---

## Core System Documentation

To understand the core design choices, system architecture, and API details, check out the specialized documents:

* 📄 **[Product Requirements Document (PRD)](./docs/PRD.md)** - Explains the target audience, functional specifications, role-based workflows, and product roadmap.
* ⚙️ **[Technical Requirements Document (TRD)](./docs/TRD.md)** - Details the database model, entity relationships, API routing schemas, security middleware, and daily hydration tracker persistence specifications.

---

## 👥 Role-Based Access Control (RBAC)

TITAN GMS features absolute data segregation and custom portals for three system roles:

| Feature Roster | Administrator | Personal Trainer |Gym Member |
| :--- | :---: | :---: | :---: |
| **Global Financial Analytics** | ✅ Full Access | ❌ Restricted | ❌ Restricted |
| **Manage Staff (Hiring/Firing)**| ✅ Full Access | ❌ Restricted | ❌ Restricted |
| **Onboard / Edit Members** | ✅ Full Access | ❌ Restricted | ❌ Restricted |
| **Scoped Trainee Roster** | ➖ (Global List) | ✅ Assigned Only | ❌ Restricted |
| **Workout & Diet Allocation** | ✅ Full Access | ✅ Full Access | View Only |
| **Physical Check-In & Scanning**| ✅ Full Scanner | ✅ Manual Scan | Self-Service Check-In |
| **Personal Fitness Tracker** | ❌ Restricted | ❌ Restricted | Interactive Hydration |
| **Payment Ledger & Receipts** | ✅ Record / Log | ❌ Restricted | View / Download |

---

## 🛠️ Technical Stack

### **Frontend Client**
* **Framework:** React 19 + Vite 8
* **Routing:** React Router v7
* **State Management:** Redux Toolkit (Thunks, asynchronous slices)
* **Styling & Animations:** Tailwind CSS v4 + Framer Motion (glassmorphic sheets, hover transitions)
* **Charts & Indicators:** Recharts (responsive analytics trends)

### **Backend Server**
* **Runtime Platform:** Node.js
* **Framework:** Express.js REST API
* **Database Layer:** Mongoose ODM + MongoDB Atlas
* **Security & Auth:** JSON Web Tokens (JWT) + bcryptjs salting

---

## 📂 System File Layout

```bash
/gms
├── /server                 # Node/Express API Server
│   ├── /config             # Configuration connections
│   ├── /middleware         # Token verification & authorization gates
│   ├── /models             # Mongoose schemas (User, Member, Trainer, etc.)
│   ├── /routes             # REST endpoint controllers
│   ├── db.js               # Offline JSON database fallback driver
│   ├── db.json             # Seed data mockup cache
│   └── migrate.js          # MongoDB Atlas seeder tool
├── /src                    # React Client SPA
│   ├── /components         # Global UI Elements & Modal gates
│   ├── /features           # Redux state slices (authSlice, gymSlice)
│   ├── /pages              # Dashboard router pages
│   ├── /services           # Axios endpoints config
│   ├── App.jsx             # Route guards mapping
│   └── main.jsx            # Context providers entrypoint
├── /docs                 
│   ├── PRD.md              # Product Specification
│   ├── TRD.md              # Architecture & Schema specs 
```

---

## 🚀 Quick Start & Installation

### Prerequisites
Make sure you have [Node.js (v18+)](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your local machine.

### 1. Repository Setup & Dependencies
Clone the repository and install dependencies at the root directory:
```bash
git clone <your-repository-url>
cd gms
npm install
```

### 2. Backend Environment Configuration
Navigate to the `/server` directory and create a `.env` file:
```bash
cd server
touch .env
```
Populate `.env` with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_cryptographic_jwt_key
NODE_ENV=development
```

### 3. Data Migration & Seeding
To populate MongoDB Atlas with initial members, transactions, check-ins, and gym layouts:
```bash
# In the /server directory
node migrate.js
```
> **Note:** If MongoDB is offline, TITAN GMS will automatically boot in **Offline Mock Mode**, falling back to `/server/db.json` for read/write operations so you can test features without a live connection.

### 4. Running the Application

To run the full stack simultaneously (Backend on port `5000` & Frontend Client on port `5173`):

* **Launch Backend Server:**
  ```bash
  # From the workspace root
  npm run server
  ```
* **Launch Client SPA:**
  ```bash
  # From the workspace root
  npm run dev
  ```

---

## ⚡ Key Highlights & Premium Details

* **Interactive Hydration Engine:** Inside the member's portal, the Water Tracker persists logs locally using dynamic date-scoped keys (`water_intake_userId_date`). It automatically handles daily resets and inline target updates.
* **ConfirmModal Security:** Replaces native browser popups with dynamic confirm modals featuring customized brand buttons.
* **Instant Digital Invoicing:** Generates print-ready billing layouts matching the industrial branding directly inside transaction summaries.