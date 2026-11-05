# Structiva — Visual Design & Style Guide
### Design System: Synthesizing Leroux (Qode Interactive) & Optivo Corporate Consulting (Bracketweb)

## 1. Design Philosophy & Aesthetic Blueprint

The Structiva visual identity fuses the **editorial prestige, refined typography, and generous negative space of *Leroux*** with the **high-clarity corporate structure, numbered process grids, and conversion rigor of *Optivo Corporate Consulting***.

The result is an **Elite Systems Architecture** aesthetic—positioning Structiva as an authoritative business infrastructure consultancy rather than a low-tier marketing agency.

---

## 2. Color Palette & Token Architecture

```
┌─────────────────────────────────┐   ┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│       PRIMARY BRAND NAVY        │   │        ACCENT TECH TEAL         │   │         LIGHT BACKGROUND        │
│             #101D35             │   │             #16B8A6             │   │             #F4F6F8             │
└─────────────────────────────────┘   └─────────────────────────────────┘   └─────────────────────────────────┘
```

| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| **Primary Navy** | `#101D35` | Dominant corporate base; dark hero blocks, top bars, footer, high-contrast dark sections. |
| **Accent Tech Teal** | `#16B8A6` | Primary action buttons, interactive highlights, live data pulses, metric highlights. |
| **Main Light Background**| `#F4F6F8` | Warm, clean canvas for alternating content sections; prevents eye strain and adds air. |
| **Pure White** | `#FFFFFF` | Card surfaces, container backgrounds, elevated modal boxes, and crisp contrast blocks. |
| **Dark Charcoal** | `#263449` | Primary body typography, section sub-headers, and corporate icons. |
| **Muted Slate** | `#64748B` | Secondary metadata, reading time, breadcrumbs, and inactive tab states. |
| **Hairline Border Dark** | `#1E293B` | 1px subtle architectural dividers on navy surfaces. |
| **Hairline Border Light**| `#E2E8F0` | 1px clean boundaries on white cards and light tables. |

---

## 3. Typography & Font Styles

### Font Family Pairings (Leroux + Optivo DNA)
- **Primary Display Headings:** `Plus Jakarta Sans` or `Syne` (Weights: 600 Semi-Bold, 700 Bold, 800 Extra-Bold).  
  *Characteristics:* Architectural, confident, high-contrast, razor-sharp geometric precision.
- **Body & Editorial Copy:** `Inter` (Weights: 400 Regular, 500 Medium).  
  *Characteristics:* Clean, neutral, exceptional legibility at all screen sizes.
- **Data, Numbers & Process Badges:** `JetBrains Mono` or `Plus Jakarta Sans` with tabular figures.  
  *Characteristics:* Used for KPI stats (`98%`, `<3min`), process step numerals (`01`, `02`, `03`), and technical tags.

### Detailed Type Scale & Specs
| Element | Font | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero H1** | Display Sans | 52px – 64px | 700 / 800 | 1.15 | -0.025em |
| **Section H2** | Display Sans | 36px – 42px | 700 | 1.25 | -0.015em |
| **Subheading H3** | Display Sans | 24px – 28px | 600 | 1.35 | -0.01em |
| **Card Header H4** | Display Sans | 18px – 22px | 600 | 1.40 | 0.00em |
| **Metric Stat** | Mono / Bold | 44px – 56px | 800 | 1.00 | -0.02em |
| **Body Large** | Body Sans | 18px – 20px | 400 / 500 | 1.60 | 0.00em |
| **Body Regular** | Body Sans | 16px | 400 | 1.65 | 0.00em |
| **Small / Badges** | Display / Mono | 12px – 13px | 600 | 1.50 | +0.05em (Caps) |

---

## 4. Layout Architecture & Component Library

### A. Top Utility Bar (Optivo Pattern)
- Height: 40px | Background: `#0B1324` (Deepest Navy) | Border-bottom: `1px solid #1E293B`.
- Left: Direct contact indicator (`Inquiries: hello@structiva.io` | `Response SLA: Under 4 Hours`).
- Right: Office operating hours (`Mon – Fri: 9am – 6pm`) + Client portal / direct WhatsApp quick-link.

### B. Sticky Corporate Header
- Height: 80px | Background: `#101D35` (90% blur backdrop filter) | Border-bottom: `1px solid rgba(255,255,255,0.08)`.
- Left: Structiva wordmark with architectural geometric logo icon.
- Center: Horizontal navigation links with subtle teal underline hover transitions.
- Right: High-contrast consultation button: Solid Teal (`#16B8A6`), white bold text, 6px border radius.

### C. Hero Section (Leroux Split-Composition Pattern)
- Left Column (60%): Eyebrow pill tag (`[BUSINESS & MARKETING SYSTEMS]`) → Commanding Display H1 → Concise 3-sentence narrative → Dual action buttons (`[Book a Consultation]` + `[Explore the 10 Pillars]`).
- Right Column (40%): Abstract connected-network interactive graphic—dynamic nodes pulsing with data streams and soft teal radial glows against deep navy.

### D. Metric Counter Strip (Optivo Pattern)
- Full-width container bridging the hero and challenges sections.
- 4-column metric grid:
  - `10` *Connected Infrastructure Systems*
  - `100%` *Verified Server-Side Attribution*
  - `<3min` *Average Lead Response SLA*
  - `0` *Disconnected Manual Spreadsheets*

### E. The 10 Pillar Cards (Leroux Interactive Grid)
- Cards set on `#FFFFFF` with `1px solid #E2E8F0` on light background, or `#161F30` with `1px solid #1E293B` on dark sections.
- Padding: 32px | Border Radius: 12px.
- Top: Numeric badge (`PILLAR 01`) in Teal accent + Monospace tag.
- Center: Title (H4) + 2-sentence commercial outcome summary.
- Bottom: Micro-list of key deliverables + arrow link (`Learn more →`).
- Hover: 4px vertical lift + subtle box shadow (`0 20px 25px -5px rgba(16, 29, 53, 0.08)`) + border color transitions to Teal `#16B8A6`.

### F. Numbered Process Roadmap (Optivo Pattern: 01 to 05)
- Horizontal 5-stage sequential workflow cards:
  - `01 ASSESS` → `02 STRATEGISE` → `03 BUILD` → `04 INTEGRATE` → `05 OPTIMISE`
- Large watermark numerals (`01`, `02`) in muted slate background with bold step titles and deliverables.

### G. Executive Consultation Banner (Closing Block)
- Deep Navy (`#101D35`) background with subtle radial teal ambient gradient.
- High-contrast centered headline + direct qualification input or one-click booking trigger.

---

## 5. Motion Graphics & Interaction Specifications

To replicate the fluid, premium feel of *Leroux* and *Optivo*:

1. **Scroll-Triggered Reveals:**
   - Section headers and cards fade in with a 20px upward translate (duration: 0.6s, ease: `cubic-bezier(0.16, 1, 0.3, 1)`).
2. **Animated Metric Counters:**
   - Numbers count up smoothly from 0 to target value as they enter the viewport.
3. **Interactive Abstract Network Visual:**
   - Subtle Canvas/SVG node animation: floating connected nodes with gentle lines pulsing at 0.5Hz, representing live data flow between website, CRM, ads, and analytics.
4. **Button & Card Micro-Interactions:**
   - Buttons: Subtle glow shadow expansion on hover (`box-shadow: 0 0 20px rgba(22, 184, 166, 0.4)`).
   - Links: Animated underline expanding from left to right.
5. **Accordion & Tab Transitions:**
   - Smooth height expansions (`max-height` transition 0.35s ease-in-out) for FAQ accordions and service category switchers.
