# Design System: Fees Installment & Receipt Tracker

## 1. Visual Theme & Atmosphere
The design system is engineered for **Institutional Warmth and Financial Trust**. It bridges the prestige of traditional educational governance with the clean layout of a modern SaaS ERP. The interface utilizes a structured grid, clear visual hierarchy, and a warm, inviting canvas background,Receding elements allow essential statistics and billing timelines to capture the user's primary focus. The atmosphere is reliable, structured, and institutional—avoiding playful consumer-facing designs in favor of an elegant, premium academic portal.

---

## 2. Color Palette & Roles
- **Canvas Cream** (`#F2E6B3`) — Primary background surface. Warm, calming, and easy on the eyes.
- **Pure Surface** (`#FFFFFF`) — Cards, table lists, details panels, and input fields.
- **Sidebar Brown** (`#4B2E21`) — Primary left sidebar fill, primary action button fill, and brand accents.
- **Sidebar Hover** (`#5E3D2F`) — Lighter brown for hover states and active indicators.
- **Academic Charcoal** (`#2A1B14`) — Primary typography, headers, and neutral-dark elements.
- **Warm Muted** (`#6B5B52`) — Secondary typography, helper texts, table headers, and metadata.
- **Structure Border** (`#E1D4A3`) — Subtle borders, dividers, input outlines, and card containers.
- **Status Green** (`#0D9488` / `#10B981`) — Functional paid state chips.
- **Status Amber** (`#D97706` / `#F59E0B`) — Functional pending state chips.
- **Status Red** (`#E11D48` / `#EF4444`) — Functional overdue state chips.
- **Status Blue** (`#2563EB` / `#3B82F6`) — Functional info state chips.

---

## 3. Typography Rules
- **Display Sizing**: `Manrope` (weight 700) — Bold displays, establishing weight-driven hierarchy rather than oversized letters.
- **Body Sizing**: `Inter` (weights 400, 500, 600) — Neutral-dark charcoal color, generous leading (`line-height: 1.5`), and maximum line widths of 65 characters for readable tables and forms.
- **Numeric Mono**: `JetBrains Mono` or system mono — Used exclusively for invoice amounts, receipt numbers, dates, and student admission numbers to ensure vertical tabular alignment in columns.
- **Banned**: Generic system serifs are banned.

---

## 4. Component Stylings
- **Sidebar**:
  - Background: `#4B2E21`.
  - Active Link: Lighter background highlight (`#5E3D2F`), cream icon, white text.
  - Category Headings: Small CAPS, `#E1D4A3` with 60% opacity.
- **Buttons**:
  - **Primary**: Solid `#4B2E21` background, white text, 6px border radius. Transition: `-1px translateY` hover state.
  - **Secondary**: Pure white background, solid 1.5px `#4B2E21` border outline, `#4B2E21` text.
- **Cards**:
  - Pure white background (`#FFFFFF`), rounded corners (8px), and a subtle outline border using `#E1D4A3` or a soft diffused cream shadow (`#D4C796`).
- **Inputs**:
  - Top-aligned labels. White fill background, solid `#E1D4A3` outline. Active focus: outline border turns to `#4B2E21` with a soft cream glow.
- **Status Badges**:
  - Semi-rounded pill shapes. Paid = light green tint with dark green text; Pending = light amber tint with dark amber text; Overdue = light red tint with dark red text.

---

## 5. Layout & Spacing
- **Responsive Width**: 1440px max-width container, centered on viewports.
- **Sidebar Navigation**: Fixed left-rail column of 260px width. Collapses to icon rail on tablets and hides into a burger-drawer on mobile.
- **Grid Layout**: 12-column grid system for dashboard layouts. Cells transition to single-column stacking on viewports below 768px.
- **V Rhythm**: 8px baseline grid logic for card margins, element line gaps, and container paddings.

---

## 6. Motion & Interaction
- **Triggers**: Smooth transitions on hover states (`all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`).
- **Tactile feedback**: Subtle click animation (active state translates `-0.5px translateY` and scales `0.99`).
- **Cascade Loading**: Staggered waterfall mounting for dashboard cards and table lists.

---

## 7. Design Anti-Patterns (Banned)
- No emojis inside financial ledgers.
- No neon glowing shadows or vibrant gradients on cards/buttons.
- No pure black (`#000000`) for text or borders.
- No generic serif fonts inside software dashboards.
- No centered hero structures for dashboards.
- No fake numbers or simulated SLA statistics.
