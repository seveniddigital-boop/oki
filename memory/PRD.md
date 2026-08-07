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

## Implemented (2026-08-07, QA + fix round)
- Light theme hero tower replaced (bright glass skyscraper corner against white sky)
- Crypto windows hardened: chart panel now shows "Feed unavailable + Retry" instead of infinite loading; search window shows tap-to-retry on failure; prices endpoint gets 3-attempt retry, 120s cache, and graceful empty-200 degradation (no more console 502s)
- iOS Safari fixes: form inputs bumped to 16px on mobile (stops auto-zoom on focus), viewport-fit=cover, 100dvh support for full-screen sections
- Added gold scroll-progress bar (fixed top, spring-animated)
- QA: console sweep clean, mobile 390px crypto search + chart verified, light hero verified

## Implemented (2026-08-05, crypto search + mobile fixes + system theme)
- "Select L1 Infrastructure" chip replaced with "Search Assets": a fancy popover window (pulse-dot header, monospace search field, scrollable results with symbol + market-cap rank) — pick any of 10,000+ coins and its chart renders with name, price, timeframes, and hover crosshair. Backend GET /api/crypto-search proxies CoinGecko search (10-min cache, retries); chart endpoint now accepts any valid coin id
- Mobile bug fix: sound and theme toggle buttons added to the mobile top bar (were desktop-only)
- Theme now follows the device's system setting (prefers-color-scheme) by default, with European time as fallback and manual toggle override persisted; inline head script updated to match

## Implemented (2026-08-05, sound toggle + chart hover + disclosures)
- Sound mute switch in nav (Volume2/VolumeX), persists to localStorage
- Crypto chart hover: crosshair line + gold dot + tooltip showing exact price and date/time at cursor position
- Holdings dashboard charts (allocation donut, geographic bars, growth line) now collapse/expand via dropdown buttons with animated height; allocation open by default

## Implemented (2026-08-05, chart timeframe switcher)
- 24H / 7D / 30D buttons in the currency chart panel header — active range highlighted in gold, chart refetches and redraws per timeframe (backend days param already supported), price/change/high-low recompute per range

## Implemented (2026-08-05, UI click sounds)
- Subtle premium click sound on every button/link press: Web Audio API-generated soft low "thock" + high tick (no audio files, ~0.07 gain), global delegated listener, AudioContext resumed on first gesture per autoplay policy

## Implemented (2026-08-05, interactive currency charts)
- Currency chips (Bitcoin / Ethereum / Select L1 Infrastructure) are now buttons — clicking one reveals an animated 7-day price chart for that coin (gold line draw + area fill, current price, 24h-style change, high/low labels, close button); clicking again or the X dismisses it
- Backend GET /api/crypto-chart proxies CoinGecko market_chart with 5-min per-coin cache, 3-attempt retry on rate limits, and stale fallback

## Implemented (2026-08-05, hero photo replacement)
- Hero background replaced per user request: dark theme now uses a twisted night tower with dotted lights (framed center-bottom); light theme keeps the original B&W Empire State photo (user preference); preload link updated

## Implemented (2026-08-05, copy de-duplication pass)
- Rewrote repeated copy sitewide: Home doctrine chapters no longer duplicate Strategy phases (new distinct texts), quote band changed to "Structure is the moat. Time is the multiplier." (was repeating footer motto), Holdings intro and crypto section reworded, Insights essay retitled "The Case for Never Selling", "center of gravity" / "across continents" / "generational horizon" / "we own time" overlaps resolved across Home, Strategy, About, Contact, and Insights

## Implemented (2026-08-05, branded transitions + perf)
- Page transitions now show the full branded veil on every nav click: skyscraper-canyon photo, gold logo mark, OKI_INC. wordmark, tagline, gold progress line — slides up, holds, slides away (mirrors the entry preloader)
- Tower interlude image replaced (Chrysler Building through trees at dusk / bright overcast tower for light theme) — no longer repeats the hero photo
- Scroll performance: grid drift animation converted from background-position to GPU-composited transform, will-change on all parallax layers, hero images downscaled to w=1600

## Implemented (2026-08-05, live crypto ticker)
- Live BTC/ETH/SOL price ticker in the Digital Asset Management section: backend GET /api/crypto-prices proxies CoinGecko public API (keyless) with 45s in-memory cache and stale-fallback; frontend polls every 60s
- Ticker design: pulsing "Live Market" dot, monospace prices, gold/crimson 24h change with trend icons, "CoinGecko · 60s refresh" attribution. Verified live: BTC $64,340 +1.08%

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
