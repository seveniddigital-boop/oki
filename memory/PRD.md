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

## Implemented (2026-08-12, contact page → informational)
- Contact page form removed entirely; page is now pure corporate information: "One office. One line." header, large HQ address block (One World Trade Center, 85th Floor), tap-to-call phone button, At-a-Glance entity card (Entity/Type/Founded/Focus), and three detail cards (Headquarters, Incorporation, Corporate Deck with PDF link); page meta updated

## Implemented (2026-08-12, market board redesign)
- MarketBoard rebuilt: labeled Crypto (left) / Stocks (right) columns; heading changed to "One board. Both markets."
- Prices ⇄ Charts view toggle (segmented control, gold active state): Prices view = BTC panel (price, 24h change, market cap, volume) + ETH/SOL rows + indices cards + equity rows; Charts view = compact selector rail (Crypto/Indices/Equities groups) + embedded MarketChart with timeframes; clicking any cell flips into that asset's chart; X returns to Prices
- MarketChart gained `embedded` mode (borderless, full-height) for in-board rendering; AnimatePresence crossfade between views; verified desktop + 390px mobile (0px overflow, no console errors)

## Implemented (2026-08-12, full informational pivot completion + stocks dashboard)
- Completed the holdings purge sitewide: Home (hero statement, Position, Method chapters Watch/Study/Publish, focus areas, CTA "Just getting started. Going to the top."), Strategy ("Attention is the Strategy" — Watch/Study/Publish phases), About (young-corporation architecture, no holding entities), Insights (5 essays rewritten as public market commentary — no custody/portfolio claims), Contact (capital-range gatekeeping removed, general corporate inquiry), Nav/Footer/Marquee, index.html meta, page meta, preloader/veil tagline "Global Market Intelligence · Live Public Data"
- New MarketBoard dashboard on /markets: Bitcoin panel (live price, 24h change, market cap, 24h volume) + stocks section (indices S&P 500/NASDAQ/Dow + equities AAPL/MSFT/NVDA/TSLA/AMZN with price & % change) + ETH/SOL strip — every cell clickable to open the chart
- Backend: /api/market-prices extended to 11 instruments (crypto with market_cap/volume, type=index/stock), Yahoo fetches parallelized via asyncio.gather; Inquiry model no longer requires capital; inquiry email template rebranded ("NEW CORPORATE INQUIRY"); PDF deck fully rewritten (Global Markets. One Window. / Watch-Study-Publish / information-only disclaimer)
- Verified by testing agent: backend 9/9, frontend all checks (board, charts, contact, themes, mobile, forbidden-phrase scan clean on all routes)

## Implemented (2026-08-12, informational pivot + stocks)
- Site repositioned as a pure informational platform for a rising corporation: all portfolio/holdings claims removed (allocation donut, geographic bars, growth chart, control spectrum, locked card, NDA copy, percentage bento)
- Holdings page replaced by Markets page (/markets): "Global Markets" header, live ticker (BTC/ETH/SOL + SPX/AAPL/MSFT/TSLA), Market Window terminal (quick chips + unified search + chart with timeframes/hover/briefs), "How we read markets" lenses, informational Focus Areas cards with photos
- Search window now covers stocks AND crypto: backend /api/market-search merges Yahoo Finance (equities/ETFs/indices) + CoinGecko; /api/market-chart serves both with timeframe mapping; /api/market-prices unified ticker feed; type badges (STOCK crimson / CRYPTO gold)
- Honest starting-corporation voice: stats now Founded 2026 / New York / Delaware; position copy "being built to own"; Perspectives essays de-claimed; PDF deck allocation bars replaced with Focus Markets list
- Nav/Footer/Home links renamed to Markets; /holdings route removed; old chart components deleted

## Implemented (2026-08-12, grain removal)
- Removed the film-grain noise overlay sitewide per user request ("looks like pixels") — cleaner solid backgrounds in both themes

## Implemented (2026-08-12, refinement round)
- Footer: giant "OKI INC." outline watermark behind footer content
- Back-to-top floating gold button (appears after 1.5 viewports)
- Hero overline letter-spacing reveal (1.2em → 0.5em couture animation)
- About architecture diagram: animated gold connector line + "Capital flows downward · Control flows upward" caption
- Marquee pauses on hover; Escape key closes mobile menu and crypto search window

## Implemented (2026-08-12, performance overhaul + signature telemetry)
- Performance: all heavy section backgrounds now lazy-load via IntersectionObserver (LazyBg, 300px rootMargin) and were downscaled to w=1200/q=80; hero images stay eager+preloaded; film grain disabled on mobile (major scroll-lag source); content-visibility auto utility added; dead code removed (Tower.jsx, RealTower.jsx)
- New signature element: live telemetry HUD fixed bottom-left on desktop — One World Trade Center coordinates + real-time NYC clock with pulsing gold dot
- Verified: telemetry ticking live, lazy bands render on scroll, mobile hero clean without grain, console sweep clean

## Implemented (2026-08-12, six-item polish round)
- Interlude lines changed to "Think long. / Move wisely. / Leave a legacy."
- Donut modernized: thinner ring with gaps, hover any legend row (or arc) to highlight the segment — center shows that segment's % and label, siblings dim; legend text overlap fixed (rows wrap cleanly)
- Control Spectrum modernized: bands expand vertically on hover with gold frame and inline "Label · %" readout, siblings dim; legend buttons drive the same highlight
- Footer copyright line removed per request
- Double-loading bug fixed: entry preloader now plays only on the first visit of the session (sessionStorage); logo clicks show the branded veil once, and the hero animates immediately on return visits (delay compensation)

## Implemented (2026-08-12, PDF/donut fixes + lockable positions + HQ change)
- PDF deck fixed: allocation labels no longer run into bars (label font/spacing reworked), percentage labels given clear separation — verified by document analysis with 100% confidence
- Donut chart rebuilt from scratch: plain SVG arc paths with CSS-transition drawing (framer-motion was stripping rotations, collapsing all segments into one ring) — verified in both themes
- Private Credit & Special Situations card is now LOCKED: padlock icon, "Restricted Position" in crimson, NDA disclosure note, "Request Access" link to the contact page
- Crypto chart panels now include an institutional one-line brief per asset (custom for BTC/ETH/SOL, generic watchlist note for searched coins); methodology footnote added under the dashboard
- Address changed sitewide to One World Trade Center, 85th Floor, New York, NY 10007 with phone +1 (212) 220-8443 (footer, About, Contact, email template, PDF deck, meta); Delaware kept as incorporation note

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
- P1: Watchlist chips — let visitors pin searched assets next to BTC/ETH for the session
- P1: Market news feed — scrolling strip of live financial headlines under the ticker
- P2: Tower-ascent intro — "scroll-rides-the-elevator" entrance up to the 85th floor

## Next Tasks
1. User verification of the completed informational pivot + stocks dashboard
2. Watchlist chips (P1)
3. Market news feed strip (P1)
