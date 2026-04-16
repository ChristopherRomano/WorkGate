# WorkGate – Employee Portal

FDM Group employee portal. React frontend + Spring Boot backend with a SQLite database.

---

## Prerequisites

- **Node.js** (v18+)
- **Java 17+** and **Maven** (or use the included `mvnw` wrapper)

---

## Running the App

### 1. Backend (Spring Boot)

```bash
cd WorkGate-backend/FDM

# With Maven installed
mvn spring-boot:run

# Or with the wrapper (no Maven install needed)
./mvnw spring-boot:run        # macOS/Linux
mvnw.cmd spring-boot:run      # Windows
```

The backend starts at **http://localhost:8080**.
The SQLite database file (`workgate.db`) is created automatically in `WorkGate-backend/FDM/` on first run.

### 2. Frontend (Vite + React)

```bash
cd WorkGate-frontend/FDM

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

The frontend starts at **http://localhost:5173**.

> Run both the backend and frontend at the same time — the frontend calls the backend API.

---

## Project Structure

```
WorkGate/
├── WorkGate-backend/FDM/
│   └── src/main/java/com/WorkGate/FDM/
│       ├── controller/         # REST controllers (auth, employee, leave, tasks, etc.)
│       ├── model/              # JPA entity classes
│       ├── repository/         # Spring Data JPA repositories
│       ├── DTO/                # Data transfer objects
│       └── config/             # CORS and other config
│
└── WorkGate-frontend/FDM/
    └── src/
        ├── components/
        │   ├── Layout.jsx          # App shell with sidebar + topbar
        │   ├── Sidebar.jsx         # Navigation sidebar
        │   ├── Topbar.jsx          # Top bar with page title + quick actions
        │   └── Modal.jsx           # Reusable modal component
        ├── pages/
        │   ├── Dashboard.jsx       # Home dashboard with stats & overview
        │   ├── Profile.jsx         # Employee profile + skills management
        │   ├── Timesheet.jsx       # Weekly timesheet entry & submission
        │   ├── Tasks.jsx           # Onboarding, operational & upskilling tasks
        │   ├── Leave.jsx           # Annual leave requests & history
        │   ├── Expenses.jsx        # Expense claims with receipt upload
        │   ├── News.jsx            # Company news feed with category filters
        │   ├── Leaderboard.jsx     # Skill score leaderboard
        │   ├── IT.jsx              # IT support tickets + knowledge base
        │   └── HR.jsx              # HR reports with anonymous submission
        ├── styles/
        │   ├── global.css          # CSS variables, resets, animations
        │   └── components.css      # Shared utility classes
        ├── data/
        │   └── mockData.js         # Fallback mock data
        ├── App.jsx                 # Route definitions
        └── main.jsx                # Entry point
```

---

## Pages

| Route | Page | Key Features |
|---|---|---|
| `/` | Dashboard | Stats, tasks, news, expenses, leave overview |
| `/profile` | My Profile | Personal details, skills, download FDM profile |
| `/timesheet` | Timesheet | Weekly grid, project codes, draft/submit |
| `/tasks` | Tasks | Onboarding, operational, upskilling with filters |
| `/leave` | Annual Leave | Request leave, cancel pending, view history |
| `/expenses` | Expenses | Submit claims, receipt upload, status tracking |
| `/news` | News Feed | Category filters, pinned posts |
| `/leaderboard` | Leaderboard | Skill rankings, opt-out toggle |
| `/it` | IT Support | Raise tickets, knowledge base search |
| `/hr` | HR Reports | Anonymous & named submission |

---

## Design Tokens

All colours and spacing are defined as CSS custom properties in `WorkGate-frontend/FDM/src/styles/global.css`.

Primary brand green: `--green: #00a651`
