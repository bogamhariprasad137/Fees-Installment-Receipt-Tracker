# UI/UX Design Brief (Stitch Ready)
## Fees Installment & Receipt Tracker

---

## 1. Design Philosophy
The UI/UX design is built on the principles of **clarity, visual hierarchy, and structural security**. Because this is a financial tracking system, it must look professional and trustworthy. The layout is clean and spacious, featuring consistent visual states, helpful micro-interactions (like hover effects and transition states), and clear status badges. Color is used functionally to guide the user's attention: Emerald Green indicates successful payments, Amber signifies pending statuses, and Rose highlights overdue balances.

---

### 2. Design System Tokens
 
 ### 2.1 Color Palette
 ```text
 Sidebar Background: #4B2E21 (Darkest premium institutional brown)
 Sidebar Hover / Active: #331F16 (Deeper brown depth)
 Main Content Background: #F2E6B3 (Warm parchment cream)
 Surface (White Cards): #FFFFFF (White with rounded corners, soft shadows)
 Primary Accent: #4B2E21 (Dark brown for primary highlights)
 Success (Emerald) : HSL(142, 72%, 29%)  --> #059669 (Paid badges, success messages)
 Warning (Amber)   : HSL(38, 92%, 50%)   --> #D97706 (Pending status, warning banners)
 Danger (Rose)     : HSL(350, 89%, 48%)  --> #E11D48 (Overdue badges, error highlights)
 Neutral Dark      : HSL(220, 15%, 16%)  --> #1F2937 (Body text, title headers)
 Border            : HSL(210, 16%, 93%)  --> #E5E7EB (Dividers, borders, inputs)
 ```
 
 ### 2.2 Typography
 *   **Font Family**:
     *   **Headings**: `Manrope` (weight 700) imported from Google Fonts.
     *   **Body**: `Inter` (weights 400, 500, 600) imported from Google Fonts.
 *   **Sizing Hierarchy**:
     *   `Display Title`: 32px (Bold, Manrope 700) - Dashboard main headers.
     *   `Section Title`: 24px (Bold, Manrope 700) - Card titles, tables.
     *   `Body Text`: 16px (Regular, Inter 400 / Medium, Inter 500) - Roster table, details, form fields.
     *   `Caption`: 12px (Medium, Inter 500) - Badges, subtexts, table headers.
 
 ### 2.3 Layout & Grid System
 *   **Max Width**: 1440px (Centered container layout).
 *   **Grid System**: CSS Grid
     *   *Dashboard*: 4 columns on desktop, 2 columns on tablet, 1 column on mobile.
     *   *Forms*: 2 columns on desktop, 1 column on mobile.
 *   **Paddings & Shadows**:
     *   Desktop: `padding: 2rem` (32px)
     *   Mobile: `padding: 1rem` (16px)
     *   **Shadow System**: Consistently apply a soft, elegant elevation shadow (`box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)`) to cards, tables, modals, dropdowns, and widgets. Avoid excessive shadows.
     *   **Hover Effects**: Consistent hover transitions (`transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`) with subtle elevation and shadow changes applied on sidebar items, navigation links, dashboard cards, buttons, table rows, action menus, filters, and search controls.

---

## 3. Global Component Specifications

### 3.1 Buttons
*   **Primary Button**: Indigo background, white text, 6px border radius. Transition: `all 0.2s ease-in-out`. Hover state: Indigo Light background, shadow outline.
*   **Secondary Button**: Transparent background, Neutral Dark border, dark text. Hover state: Light grey background.
*   **Danger Button**: Rose background, white text. Hover state: Light rose background.

### 3.2 Form Inputs
*   Label positioned above input. Input fields feature a light grey border (`Border` token) and a 6px border radius.
*   *Focus State*: Border color changes to Indigo, with a subtle blue shadow glow.
*   *Error State*: Border color changes to Rose, with the validation error message displayed in small red text below the input field.

### 3.3 Tables
*   Header row background color is Indigo, with bold white text.
*   Alternate rows have a light grey zebra striping background (using `Neutral Light` token).
*   Minimum tap target size for all row buttons is 44px x 44px for accessibility.
*   **Inactive Student Styling**: Rows representing students with `Inactive` status are styled with 50% text opacity, italicized font, and display a dark grey "Inactive" badge. Action buttons in these rows remain functional but are visually desaturated.

### 3.4 Status Badges
*   `Paid`: Emerald Green background (15% opacity), bold Emerald Green text.
*   `Pending`: Amber background (15% opacity), bold Amber text.
*   `Overdue`: Rose background (15% opacity), bold Rose text.
*   `Inactive`: Neutral Dark background (15% opacity), bold Neutral Dark text.

### 3.5 Modals & Dialogs
*   **Deactivate/Soft-Delete Confirmation Modal**: Triggered when an Admin attempts to delete a student with existing transactions. Displays a prominent warning icon, explains that deletion is blocked due to accounting records, and provides primary action button: "Deactivate Student Profile" (which updates student status to `Inactive`) and secondary: "Close".
*   **Forgot Password Dialog**: Triggers from the Login screen. Contains an email input, "Send Reset Link" button, and confirmation state showing: "Reset instructions have been dispatched. Check your inbox."
*   **Payment Logging Modal**: Includes fields for Payment Date (datepicker defaulting to today), Payment Method dropdown (Cash, Bank Transfer, Cheque, Card), and a summary display of the installment being paid.

---

## 4. Screen Specifications

### 4.1 Login Page
*   **Purpose**: Authentication portal for Admins and Parents (with integrated parent registration panel).
*   **Components**: Welcome banner, email input field, password input field, "Forgot Password" link, "Forgot Password" modal, "Sign In" button, "Sign Up" toggle link, Parent Signup panel (Email input, Password input, Confirm Password input, Register button, and "Back to Login" toggle link).
*   **Layout**: Centered card layout on a light grey background (`Neutral Light` token). The card displays the Login panel by default, but clicking the "Sign Up" toggle link replaces the fields with the Parent Signup panel using a smooth cross-fade animation.
*   **User Actions**: Input email, input password, click "Sign In", click "Forgot Password" (launches dialog), toggle between Login and Signup panels.

*   **Validation Rules**: Email must be in a valid email format; password must be at least 6 characters.
*   **Empty State**: Not applicable.
*   **Loading State**: Disable button, show loading spinner inside button.
*   **Error State**: Red banner showing: "Invalid credentials. Please verify your email and password."


### 4.2 Admin Dashboard
*   **Purpose**: Central hub displaying financial summaries and outstanding balances for Administrators.
*   **Components**: Side navigation bar (Primary color: `#4B2E21`), top header, 4 metric cards (Total Students, Total Fees Collected, Pending Fees, Overdue Fees), and the **Overdue Accounts Table** (columns: Student Name, Parent Name, Outstanding Amount, Due Date, Days Overdue, Status).
*   **Layout**: 4-column metric grid at the top, followed by a full-width container for the interactive Overdue Accounts Table (which is sorted by most overdue, highlights overdue rows, and uses a responsive layout). The "Fees Allocated" metric, "Monthly Fee Collections" chart, and all widgets (Recent Payments, Upcoming Due Dates, Overdue Accounts list widget, Recent Registrations list) are completely removed.
*   **User Actions**: Click metrics, hover over table rows, search/filter table records, click navigation items.
*   **Validation Rules**: None.
*   **Empty State**: Metric cards show `₹0.00` and the table displays "No overdue accounts found."
*   **Loading State**: Shimmer loading effects on metric cards and table rows.
*   **Error State**: "Failed to load dashboard metrics. Tap to refresh."

### 4.3 Parent Dashboard
*   **Purpose**: Landing screen for logged-in parents.
*   **Components**: Dynamic profile cards for their children containing: Student Information, Admission Fee, Term Fee, Daycare Fee, Total Fee, Paid Amount, Pending Amount, Overall Due Date, Installment Progress, and Recent Receipts.
*   **Layout**: Column-oriented list of profile cards with a warm background (`#F2E6B3`) and white cards.
*   **User Actions**: View child summary, download recent receipts directly, click on a child's card to view their complete billing timeline.
*   **Validation Rules**: None.
*   **Empty State**: "No student profiles are registered under this email address. Please contact school administration."
*   **Loading State**: Skeleton cards representing student profiles.
*   **Error State**: Red banner showing: "Failed to retrieve student data. Please try again later."

### 4.4 Student List Page
*   **Purpose**: Roster interface for managing student accounts.
*   **Components**: Roster table (columns: Student Name, Admission Number, Class, Parent Email, Fee Status, Actions: Edit/Billing), search field, filter dropdowns (Class, Status), "Register New Student" button.
*   **Layout**: Top search toolbar, followed by the roster table.
*   **User Actions**: Search by name or admission number, filter by class, click "Edit" or "Billing".
*   **Validation Rules**: None.
*   **Empty State**: "No students found matching your search query."
*   **Loading State**: Spinner overlay.
*   **Error State**: "Failed to fetch student roster."

### 4.5 Add Student Page / Registration Flow
*   **Purpose**: Registration form to create new student profiles and allocate fees.
*   **Components**: Form inputs split into:
    *   **Student Information**: Student Name, Parent Name, Parent Email, Parent Phone, Class, Admission Number, Admission Date.
    *   **Fee Information**: Admission Fee, Term Fee, Daycare Fee, Total Fee (auto-calculated), Initial Payment, Remaining Balance (auto-calculated).
    *   **Deadline Information**: Fee Due Date, Installment Due Dates, Payment Schedule.
    *   **Additional Notes**.
    *   Action buttons: "Save", "Cancel".
*   **Layout**: Two-column responsive form layout.
*   **User Actions**: Input form data, watch Total Fee and Remaining Balance calculate in real-time, click "Save" or "Cancel".
*   **Validation Rules**: Mandatory inputs for Student Name, Class, Admission Number, and Parent Email (must be in valid email format). Total Fee must equal the sum of Admission, Term, and Daycare fees.
*   **Empty State**: Not applicable.
*   **Loading State**: Disable form controls and show a spinner.
*   **Error State**: Field-level validation warnings.

### 4.6 Edit Student Page
*   **Purpose**: Update details of an existing student.
*   **Components**: Same form fields as Add Student page, pre-populated with student details. Action buttons: "Update", "Cancel".
*   **Layout**: Two-column responsive form layout.
*   **User Actions**: Edit form fields, click "Update".
*   **Validation Rules**: Same validation rules as Add Student page.
*   **Empty State**: Not applicable.
*   **Loading State**: Shimmer loader on form fields.
*   **Error State**: Banner warning showing: "Failed to update profile. Please verify your connection."

### 4.7 Fee Management Page
*   **Purpose**: Manage billing records for students.
*   **Components**: Search bar, student fee table (columns: Student Name, Admission Number, Admission Fee, Term Fee, Daycare Fee, Total Fee, Paid Amount, Pending Amount, Status, Actions: Configure Fees).
*   **Layout**: Top search bar, followed by the student fee table.
*   **User Actions**: Search by name or class, click "Configure Fees".
*   **Validation Rules**: None.
*   **Empty State**: "No fee structures configured."
*   **Loading State**: Table loading overlays.
*   **Error State**: Standard error banner.

### 4.8 Installment Management Page
*   **Purpose**: Split fees into installment plans and log payments.
*   **Components**: Header (Student Name, Total Fee), installment list configuration (columns: Installment Number, Amount, Due Date, Payment Date, Status, Actions: Log Payment), "Add Installment Row" button, "Save Configuration" button.
*   **Layout**: Two-column layout: Student summary card on the left, installment config table on the right.
*   **User Actions**: Add installment row, enter amounts/due dates, click "Save Configuration", click "Log Payment" on individual installments.
*   **Validation Rules**: Sum of installment amounts must exactly equal the student's computed total fee (Admission + Term + Daycare). Paid installments are locked.
*   **Empty State**: "No installments configured."
*   **Loading State**: Full-screen loader overlay.
*   **Error State**: Red banner showing: "The sum of installments (₹12,000.00) does not match the student's total fee (₹15,000.00)."


### 4.9 Receipt Management Page / Receipt Ledger
*   **Purpose**: Log of transaction PDFs for auditing.
*   **Components**: Filter dashboard (Date range selector, payment method dropdown), receipt table (columns: Receipt Number, Student Name, Class, Amount Paid, Payment Date, Method, Action: Download PDF).
*   **Layout**: Top filters toolbar, followed by the receipt table.
*   **User Actions**: Filter receipt entries, click "Download PDF".
*   **Validation Rules**: Start Date must be prior to End Date.
*   **Empty State**: "No receipts found matching the selected filters."
*   **Loading State**: Skeleton loader for table rows.
*   **Error State**: Red banner showing: "Failed to load receipt audit records."

### 4.10 Reports Page
*   **Purpose**: Export data and view financial health metrics.
*   **Components**: Date selectors, Class filter dropdown, Status filter dropdown, "Generate Report" button, "Download PDF" button, collection breakdown charts.
*   **Layout**: Horizontal filter bar, followed by collection statistics charts and data table.
*   **User Actions**: Select filters, click "Generate Report", click "Download PDF" (CSV is deprecated).
*   **Validation Rules**: Start Date must be prior to End Date.
*   **Empty State**: "No transactions found within the selected date range."
*   **Loading State**: Spinner loader on the charts.
*   **Error State**: Red banner showing: "Failed to compile report. Please try again."

### 4.11 Student Detail Page
*   **Purpose**: Single page overview of a student's profile and finances.
*   **Components**: Personal details card, parent contact card, billing summary card (Total, Paid, Pending), installment timeline view.
*   **Layout**: Profile sidebar on the left, billing details and installment timeline on the right.
*   **User Actions**: Toggle status between Active and Inactive, edit details, download PDF receipts for paid installments.
*   **Validation Rules**: None.
*   **Empty State**: Not applicable.
*   **Loading State**: Skeleton layout.
*   **Error State**: Redirect to a 404 page if Student ID is invalid.

### 4.12 Parent Fee Detail Page
*   **Purpose**: Detailed view of billing timeline for parent portal.
*   **Components**: Profile card of the student, summary cards (Total Fee, Paid, Pending), vertical installment timeline (displaying status badges: Paid, Pending, Overdue), "Download Receipt" buttons for paid installments.
*   **Layout**: Vertical timeline with status colors.
*   **User Actions**: Click "Download Receipt" on paid installments.
*   **Validation Rules**: None.
*   **Empty State**: "No fee details configured for this student. Please contact administration."
*   **Loading State**: Skeleton timeline.
*   **Error State**: Red banner showing: "Failed to load fee details."
