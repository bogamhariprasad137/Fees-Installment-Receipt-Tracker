# Fees Installment & Receipt Tracker

A production-ready full-stack fee management portal built for educational institutions to streamline student registration, customize fee installment schedules, log transactions, and auto-generate PDF receipts.

## Project Structure
```text
/fees-installment-receipt-tracker
├── docs/                           # Planning & Architecture Documents
│   ├── PRD.md                      # Product Requirements Document
│   ├── TRD.md                      # Technical Requirements Document
│   ├── App-Flow.md                 # Complete User Navigation & Journeys
│   ├── UI-UX-Design-Brief.md       # Screen Layouts & Style System tokens
│   ├── Backend-Schema.md           # API specifications and database logic
│   └── Implementation-Plan.md      # Sprint timelines and testing QA checklist
├── frontend/                       # React client application (Vite template)
├── backend/                        # Python Flask REST API server code
├── database/                       # Database configurations and migration schema script
│   └── schema.sql                  # Main MySQL relational DDL structure script
└── README.md                       # This documentation entry point
```

## Technology Stack Summary
*   **Frontend**: React, Vite, HTML, CSS, JavaScript (React Router DOM, Axios).
*   **Backend**: Python Flask REST API (ReportLab PDF compilation, Firebase Admin SDK).
*   **Database**: MySQL (InnoDB engine, foreign key checks, ACID compliant).
*   **Authentication**: Firebase Authentication.
*   **Deployment**: Vercel (Frontend) and Render (Backend).

## Quick Access to Architecture Documents
*   View the [Product Requirements (PRD)](file:///c:/Users/bogam/OneDrive/Apps/Fees-Installment-Receipt-Tracker/docs/PRD.md) to understand business rules, user stories, and Gherkin scenarios.
*   View the [Technical Requirements (TRD)](file:///c:/Users/bogam/OneDrive/Apps/Fees-Installment-Receipt-Tracker/docs/TRD.md) to examine the architectural charts, token verifications, and route-protection guard logic.
*   View the [App Flow Document](file:///c:/Users/bogam/OneDrive/Apps/Fees-Installment-Receipt-Tracker/docs/App-Flow.md) to walk through parent activation paths, payment transactions, and state transition diagrams.
*   View the [UI/UX Design Brief](file:///c:/Users/bogam/OneDrive/Apps/Fees-Installment-Receipt-Tracker/docs/UI-UX-Design-Brief.md) to inspect global styling values and detailed layouts for all 12 portal screens.
*   View the [Backend Database Schema](file:///c:/Users/bogam/OneDrive/Apps/Fees-Installment-Receipt-Tracker/docs/Backend-Schema.md) to reference request/response JSON schemas.
*   View the [Implementation Sprints](file:///c:/Users/bogam/OneDrive/Apps/Fees-Installment-Receipt-Tracker/docs/Implementation-Plan.md) for folder maps, Gantt timelines, and QA validation checkpoints.
