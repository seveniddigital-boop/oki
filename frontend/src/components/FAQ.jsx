import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { KineticLines, Reveal, SectionTag } from "@/components/Kinetic";

const ITEMS = [
  {
    q: "What is OKI Inc.?",
    a: (
      <>An international holdings and investments corporation — a Delaware C-Corporation founded in 2026, headquartered at One World Trade Center, New York. It acquires, invests in, holds, and manages businesses and assets across the real and digital economy.</>
    ),
  },
  {
    q: "What does OKI acquire or invest in?",
    a: (
      <>Established operating businesses, technology and software companies, digital platforms and online assets, brands and intellectual property, strategic real estate, and minority or majority strategic positions. The full criteria and process are published on the Investments page.</>
    ),
  },
  {
    q: "Does OKI publish its portfolio, performance, or leadership?",
    a: (
      <>No. By policy, OKI does not publish portfolio contents, transaction values, performance figures, or the names of its officers and counterparties. Corporate matters are disclosed privately, in the course of business.</>
    ),
  },
  {
    q: "Is anything on this site investment advice?",
    a: (
      <>No. The market data and commentary published here are informational. OKI Inc. does not manage outside money, sell financial products, or advise on positions.</>
    ),
  },
  {
    q: "How do I propose an opportunity?",
    a: (
      <>
        Directly. Call{" "}
        <a href="tel:+12122208443" data-testid="faq-phone-link" className="text-oki-gold underline-offset-4 transition-colors duration-300 hover:underline">
          +1 (212) 220-8443
        </a>{" "}
        or write to{" "}
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@okiinc.global&su=Acquisition%20Opportunity%20for%20OKI%20Inc."
          target="_blank"
          rel="noopener noreferrer"
          data-testid="faq-email-link"
          className="text-oki-gold underline-offset-4 transition-colors duration-300 hover:underline"
        >
          contact@okiinc.global
        </a>
        . Serious, well-prepared opportunities are read first.
      </>
    ),
  },
];

function Row({ item, index, open, onToggle }) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        data-testid={`faq-toggle-${index}`}
        aria-expanded={open}
        className="group flex w-full items-center gap-6 py-8 text-left md:gap-10"
      >
        <span className={`font-mono text-xs tracking-[0.2em] transition-colors duration-300 ${open ? "text-oki-gold" : "text-oki-faint"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 font-display text-xl font-medium tracking-tight text-oki-text transition-colors duration-300 group-hover:text-oki-gold md:text-2xl">
          {item.q}
        </span>
        <Plus className={`h-4 w-4 shrink-0 text-oki-gold transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-10 pl-10 text-sm leading-relaxed text-oki-muted md:pl-16 md:text-base">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section data-testid="faq-section" className="border-t border-white/10 bg-oki-surface">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-44">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <SectionTag index="06" label="Straight Answers" />
              <KineticLines
                animate={false}
                lines={["Asked.", "Answered."]}
                lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
              />
              <Reveal delay={0.2} className="mt-8 max-w-xs">
                <p className="text-sm leading-relaxed text-oki-muted">
                  No fine print, no hedging. What this corporation is, and what it is not.
                </p>
              </Reveal>
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="border-t border-white/10">
              {ITEMS.map((item, i) => (
                <Row key={item.q} item={item} index={i} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
