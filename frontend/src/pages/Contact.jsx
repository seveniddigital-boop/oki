import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Landmark, FileText, ArrowUpRight } from "lucide-react";
import { KineticLines, Reveal, SectionTag, pageAnim } from "@/components/Kinetic";
import LazyBg from "@/components/LazyBg";

const details = [
  {
    Icon: MapPin,
    label: "Corporate Headquarters",
    lines: ["One World Trade Center, 85th Floor", "New York, NY 10007", "United States of America"],
  },
  {
    Icon: Landmark,
    label: "Incorporation",
    lines: ["Delaware C-Corporation", "Delaware General Corporation Law", "Established 2026"],
  },
  {
    Icon: FileText,
    label: "Corporate Deck",
    lines: ["One-page overview of OKI Inc. —", "coverage, method, and architecture.", "Available as a PDF download."],
  },
];

export default function Contact() {
  return (
    <motion.main data-testid="contact-page" {...pageAnim}>
      <section className="relative overflow-hidden pb-20 pt-40">
        <LazyBg
          src="https://images.unsplash.com/photo-1601923112035-3e4819c82317?q=80&w=1200&auto=format&fit=crop"
          className="absolute inset-0 bg-cover bg-center"
          role="img"
          aria-label="Looking up between corporate towers"
        />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-veil)" }} />
        <div className="hero-bottom-fade absolute inset-0" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <SectionTag index="C/01" label="Contact" />
          <KineticLines
            lines={["One office.", "One line."]}
            lineClassName="font-display text-6xl font-semibold leading-[0.9] tracking-tighter text-oki-text md:text-9xl"
          />
          <Reveal delay={0.4} className="mt-10 max-w-xl">
            <p className="text-sm leading-relaxed text-oki-muted">
              OKI Inc. keeps a single corporate seat and a single phone line. No forms, no gatekeeping — the address below is the whole protocol.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Corporate Headquarters</p>
              <p data-testid="contact-address-block" className="mt-6 font-display text-3xl font-medium leading-snug tracking-tight text-oki-text md:text-5xl">
                One World Trade Center,<br />
                85th Floor, New York,<br />
                NY 10007
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="tel:+12122208443"
                  data-testid="contact-phone-link"
                  className="group inline-flex items-center gap-3 border border-oki-gold/50 px-7 py-4 font-mono text-sm tracking-[0.2em] text-oki-gold transition-colors duration-500 hover:bg-oki-gold hover:text-oki-black"
                >
                  <Phone className="h-4 w-4" />
                  +1 (212) 220-8443
                </a>
                <a
                  href="mailto:contact@okiinc.global"
                  data-testid="contact-email-link"
                  className="group inline-flex items-center gap-3 border border-white/20 px-7 py-4 font-mono text-sm tracking-[0.15em] text-oki-text transition-colors duration-500 hover:border-oki-gold hover:text-oki-gold"
                >
                  <Mail className="h-4 w-4" />
                  contact@okiinc.global
                </a>
              </div>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-oki-muted">
                Corporate communications and press inquiries are handled directly from headquarters. OKI Inc. is incorporated in the State of Delaware and operates in good standing under the Delaware General Corporation Law.
              </p>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.35em] text-oki-gold">Filed · Maintained · Permanent</p>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <Reveal className="group relative mb-8 overflow-hidden border border-white/10">
              <div className="relative h-72 w-full">
                <div
                  data-testid="contact-hq-photo"
                  className="tower-dark absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  role="img"
                  aria-label="One World Trade Center illuminated at night"
                  style={{ backgroundImage: "url(https://images.unsplash.com/photo-1541418610316-6fbb40925852?q=80&w=1200&auto=format&fit=crop)" }}
                />
                <div
                  data-testid="contact-hq-photo-light"
                  className="tower-light absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  role="img"
                  aria-label="One World Trade Center against a clear daytime sky"
                  style={{ backgroundImage: "url(https://images.unsplash.com/photo-1664995189390-ca1d782ec719?q=80&w=1200&auto=format&fit=crop)" }}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-black/30" />
              <p className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.35em] text-white/60">One World Trade Center — New York, USA</p>
            </Reveal>
            <Reveal className="border border-white/10 bg-oki-surface p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">At a Glance</p>
              <div className="mt-6 space-y-5">
                <div className="flex justify-between gap-6 border-b border-white/10 pb-4 text-sm">
                  <span className="text-oki-faint">Entity</span>
                  <span className="text-right text-oki-text">OKI Inc.</span>
                </div>
                <div className="flex justify-between gap-6 border-b border-white/10 pb-4 text-sm">
                  <span className="text-oki-faint">Type</span>
                  <span className="text-right text-oki-text">Delaware C-Corporation</span>
                </div>
                <div className="flex justify-between gap-6 border-b border-white/10 pb-4 text-sm">
                  <span className="text-oki-faint">Founded</span>
                  <span className="text-right text-oki-text">2026</span>
                </div>
                <div className="flex justify-between gap-6 border-b border-white/10 pb-4 text-sm">
                  <span className="text-oki-faint">Focus</span>
                  <span className="text-right text-oki-text">Market Intelligence</span>
                </div>
                <div className="flex justify-between gap-6 text-sm">
                  <span className="text-oki-faint">Email</span>
                  <a href="mailto:contact@okiinc.global" className="text-right text-oki-gold transition-colors duration-300 hover:text-oki-text">contact@okiinc.global</a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {details.map(({ Icon, label, lines }, i) => (
            <Reveal key={label} delay={i * 0.12} className="card-glow bg-oki-black p-10 transition-colors duration-500 hover:bg-oki-elevated">
              <Icon className="h-5 w-5 text-oki-gold" />
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">{label}</p>
              <div className="mt-4 space-y-1">
                {lines.map((l) => (
                  <p key={l} className="text-sm leading-relaxed text-oki-muted">{l}</p>
                ))}
              </div>
              {label === "Corporate Deck" && (
                <a
                  href={`${process.env.REACT_APP_BACKEND_URL}/api/deck`}
                  data-testid="contact-deck-link"
                  className="group mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-gold"
                >
                  Download PDF
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </section>
    </motion.main>
  );
}
