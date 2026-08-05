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

## Implemented (2026-08-05, digital assets & crypto)
- New asset class "Digital Assets & Crypto Holdings" (16%) across the site: allocation donut rebalanced to 36/24/16/14/10, homepage bento preview (5 cells), wide asset card with gold Bitcoin photography
- New "Digital Asset Management" section on Holdings: institutional custody, multi-signature governance, cold-storage majority, treasury deployment + Bitcoin/Ethereum/L1 chips
- Corporate deck PDF updated with the 5-segment allocation; new Perspectives essay "Digital Assets, Held Like Infrastructure"

## Implemented (2026-08-05, functionality + immersion mega-release)
- Inquiry storage + email: POST /api/inquiries saves to MongoDB and sends a branded HTML notification email via Emergent managed Resend (verified 202 Accepted). OWNER_EMAIL env var currently set to delivered@resend.dev TEST address — user must provide real email
- Investor deck PDF: GET /api/deck generates a one-page dark/gold corporate deck (logo, allocation bars, doctrine, registered office) via reportlab; download buttons on Home CTA and About
- Cinematic page transitions: fade/slide between all routes (AnimatePresence + pageAnim on every page)
- Traveling tower: 260vh sticky interlude on Home — pinned Empire State with "We do not trade. / We do not exit. / We own time." cycling on scroll
- Custom cursor: gold ring with spring physics, expands over links/buttons (pointer:fine only); Magnetic wrapper on hero pill CTA
- Theme toggle: sun/moon button in nav, persists override to localStorage (time-based auto applies when no override)
- Insights page (/insights): "Perspectives" — 4 expandable essays with header band, added to nav + page meta
- Contact form wired to live backend with sending/error states
- Mobile deep pass: verified hero, position, holdings header + charts at 390px — all clean

## Implemented (2026-08-05, professional upgrade pass)
- Hero veil lightened (dark 0.26 / light 0.42) and image brightened — building is sharper, no longer blurred out
- New monochrome logo system per latest brand board: theme-aware mark (gold gradient on dark, black on light), "OKI_INC." underscore wordmark in nav/footer/preloader, monochrome gold favicon
- 8 new sharp department photos: asset class cards on Holdings (financial district, concrete, circuit board, vault), Strategy phase panels (aerial city, geometric concrete, night tower), full-bleed skyline quote band on Home, photo header bands on Strategy/About/Contact
- New animations: clip-path photo reveals with slow zoom, animated stat counters (04/12), nav link underline hovers
- Optimization: per-route page titles + meta descriptions, OG tags, hero image preload, aria-labels/roles on all photo elements, console verified clean (no app errors)

## Implemented (2026-08-05, full-bleed hero background)
- Hero restructured per user feedback: the building photograph is now a FULL-BLEED background behind the text (no masked card in front), with a theme-aware veil (--hero-veil) plus top/bottom fades so headline and background never interfere
- Ken-burns entrance (scale 1.15 → 1 with fade) and scroll parallax retained on the background layer; text sits on z-10 above the image

## Implemented (2026-08-05, real building + cinematic entry)
- Replaced the SVG tower with REAL photography: Empire State Building at night (dark theme) and B&W daytime shot (light theme, multiply-blended into ivory), zoomed 1.35x so the tower dominates, edges feathered via CSS masks so the building melts into the page background while rising through the "OKI INC." type
- New preloader: full-screen "looking up between skyscrapers" photograph with slow zoom, theme-aware overlay, gold logo mark + OKI INC. wordmark + tagline reveal, gold progress line

## Implemented (2026-08-05, time-based dual theme)
- Full light/dark theming via CSS variables: all OKI color tokens, tower colors, chart neutrals, borders, overlays, and grid lines are theme-aware
- Light theme matches the TikTok reference clip: ivory background (#F2EFE8), black massive headline, white art-deco tower, gold accents
- Automatic switching based on European time (Europe/Berlin): light 07:00–19:00, dark 19:00–07:00; inline head script prevents theme flash on load; re-checked every 60s; smooth 0.6s color transitions
- Verified both themes on Home (hero + position section) and Holdings (all charts readable in both)

## Implemented (2026-08-05, video-inspired hero rebuild)
- User shared a TikTok reference (empiremetaverse-style: monumental tower rising through giant typography); frames extracted and analyzed
- Rebuilt the homepage hero in that composition: custom art-deco SVG tower (setback blocks, window lines, gold edge light, crimson accent strip, pulsing spire beacon) rising from the bottom center IN FRONT of massive "OKI / INC." type
- Scroll parallax: text drifts up while the tower drifts down (mirrors the reference video's scroll feel); tower rises from below on load after the preloader
- Pill-shaped "Explore Holdings" CTA centered over the tower base (mirrors the reference "VIEW FLOORS" pill); statement + Investor Access link bottom-left
- Fixed transform conflict (framer-motion overriding Tailwind centering) by nesting motion wrappers; verified desktop + mobile centering

## Implemented (2026-08-05, brand identity pass)
- Recreated the official OKI Inc. logo (gold geometric square + chevron + crimson bar) as a crisp SVG component with gold/crimson gradients
- Logo integrated: floating nav (mark + wordmark), hero overline, preloader, footer (large mark + wordmark + tagline), and SVG favicon

## Implemented (2026-08-04, photography & copy pass)
- Tall luxury building photography integrated sitewide: night skyscraper hero background (parallax), tower facade editorial panel on Home ("Fig. 01 — Vertical Dominance"), NYC night skyline header band on Holdings, glass tower texture on Strategy, moody tower on About governance, tower side panel on Contact ("Center of Gravity — Delaware, USA"), skyline silhouette behind closing CTA
- Copy polish: added professional corporate mandate paragraph to The Position section; footer line refined to "Established for Permanence"
- Replaced a skyline photo that contained readable foreign signage (brand-safety fix)

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
