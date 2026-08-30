<div align="center">

  <img src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200" alt="Rose International School Banner" width="100%" style="border-radius: 16px; margin-bottom: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);" />

  # 🏫 Rose International School (RIS)
  ### **Modern Academic Portal & Real-Time Faculty Management System**

  <p align="center">
    <a href="#-key-features"><strong>Explore Features »</strong></a> •
    <a href="#-faculty-roster"><strong>Faculty Roster »</strong></a> •
    <a href="#-cloud-architecture"><strong>Architecture »</strong></a> •
    <a href="#-quick-start"><strong>Quick Start »</strong></a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Status-Production%20Ready-emerald?style=for-the-badge&logo=shield" alt="Production Ready" />
    <img src="https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Responsive-Mobile%20First-blue?style=for-the-badge&logo=responsive" alt="Mobile First" />
    <img src="https://img.shields.io/badge/Platform-Web%20App-indigo?style=for-the-badge" alt="Web App" />
  </p>

</div>

---

## 📖 Overview

**Rose International School (RIS) Portal** is a production-grade, full-featured academic management and communication platform designed specifically for **Class 8-A and Class 8-B**. Built with a modern glassmorphism aesthetic, lightning-fast client-side routing, and real-time bidirectional cloud synchronization via **Supabase PostgreSQL**.

---

## 🌟 Key Features

### 🛡️ 1. Multi-Tiered Role Security & Permissions
- **👑 Principal / Administrator**: Full governance with Security PIN (`1612`), faculty leave approvals, attendance audit logs, and account management.
- **⚡ Super-Switcher Supervision**: Principal can switch seamlessly to any teacher or student profile without signing out, returning via the **`👑 Admin`** button.
- **👩‍🏫 Faculty Portal**: Verification protected by Teacher Security Passcode (`RIS2026`). Enables morning roll call, announcement broadcasting, and leave requests.
- **🎓 Student Profiles**: 100% **Read-Only Lock**. Students can view attendance scores, daily notices, and faculty status without permission to modify records.

### 📋 2. Morning Roll Call & Attendance System
- **Unmarked by Default**: Prevents false presence records by starting every morning register as `Unmarked / Pending`.
- **Fast Roll Call**: 1-click toggle between `Present (P)` and `Absent (A)`, with a **"Mark All Present"** bulk shortcut.
- **🌙 12:00 AM Midnight Rollover**: Background detector automatically resets daily attendance registers each morning.
- **📱 Mobile Sticky Bar**: Thumb-friendly floating save bar for teachers marking attendance on smartphones.

### 📢 3. Real-Time Notice Board
- **Audience Targeting**: Broadcast notices to *Whole School*, *Class 8-A*, *Class 8-B*, or *Staff Only*.
- **Priority Alerts**: Visual distinction for Normal, Important, and Urgent (`🚨 High Alert`) announcements.
- **Interactive Bell Dropdown**: Real-time unread counter badge with a 1-click **"Mark all as read"** action.

### 🏖️ 4. Faculty Attendance & Leave Management
- **Daily Faculty Check-In**: Teachers check in for morning duty with live timestamps.
- **Leave Application Workflow**: Faculty submit absence applications from their Dashboard or Staff tab.
- **Principal Authorization**: Only the School Principal has the security authority to Approve or Reject leaves with notes.

### 📊 5. Analytics & Absenteeism Monitoring
- **Class 8-A vs 8-B Performance**: Dynamic Chart.js visualizations calculating real-time presence rates.
- **⚠️ Low Presence Alert**: Automatically flags any student falling below the **85%** attendance threshold.
- **Instant Search**: Real-time search filter across student names and roll numbers.

---

## 👩‍🏫 Faculty Roster

| Faculty Member | Designation & Subject | Class Teacher Role |
| :--- | :--- | :---: |
| **Alina Ma'am** | English Faculty | **Class Teacher 8-A** |
| **Swapnil Ma'am** | Mathematics Faculty | **Class Teacher 8-B** |
| **Fina Ma'am** | Science Faculty | Subject Faculty |
| **Preeti Ma'am** | Hindi Faculty | Subject Faculty |
| **Rohit Sir** | Computer Science Faculty | Subject Faculty |
| **Ritu Ma'am** | General Knowledge (GK) Faculty | Subject Faculty |
| **Harsh Sir** | Physical Education & Games Faculty | Sports Faculty |
| **Rose Ma'am** | Physical Education & Games Faculty | Sports Faculty |
| **Lily Ma'am** | Music Faculty | Arts Faculty |
| **Priyanshi Ma'am** | Music Faculty | Arts Faculty |
| **Heena Ma'am** | Art & Craft Faculty | Arts Faculty |

---

## 🎓 Student Database (30 Seed Records)

- **Class 8-A (15 Students)**: `Aarav Sharma (8A-01)`, `Ananya Gupta (8A-02)`, `Rohan Patel (8A-03)`, `Diya Singh (8A-04)`, `Vihaan Joshi (8A-05)`, `Ishita Mehta (8A-06)`, `Kabir Nair (8A-07)`, `Meera Reddy (8A-08)`, `Arjun Aggarwal (8A-09)`, `Sanjana Choudhury (8A-10)`, `Yash Malhotra (8A-11)`, `Pooja Saxena (8A-12)`, `Aditya Roy (8A-13)`, `Riya Rao (8A-14)`, `Siddharth Chopra (8A-15)`.
- **Class 8-B (15 Students)**: `Tanvi Kulkarni (8B-01)`, `Varun Shah (8B-02)`, `Sneha Das (8B-03)`, `Devansh Vardhan (8B-04)`, `Anishka Iyer (8B-05)`, `Harsh Bhatia (8B-06)`, `Kavya Kapoor (8B-07)`, `Dev Pandey (8B-08)`, `Navya Bansal (8B-09)`, `Ishan Dutta (8B-10)`, `Priya Mishra (8B-11)`, `Reyansh Jain (8B-12)`, `Shreya Sengupta (8B-13)`, `Tanishq Verma (8B-14)`, `Trisha Sharma (8B-15)`.

---

## 🏗️ Architecture & Tech Stack

```
RIS-School-App/
├── index.html                   # HTML5 Entry Point & Semantic Layout
├── css/
│   └── styles.css               # Glassmorphism UI, Dark Mode & Mobile CSS
├── js/
│   ├── app.js                   # Client Router, Global Handlers & State Reconciler
│   ├── db.js                    # Supabase PostgreSQL Cloud Client (Realtime Sync)
│   ├── mockData.js              # Faculty Roster, 30 Students & Initial Seed Data
│   ├── store.js                 # Central Reactive State Store & Business Logic
│   └── components/
│       ├── navbar.js            # Responsive Header, Bell Dropdown & Principal Switcher
│       ├── login.js             # Security Gated Multi-Role Portal
│       ├── dashboard.js         # Role-Tailored Dashboards (Admin, Teacher, Student)
│       ├── notices.js           # Announcement Broadcasting Feed
│       ├── studentAttendance.js # Daily Morning Roll Call Register
│       ├── staffAttendance.js   # Faculty Check-In & Leave Review Workflow
│       └── reports.js           # Chart.js Analytics & Low Presence Monitoring
├── netlify.toml                 # 1-Click Netlify Production Configuration
├── vercel.json                  # 1-Click Vercel Production Configuration
└── README.md                    # Project Documentation & Architecture Guide
```

---

## 🚀 Quick Start & Deployment

### Local Setup
```bash
# Clone the repository
git clone https://github.com/ghmaxx5/RIS-WEBSITE.git

# Navigate to project folder
cd RIS-WEBSITE

# Run with any static HTTP server (or PowerShell server.ps1)
powershell -ExecutionPolicy Bypass -File ./server.ps1
```

### Free Cloud Deployment
- **Vercel**: Import repository into [vercel.com](https://vercel.com) and deploy directly.
- **Netlify**: Drag and drop the root folder into [app.netlify.com/drop](https://app.netlify.com/drop).

---

<div align="center">
  <p>© 2026 <strong>Rose International School (RIS)</strong>. All Rights Reserved.</p>
  <p>Crafted for Excellence in Academic Administration.</p>
</div>
