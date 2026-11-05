# Structiva — Client Engagement & Delivery Process
### Operational Framework & Client Collateral Architecture

## 1. The Two Halves of the Service System

A central principle of Structiva's operations is the strict separation between what you build internally and how you communicate commercially to clients:

```
┌───────────────────────────────────────────────┐     ┌───────────────────────────────────────────────┐
│       1. INTERNAL DELIVERY FRAMEWORK          │     │        2. CLIENT-FACING SERVICE SUITE         │
│               (For Your Use)                  │     │           (For the Client to Read)            │
│  • Comprehensive 10-pillar blueprints         │     │  • Website Services Page                      │
│  • Granular implementation tasks & checklists │     │  • Service Brochure (PDF for WhatsApp/Email)  │
│  • Technical procedures & schema configs      │     │  • Service Presentation (Consultation Deck)   │
│  • Quality assurance & completion criteria    │     │  • Tailored Client Proposal                   │
└───────────────────────────────────────────────┘     └───────────────────────────────────────────────┘
```

### How the Two Frameworks Relate

| Internal Delivery Framework | Client-Facing Service Materials |
| :--- | :--- |
| **Explains exactly what you do** internally to construct the system. | **Explains what you offer** and the business value delivered. |
| Lists detailed implementation tasks, checklists, and technical checks. | Highlights business services, practical benefits, and outcomes. |
| Contains technical configurations (DNS, GTM, CAPI, SQL/API logic). | Uses accessible, persuasive commercial business language. |
| Guides daily project execution and team delivery. | Helps business owners understand, evaluate, and purchase. |
| Kept internal in Notion, project management, or operations repos. | Shared with prospective clients across the sales cycle. |

---

## 2. Where the Client Encounters Your Service (The Collateral Suite)

A prospective client encounters Structiva across four distinct touchpoints, each supported by a dedicated commercial asset:

1. **On Your Website (Discovery):**  
   They visit your `/services` page and read about your offering and the ten areas of marketing infrastructure you build.
2. **Through WhatsApp or Email (First Contact):**  
   You send them your **Service Brochure (PDF)** when they enquire about what you do.  
   *Role:* Sells the overall service and establishes credibility.
3. **During a Consultation (Evaluation):**  
   You walk through a **Service Presentation (Slide Deck)** to explain your approach, understand their business, and identify where they need help.  
   *Role:* Explains the methodology and diagnoses their specific challenges.
4. **After the Consultation (Closing):**  
   You send a tailored **Client Proposal** specifying the exact recommended work, deliverables, timeline, and investment.  
   *Role:* Sells the specific implementation plan.

> **Key Rule:** Never send a prospective client your 200-item internal technical checklist. They need to understand what you will build for their business, why it matters, and what commercial outcomes they will receive.

---

## 3. The 5-Stage Client Engagement Methodology

Every client engagement moves through five structured operational stages:

```
[Phase 1: Assess] ──► [Phase 2: Strategise] ──► [Phase 3: Build] ──► [Phase 4: Integrate] ──► [Phase 5: Optimise]
  Diagnostic Audit      Systems Blueprint       Infrastructure         Automations & APIs      Continuous Tuning
```

### Stage 1: Assess (Diagnostic Audit & Discovery)
- **Objective:** Establish an empirical baseline of what exists, analyze historical data, and identify operational leaks.
- **Key Activities:**
  - Audit historical ad spend, traffic channels, and attribution fidelity.
  - Review technical website health, page load speeds, and mobile conversion friction.
  - Inspect lead capture endpoints (forms, chat widgets, social DMs, phone calls).
  - Assess CRM hygiene, pipeline stages, and follow-up latency.
  - Map active software subscriptions and identify redundant tools.
- **Milestone Output:** *Comprehensive Marketing Infrastructure Audit Report & Gap Matrix*.

### Stage 2: Strategise (Systems Architecture Blueprint)
- **Objective:** Design the target technical architecture and define tool selection and data paths.
- **Key Activities:**
  - Map the unified customer conversion journey and data flows.
  - Select and approve software stack (CRM, Tag Management, ESP, Analytics).
  - Define custom event tracking taxonomy and UTM naming conventions.
  - Specify automated workflow triggers, conditions, and actions.
- **Milestone Output:** *Systems Architecture Blueprint & Implementation Roadmap*.

### Stage 3: Build (Infrastructure Construction)
- **Objective:** Construct and configure the technical components across the selected pillars.
- **Key Activities:**
  - Deploy and configure tracking containers (Google Tag Manager, GA4, Conversion APIs).
  - Build conversion-focused landing pages and frictionless checkout/inquiry flows.
  - Structure CRM properties, pipeline stages, and lead qualification logic.
  - Build core email lifecycle flows (welcome series, abandoned browse/cart, post-purchase).
  - Configure paid acquisition campaigns and verified UTM tracking hierarchies.
- **Milestone Output:** *Configured, Functional Marketing Assets Ready for Testing*.

### Stage 4: Integrate (End-to-End System Integration)
- **Objective:** Interconnect platforms to ensure seamless data flow with zero manual friction.
- **Key Activities:**
  - Connect web forms and lead capture points directly into the central CRM.
  - Automate instant lead notification workflows (Slack, WhatsApp, Email, SMS).
  - Synchronize offline conversion events back to Meta Ads and Google Ads.
  - Establish automated contact list segmentation based on customer behavior.
- **Milestone Output:** *Live, Fully Integrated Business & Marketing Infrastructure*.

### Stage 5: Optimise (Validation, Measurement & Scaling)
- **Objective:** Validate data fidelity and iteratively optimize performance.
- **Key Activities:**
  - End-to-end sandbox testing of leads, payments, and conversion firing.
  - Tag audit using DebugView and live network inspection.
  - Launch live traffic and monitor baseline conversion metrics (CAC, CPL, ROAS).
  - Regular optimization cycles: landing page CRO tests, email deliverability tuning, and pipeline velocity reviews.
- **Milestone Output:** *Executive Performance Dashboard & Ongoing Growth Retainer*.

---

## 4. Client Diagnostic Assessment Matrix

During the initial discovery call, prospective clients are evaluated against six core operational criteria:

| Category | Diagnostic Question | Red Flag / Problem Indicator | Structiva Remediation |
| :--- | :--- | :--- | :--- |
| **Attribution** | Can you identify which specific campaign, ad, or keyword generated your last 10 paying customers? | "We rely on platform-reported numbers" or "We just track overall revenue." | Implement GTM, GA4, CAPI, and standardized UTM parameters. |
| **Conversion** | What is your website's baseline conversion rate, and where do visitors drop off most frequently? | "We don't track drop-off" or "It feels low but we aren't sure." | Deploy event tracking on key funnel steps; re-architect landing pages. |
| **Lead Handling** | How long does it take your team to contact a new inbound lead? | Over 30 minutes, or leads sit in inbox/DMs manually unassigned. | Configure instant CRM routing, automated acknowledgment, and SMS/Slack alerts. |
| **Retention** | What automated communication triggers after a customer completes a purchase? | "We send a receipt, then nothing unless we do a manual blast." | Implement automated post-purchase onboarding, nurture, and replenishment flows. |
| **Integration** | How many times do team members manually copy-paste lead or customer data across tools? | Multiple spreadsheets, manual CSV exports, disparate chat channels. | Integrate systems via webhooks, native APIs, or automation middleware (Make/Zapier). |
| **Data History** | Do you maintain clean historical performance logs and customer cohort data? | No centralized records; fragmented platform reports. | Consolidate data into clean reporting dashboards and unified customer profiles. |
