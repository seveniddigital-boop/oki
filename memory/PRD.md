# OKI Inc. — Corporate Website PRD

## Original Problem Statement
Build a high-end, dark-themed, attention-grabbing corporate website for OKI Inc. — a Delaware C-Corporation specializing in international asset holdings and investments. Aesthetic: dark charcoal/black (#0A0A0A / #111111), deep crimson and gold accents, sharp geometric lines, subtle animated gradients, premium typography (Clash Display headlines, Satoshi/Inter body). Tone: quiet dominance — confident, minimal, slightly intimidating, no hype words. Pages: Homepage hero, Holdings & Assets (animated custom SVG charts), Strategy (Identify/Structure/Hold), About/Architecture (Delaware C-Corp, restrained leadership, 16192 Coastal Highway, Lewes, DE 19958), Contact/Access (minimal form, "Serious capital and strategic conversations only").

## User Choices
- Multi-page site with separate routes (React Router)
- Contact form: front-end only, no storage
- Charts: lightweight custom SVG/canvas animations (no chart libraries)
- Award-worthy motion: framer-motion scroll reveals, lenis smooth scrolling, kinetic masked hero reveal, editorial marquee, parallax/3D hero moment

## Architecture
- Frontend: React 19 + React Router 7, Tailwind CSS, framer-motion 11, lenis, react-fast-marquee, lucide-react
- Backend: FastAPI template (unused by site — front-end only per user choice); MongoDB available but not required
- Pages: / (Home), /holdings, /strategy, /about, /contact
- Key components: Nav (floating glass nav on scroll), Footer, SmoothScroll (Lenis), Kinetic (masked line reveals + Reveal + SectionTag), EditorialMarquee, charts/ (DonutChart, GeoBars, GrowthLine, ControlSpectrum — all pure SVG + framer-motion)

## User Personas
- Institutional investors / family offices evaluating OKI Inc.
- Strategic partners seeking the holding company's mandate and structure
- General visitors forming an impression of quiet, elite corporate power

## Core Requirements (static)
- Dark charcoal base, crimson + gold accents, Clash Display / Satoshi typography
- Kinetic hero with masked line-by-line reveal, parallax grid, mouse-tilt 3D
- Holdings dashboard: allocation donut (42/28/18/12), geographic bars, growth line, control spectrum
- Strategy doctrine: Identify → Structure → Hold
- About: Delaware C-Corp architecture, institutional leadership (titles only), registered address
- Contact: minimal front-end-only form with encrypted-inquiry motif

## Implemented (2026-08-04)
- Full 5-page multi-route site with floating glass navigation and mobile menu
- Preloader + kinetic hero with masked reveals, animated grid drift, radial crimson/gold glows, scroll parallax, mouse-tilt 3D
- Editorial marquee (slow, react-fast-marquee)
- Custom animated SVG charts: donut allocation, geographic control bars, growth trajectory line with area fill, control spectrum stacked bar
- Numbered manifesto chapters (01 Acquire / 02 Structure / 03 Hold) on Home; timeline layout on Strategy
- About page: architecture stack diagram, governance section with bg image, leadership by office title only, registered office block
- Contact page: front-end-only form with animated success state (MOCKED — no backend storage, per user choice)
- Lenis momentum scrolling with route-change scroll reset; grain overlay; gold selection; custom scrollbar
- data-testid attributes on all interactive elements

## Verification
- curl: frontend 200, backend /api/ healthy
- Screenshots: hero, scroll sections, all chart animations, strategy timeline, control spectrum, footer, contact form submit → success state confirmed

## Backlog
- P0: none blocking
- P1: Wire contact form to backend (store inquiries in MongoDB + email notification via Resend) if user wants persistence
- P1: Mobile viewport fine-tuning pass (hero type scale on small screens)
- P2: Page transition animations between routes
- P2: OG/social meta tags and favicon branding
- P2: Multi-language or investor-deck PDF download

## Next Tasks
1. Confirm with user whether contact inquiries should persist (backend + Resend email)
2. Mobile QA pass
3. Route transition polish
