# Structiva — Website Architecture & UX Strategy

## 1. Website Strategic Purpose & Sitemap

The Structiva website is not a passive brochure; it is an active conversion engine designed to educate business owners on the cost of disconnected marketing, demonstrate technical authority across the 10 infrastructure pillars, and drive qualified inquiries.

### Complete Sitemap & URL Hierarchy
```
Structiva Website (Domain: structiva.io or equivalent)
├── / (Home)
├── /about (About Us & Philosophy)
├── /services (The 10 Infrastructure Pillars)
├── /how-we-work (Delivery Methodology & Engagement Stages)
├── /who-we-serve (Tailored Solutions: Startups, Small Businesses, SMEs)
├── /insights (Strategic Guides, Frameworks & Case Studies)
└── /contact (Discovery Audit & Consultation Booking)
```

---

## 2. Navigation Architecture & Header/Footer Specifications

### Global Header (Desktop & Mobile)
- **Brand Logo:** Structiva mark (Clean geometric architecture mark + wordmark).
- **Primary Desktop Navigation Links:**
  1. `Services` (with dropdown overview of the 10 pillars)
  2. `How We Work`
  3. `Who We Serve`
  4. `About`
  5. `Insights`
- **Header Action Button (CTA):** `Book a Consultation` (High-contrast pill button linking to `/contact`).
- **Mobile Navigation:** Minimalist drawer menu with persistent sticky header and full-width bottom CTA button.

### Global Footer Structure
- **Column 1 (Brand):** Structiva logo, tagline (*Building the systems behind business growth*), copyright, and privacy/terms links.
- **Column 2 (Infrastructure Pillars):** Quick links to core service areas (Intelligence, Conversion, Tracking, Automation).
- **Column 3 (Company & Process):** Links to `How We Work`, `Who We Serve`, `About Us`, and `Insights`.
- **Column 4 (Direct Action):** Office/Virtual contact details, business email, and direct link to schedule an infrastructure audit.

---

## 3. User Conversion Funnels & User Journeys

The site accommodates three primary visitor mindsets:

```
[Problem-Aware Visitor: "Why aren't my ads working?"]
       │
       ▼
[Home: Business Challenges Section] ──► [Services / Pillars] ──► [/contact: Free System Audit]

[Solution-Aware Visitor: "I need GA4/CRM setup."]
       │
       ▼
[Services: Specific Pillar Module] ────► [How We Work Process] ─► [/contact: Book Consultation]

[Executive / Scrutiny Visitor: "Who is Structiva and can I trust them?"]
       │
       ▼
[About: Philosophy & Engineering View] ─► [Insights / Proof] ──► [/contact: Request Proposal]
```

---

## 4. Primary & Secondary CTA Governance

1. **Primary Call to Action:**  
   - **Label:** `Book a Consultation` or `Request an Infrastructure Audit`
   - **Destination:** `/contact` (Interactive calendar / qualification form)
   - **Placement:** Header (always visible), Hero section, and bottom closing banner of every page.
2. **Secondary Call to Action:**  
   - **Label:** `Explore Our Services` or `See How We Work`
   - **Destination:** `/services` or `/how-we-work`
   - **Placement:** Hero sub-buttons and mid-page contextual links.

---

## 5. Technical UX & Conversion Best Practices

- **Zero Clutter:** No intrusive popups, countdown timers, or irrelevant chatbot widgets.
- **Sub-2-Second Load Times:** Clean code, minimal JavaScript overhead, next-gen WebP/SVG images.
- **Sticky Mobile Action:** On mobile devices, a persistent floating footer bar ensures the contact CTA is accessible at all times without scrolling.
- **Contextual Form Validation:** Clear inline error messages and auto-formatting for phone numbers and email fields.
