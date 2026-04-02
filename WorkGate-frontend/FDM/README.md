# WorkGate – Employee Portal

FDM Group employee portal built with **Vite + React**. Green & black FDM colour scheme.

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # App shell with sidebar + topbar
│   ├── Layout.module.css
│   ├── Sidebar.jsx         # Navigation sidebar
│   ├── Sidebar.module.css
│   ├── Topbar.jsx          # Top bar with page title + quick actions
│   ├── Topbar.module.css
│   └── Modal.jsx           # Reusable modal component
├── pages/
│   ├── Dashboard.jsx       # Home dashboard with stats & overview
│   ├── Dashboard.module.css
│   ├── Profile.jsx         # Employee profile + skills management
│   ├── Profile.module.css
│   ├── Timesheet.jsx       # Weekly timesheet entry & submission
│   ├── Timesheet.module.css
│   ├── Tasks.jsx           # Onboarding, operational & upskilling tasks
│   ├── Leave.jsx           # Annual leave requests & history
│   ├── Expenses.jsx        # Expense claims with receipt upload
│   ├── News.jsx            # Company news feed with category filters
│   ├── News.module.css
│   ├── Leaderboard.jsx     # Skill score leaderboard
│   ├── Leaderboard.module.css
│   ├── IT.jsx              # IT support tickets + knowledge base
│   ├── IT.module.css
│   └── HR.jsx              # HR reports with anonymous submission
├── styles/
│   ├── global.css          # CSS variables, resets, animations
│   └── components.css      # Shared utility classes (btn, card, badge, table, form)
├── data/
│   └── mockData.js         # Mock data (swap out for real API calls)
├── App.jsx                 # React Router route definitions
└── main.jsx                # Entry point
```

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

## Connecting to a Backend

Replace mock data in `src/data/mockData.js` with API calls.
All pages use local state — lift state up or add a state manager (Zustand / TanStack Query) as needed.

## Design Tokens

All colours and spacing live in `src/styles/global.css` as CSS custom properties.
Primary brand green: `--green: #00a651`
