# Nabd Space
## Employee Wellbeing and HR Administration Platform

**Bachelor of Information Technology - Systems Development and Administration**

Nabd Space is a web application that helps organizations support employee wellbeing through gentle daily check-ins, supportive follow-up, wellness programs, rewards, session booking, notifications, and HR analytics.

The platform follows a non-stigmatizing approach: employees receive private, supportive tools, while administrators receive aggregated operational insights for responsible follow-up.

## Table of Contents

1. [Project Idea](#project-idea)
2. [Problem and Solution](#problem-and-solution)
3. [Main Features](#main-features)
4. [Target Users](#target-users)
5. [Technology Stack](#technology-stack)
6. [Architecture](#architecture)
7. [Database Schema](#database-schema)
8. [Pages and Routes](#pages-and-routes)
9. [Roles and Permissions](#roles-and-permissions)
10. [User Flows](#user-flows)
11. [Interface Screenshots](#interface-screenshots)
12. [How to Run](#how-to-run)
13. [Current Implementation Notes](#current-implementation-notes)
14. [Future Work](#future-work)
15. [Team](#team)
16. [Project Structure](#project-structure)

## Project Idea

Nabd Space provides a calm digital environment for workplace wellbeing. Its objectives are:

- Daily mood and wellbeing check-ins.
- Supportive follow-up for employees who may need outreach.
- Points, rewards, and badges that encourage consistent participation.
- Wellness sessions such as yoga, group exercises, and relaxation activities.
- HR dashboards for employee records, leave information, attendance, and wellbeing indicators.
- Analytics and reports that help administrators identify trends without exposing unnecessary personal details.

## Problem and Solution

### Problem

- Employees may experience stress, low morale, or burnout without a simple way to communicate their daily state.
- HR teams often lack a consistent and lightweight method for monitoring engagement and wellbeing.
- Asking for support can carry social stigma.
- Wellness activities, leave information, and wellbeing signals may be spread across disconnected processes.

### Solution

Nabd Space combines these workflows in one application:

- A five-question daily check-in with a simple 1-to-5 scale.
- Supportive language such as "needs outreach" instead of alarming labels.
- Private employee views for mood responses, points, rewards, sessions, and notifications.
- Administrative views for trends, follow-up cases, HR records, leave requests, reports, and uploads.
- Mock data by default, with optional Supabase integration for authentication, storage, and persistent database operations.

## Main Features

### Employee Experience

| Feature | Description |
| --- | --- |
| Employee dashboard | Shows daily progress, points balance, support status, upcoming sessions, and recent notifications. |
| Mood check-in | Five daily questions with progress tracking, duplicate prevention, and points after completion. |
| Points and rewards | Displays current points, progress toward the next threshold, ledger history, badges, and Ikigai reflection prompts. |
| Sessions calendar | Shows available sessions, remaining seats, booking status, Hoshizora relaxation scenes, and Radio Taiso group exercises. |
| Notifications | Displays personal notifications and quiet-hours information. |
| Leave requests | Allows employees to view and submit leave-related information according to the current workflow. |
| Wellness challenges | Provides wellbeing challenge content and participation flows. |
| Kaizen Box | Provides a structured space for employee improvement ideas and feedback. |

### Administrator Experience

| Feature | Description |
| --- | --- |
| Admin dashboard | Presents participation, distributed points, follow-up cases, wellbeing and absence indicators, and trend notes. |
| HR dashboard | Combines HR and wellbeing summaries for management review. |
| Employee directory | Provides searchable employee records with department, role, wellbeing, absence, and status indicators. |
| Leave management | Displays leave requests and supports administrative review actions. |
| Analytics and monitoring | Provides mood trends, department comparisons, automatic classifications, and department status charts using Recharts. |
| Reports | Provides report summaries, filtering, tables, and export-oriented workflows. |
| File uploads | Supports CSV preview, validation, and employee data upload through Supabase Storage when configured. |
| Session administration | Allows administrators to add sessions and manage available capacity. |
| Notifications | Provides notification review and read-state management. |

## Target Users

- Employees who want a private, low-friction way to track wellbeing and access support.
- HR administrators responsible for employee wellbeing and people operations.
- Small and medium-sized organizations that need a unified wellbeing prototype.

## Technology Stack

### Frontend

| Technology | Version | Use |
| --- | --- | --- |
| React | 18.3.1 | User interface and component rendering. |
| TypeScript | 5.5.2 | Typed application development. |
| Vite | 5.3.1 | Development server and production build. |
| Tailwind CSS | 3.4.4 | Utility classes for layout. |
| React Router | 7.18.1 | Client-side routing and protected routes. |
| Recharts | 2.12.7 | Analytics charts. |
| Lucide React | 0.400.0 | Interface icons. |

### Backend and Data

- Supabase PostgreSQL for persistent data when environment variables are configured.
- Supabase Auth for real authentication and session management.
- Supabase Storage for file uploads.
- Row Level Security policies for data access control.
- Mock data fallback so the application can be demonstrated without a backend.
- Local storage for mock authentication and selected client-side state.

### Design and Language

- English is the default application language and the recently standardized pages use English-only visible copy.
- The language context and toggle remain available for the existing Arabic RTL translation layer.
- The visual system uses a dark Lavender Pulse theme with lavender, pink, cyan, green, amber, and red status accents.
- The interface is responsive and uses Inter, Sora, and JetBrains Mono font families through the project font styles.

## Architecture

The application follows a layered React architecture:

```text
Browser
  |
  +-- App.tsx and React Router
  |     +-- Public pages: Landing, Login, Signup
  |     +-- Protected pages by role
  |
  +-- AppShell and reusable UI components
  |     +-- Navigation, theme, language, loading, and data states
  |
  +-- Page modules
  |     +-- Employee workflows
  |     +-- Administrator and HR workflows
  |
  +-- Business logic: src/lib/dashboardData.ts
  |
  +-- Data layer
        +-- src/mock-data/* fallback data
        +-- Supabase Auth, PostgreSQL, and Storage
```

Application providers include:

- `ThemeProvider` for shared theme and light/dark mode tokens.
- `LangProvider` for English/Arabic language state and document direction.
- `BootProvider` for authentication and application boot state.
- `ProtectedRoute` for employee and administrator access control.
- `AppShell` for authenticated navigation and shared page framing.
- `DataState` for loading, data, and empty states.

## Database Schema

The Supabase migration in `supabase/migrations/001_init_hr_schema.sql` defines the main data model. The application uses or supports these entities:

- **Users:** identity, name, email, role, department, and employee number.
- **Pulse questions and responses:** active daily questions and employee response values.
- **Points ledger:** point changes, reasons, timestamps, and related users.
- **Rewards and user rewards:** reward thresholds and achievements.
- **Yoga sessions and attendance:** session details, capacity, and unique user/session bookings.
- **Notifications and critical alerts:** personal notifications, read state, alert levels, messages, and resolution state.
- **HR and leave data:** employee records, leave requests, attendance or absence indicators, and wellbeing summaries.

Daily check-in completion and session attendance use unique relationships to prevent duplicate records. Supabase Row Level Security protects live records when the backend is enabled.

## Pages and Routes

### Public Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Landing | Product introduction and entry actions. |
| `/login` | Login | Employee or administrator sign-in. |
| `/signup` | Signup | New account registration. |

### Employee Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/employee` | Employee Dashboard | Personal wellbeing overview. |
| `/mood` | Mood Questions | Daily five-question check-in. |
| `/points` | Points & Rewards | Points, ledger, badges, and Ikigai prompts. |
| `/sessions` | Sessions Calendar | Browse and book sessions. |
| `/notifications` | Notification System | Review personal notifications and quiet hours. |
| `/leaves` | Leaves | View or submit leave-related information. |
| `/kaizen` | Kaizen Box | Submit improvement ideas and feedback. |
| `/challenges` | Wellness Challenges | Participate in wellbeing challenges. |

### Administrator Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/admin` | Admin Dashboard | Organization-level wellbeing overview. |
| `/hr` | HR Dashboard | HR and wellbeing monitoring. |
| `/employees` | Employee Directory | Search and review employee records. |
| `/leaves` | Leaves | Review leave requests. |
| `/upload` | Upload Files | Preview, validate, and upload CSV data. |
| `/reports` | Reports | Review report summaries and export workflows. |
| `/analytics` | Analytics & Monitoring | View trend and classification charts. |
| `/analytics-2` | Standalone Analytics | Compare report data in a secondary view. |
| `/sessions` | Sessions Calendar | Add and manage sessions. |
| `/notifications` | Notification System | Review notifications and realtime state. |

### Utility Route

| Route | Page | Purpose |
| --- | --- | --- |
| `/heart-loader` | Heart Loader | Demonstrates the animated Nabd loading screen. |

## Roles and Permissions

### Employee

- Complete the daily mood check-in once per day.
- View personal points and rewards.
- Book available wellness sessions.
- View personal notifications.
- Use employee wellbeing workflows such as leaves, challenges, and Kaizen Box.

### Administrator

- View organization-level dashboards and analytics.
- Review employees, absence indicators, leave requests, and follow-up cases.
- Add sessions and manage administrative workflows.
- Upload employee CSV files when Supabase Storage is configured.
- Review reports and notification activity.

The protected route layer uses the authenticated role to prevent unauthorized access to role-specific pages. Supabase RLS protects live records when the backend is enabled.

## User Flows

### Employee Flow

```text
Landing -> Sign in -> Employee Dashboard
                         |
       +-----------------+------------------+
       |                 |                  |
       v                 v                  v
  Mood Check-in     Points & Rewards    Sessions
       |                 |                  |
       v                 v                  v
  Five answers      View balance       Choose a session
  -> receive        and badges          -> book a seat
  points
```

### Administrator Flow

```text
Landing -> Sign in -> Admin Dashboard
                         |
     +-----------+-------+---------+-----------+
     |           |                 |           |
     v           v                 v           v
    HR       Employees          Reports     Analytics
     |           |                 |           |
     v           v                 v           v
  Review      Search          Filter and    Compare trends
  indicators  records         export data  and departments
```

## Interface Screenshots

Screenshots are stored in the `screenshots/` directory:

1. `01-landing.png` - Landing page.
2. `02-login.png` - Login page.
3. `03-employee-dashboard.png` - Employee dashboard.
4. `04-mood-questions.png` - Daily mood check-in.
5. `05-points-rewards.png` - Points and rewards.
6. `06-sessions-calendar.png` - Sessions calendar.
7. `07-notifications.png` - Notifications.
8. `08-admin-dashboard.png` - Admin dashboard.
9. `09-reports.png` - Reports.
10. `10-analytics.png` - Analytics.
11. `11-analytics-compare.png` - Secondary analytics comparison.
12. `12-upload-files.png` - CSV upload workflow.
13. `13-signup.png` - Signup page.

Example:

```md
![Employee Dashboard](./screenshots/03-employee-dashboard.png)
```

## How to Run

### Requirements

- Node.js 18 or later.
- npm.

### Local Development

```bash
cd Nabd26
npm install
npm run dev
```

Open `http://localhost:5173` in a browser.

### Mock Login

| Role | Identifier | Password |
| --- | --- | --- |
| Employee | `emp1` | `1234` |
| Admin | `admin` | `1234` |

### Optional Supabase Configuration

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then run the application with `npm run dev`.

### Production Build

```bash
npm run build
npm run preview
```

The build command runs TypeScript validation and the Vite production build.

## Current Implementation Notes

- The project currently builds successfully with `npm run build`.
- Mock data is the default demonstration path, so the interface works without Supabase configuration.
- When Supabase is configured, supported workflows use live authentication, database queries, realtime notifications, and storage operations.
- The current primary UI copy is English on the recently standardized pages, including Employee Dashboard, Mood Questions, Points & Rewards, Sessions Calendar, Analytics, Notifications, Leaves, and Upload Files.
- Arabic translations remain in the language dictionary and can be extended or enabled as a separate localization layer.
- The application uses a dark Lavender Pulse visual identity with responsive layouts and shared design tokens.

## Future Work

- Complete English consistency across every remaining visible state and mock-data label.
- Expand Arabic RTL coverage and translation quality where needed.
- Add automated tests with Vitest and React Testing Library.
- Connect HR, leave, challenge, and Kaizen workflows to production Supabase tables.
- Add role-aware audit logs and stronger administrative safeguards.
- Add Slack, Microsoft Teams, or Telegram notification integrations.
- Add advanced trend detection and burnout-risk forecasting with appropriate privacy controls.
- Improve PDF and CSV reporting exports.
- Add employee profile management and a mobile application.

## Team

| Member | Responsibility |
| --- | --- |
| Student | Systems Development and Administration |
| Student | Requirements analysis, database design, frontend development, project management, and documentation |

**Supervisor:** To be added.

## Project Structure

```text
Nabd26/
├── package.json
├── vite.config.ts
├── vite.config.mjs
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── README.md
├── README-railway.md
├── TODO.md
├── screenshots/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── auth/
│   │   ├── BootContext.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── components/
│   │       ├── AdminUI.tsx
│   │       ├── AppShell.tsx
│   │       ├── DataState.tsx
│   │       ├── HeartLoader.tsx
│   │       ├── LangToggle.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── ui/
│   ├── i18n/
│   │   ├── i18n.ts
│   │   └── LangContext.tsx
│   ├── lib/
│   │   ├── dashboardData.ts
│   │   └── supabaseClient.ts
│   ├── mock-data/
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── EmployeeDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── HRDashboard.tsx
│   │   ├── Employees.tsx
│   │   ├── Leaves.tsx
│   │   ├── MoodQuestions.tsx
│   │   ├── PointsRewards.tsx
│   │   ├── SessionsCalendar.tsx
│   │   ├── Reports.tsx
│   │   ├── AnalyticsMonitoring.tsx
│   │   ├── AnalyticsMonitoring2.tsx
│   │   ├── NotificationSystem.tsx
│   │   ├── UploadFiles.tsx
│   │   ├── KaizenBox.tsx
│   │   ├── WellnessChallenges.tsx
│   │   └── HeartLoaderPage.tsx
│   ├── styles/
│   │   └── fonts.css
│   └── theme/
│       ├── ThemeContext.tsx
│       └── tokens.ts
└── supabase/
    └── migrations/
        └── 001_init_hr_schema.sql
```

## Project Summary

Nabd Space is a wellbeing-focused HR platform prototype with a clear separation between presentation, business logic, and data access. It is ready for demonstration with mock data, supports optional Supabase integration, uses protected role-based routes, and provides a consistent English-first Lavender Pulse interface across the latest updated workflows.

**Submission date:** To be added.

**Contact email:** To be added.

**Supervisor:** To be added.
