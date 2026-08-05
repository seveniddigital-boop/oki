import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Lock, ArrowUpRight, ShieldCheck, ChevronDown } from "lucide-react";
import { KineticLines, Reveal, SectionTag, pageAnim } from "@/components/Kinetic";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const inputCls =
  "w-full border-b border-white/20 bg-transparent py-4 text-sm text-oki-text placeholder:text-oki-faint focus:border-oki-gold focus:outline-none transition-colors duration-300";

const labelCls = "font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint";

const RANGES = [
  { value: "10-50", label: "$10M — $50M" },
  { value: "50-250", label: "$50M — $250M" },
  { value: "250-1b", label: "$250M — $1B" },
  { value: "1b+", label: "$1B+" },
];

function CapitalSelect({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected = RANGES.find((r) => r.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        data-testid="contact-capital-select"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between border-b bg-transparent py-4 text-left text-sm transition-colors duration-300 ${
          error ? "border-oki-crimsonbright" : "border-white/20"
        } focus:border-oki-gold focus:outline-none`}
      >
        <span className={selected ? "text-oki-text" : "text-oki-faint"}>
          {selected ? selected.label : "Select range"}
        </span>
        <ChevronDown className={`h-4 w-4 text-oki-faint transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            data-testid="capital-options-list"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full z-30 mt-2 border border-white/10 bg-oki-elevated shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
          >
            {RANGES.map((r) => (
              <li key={r.value}>
                <button
                  type="button"
                  data-testid={`capital-option-${r.value}`}
                  onClick={() => {
                    onChange(r.value);
                    setOpen(false);
                  }}
                  className={`w-full px-5 py-3.5 text-left font-mono text-xs tracking-[0.15em] transition-colors duration-200 hover:bg-oki-gold/10 hover:text-oki-gold ${
                    value === r.value ? "text-oki-gold" : "text-oki-muted"
                  }`}
                >
                  {r.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {error && (
        <p data-testid="contact-capital-error" className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-oki-crimsonbright">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [capitalError, setCapitalError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({ name: "", org: "", email: "", capital: "", message: "" });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.capital) {
      setCapitalError("Capital range required");
      return;
    }
    setCapitalError("");
    setSubmitError("");
    setSending(true);
    try {
      await axios.post(`${API}/inquiries`, form);
      setSent(true);
    } catch {
      setSubmitError("Transmission failed. Please retry.");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.main data-testid="contact-page" {...pageAnim}>
      <section className="relative overflow-hidden pb-20 pt-40">
        <div
          className="absolute inset-0 bg-cover bg-center"
          role="img"
          aria-label="Looking up between corporate towers"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1601923112035-3e4819c82317?q=85&w=1600&auto=format&fit=crop)" }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-veil)" }} />
        <div className="hero-bottom-fade absolute inset-0" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <SectionTag index="C/01" label="Contact / Access" />
          <KineticLines
            lines={["Investor", "Access."]}
            lineClassName="font-display text-6xl font-semibold leading-[0.9] tracking-tighter text-oki-text md:text-9xl"
          />
          <Reveal delay={0.4} className="mt-10 flex max-w-xl items-start gap-4">
            <Lock className="mt-1 h-4 w-4 shrink-0 text-oki-gold" />
            <p className="text-sm leading-relaxed text-oki-muted">
              Serious capital and strategic conversations only. All inquiries are reviewed by the Chief Investment Office. Unsolicited proposals below institutional threshold are not retained.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  data-testid="contact-success-message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="border border-oki-gold/30 bg-oki-surface p-12"
                >
                  <ShieldCheck className="h-8 w-8 text-oki-gold" />
                  <h3 className="mt-6 font-display text-3xl font-medium tracking-tight text-oki-text">Inquiry received.</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-oki-muted">
                    Your communication has entered the review channel. If the conversation warrants continuation, the Chief Investment Office will respond through secure channels.
                  </p>
                  <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.35em] text-oki-gold">Channel · Encrypted · Logged</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  data-testid="contact-form"
                  onSubmit={submit}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className={labelCls}>Full Name</label>
                      <input id="contact-name" data-testid="contact-name-input" required value={form.name} onChange={set("name")} className={inputCls} placeholder="—" />
                    </div>
                    <div>
                      <label htmlFor="contact-org" className={labelCls}>Organization</label>
                      <input id="contact-org" data-testid="contact-org-input" required value={form.org} onChange={set("org")} className={inputCls} placeholder="—" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div>
                      <label htmlFor="contact-email" className={labelCls}>Email</label>
                      <input id="contact-email" data-testid="contact-email-input" type="email" required value={form.email} onChange={set("email")} className={inputCls} placeholder="—" />
                    </div>
                    <div>
                      <label className={labelCls}>Capital Range</label>
                      <CapitalSelect
                        value={form.capital}
                        onChange={(v) => {
                          setForm({ ...form, capital: v });
                          setCapitalError("");
                        }}
                        error={capitalError}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className={labelCls}>Nature of Inquiry</label>
                    <textarea id="contact-message" data-testid="contact-message-input" required rows={4} value={form.message} onChange={set("message")} className={`${inputCls} resize-none`} placeholder="—" />
                  </div>
                  <button
                    type="submit"
                    data-testid="contact-submit-button"
                    disabled={sending}
                    className="group relative overflow-hidden border border-oki-gold/50 px-10 py-5 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-gold transition-colors duration-500 hover:text-oki-black disabled:cursor-wait disabled:opacity-60"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-oki-gold transition-transform duration-500 ease-out group-hover:translate-x-0" />
                    <span className="relative flex items-center gap-2">
                      {sending ? "Transmitting…" : "Submit Inquiry"}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </button>
                  {submitError && (
                    <p data-testid="contact-submit-error" className="font-mono text-[10px] uppercase tracking-[0.25em] text-oki-crimsonbright">
                      {submitError}
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          <div className="md:col-span-5">
            <Reveal className="group relative mb-8 overflow-hidden border border-white/10">
              <div
                className="h-72 w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1712567604499-08f207054260?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxtb29keSUyMHRhbGwlMjBkYXJrJTIwdG93ZXIlMjBsb29raW5nJTIwdXB8ZW58MHx8fHwxNzg1ODEyNjIzfDA&ixlib=rb-4.1.0&q=85)" }}
              />
              <div className="absolute inset-0 bg-black/30" />
              <p className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.35em] text-white/60">Headquarters — Delaware, USA</p>
            </Reveal>
            <Reveal className="border border-white/10 bg-oki-surface p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Registered Office</p>
              <p className="mt-4 text-sm leading-relaxed text-oki-text">
                16192 Coastal Highway<br />
                Lewes, Delaware 19958<br />
                United States of America
              </p>
              <div className="my-8 h-px bg-white/10" />
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Protocol</p>
              <ul className="mt-4 space-y-3 text-sm text-oki-muted">
                <li className="flex gap-3"><span className="text-oki-gold">—</span> Inquiries reviewed within five business days</li>
                <li className="flex gap-3"><span className="text-oki-gold">—</span> NDAs executed before any disclosure</li>
                <li className="flex gap-3"><span className="text-oki-gold">—</span> No cold solicitations retained</li>
              </ul>
              <div className="my-8 h-px bg-white/10" />
              <p className="font-mono text-[10px] leading-relaxed tracking-[0.2em] text-oki-faint">
                TRANSMISSIONS TO THIS OFFICE ARE TREATED AS CONFIDENTIAL UNDER CORPORATE CHARTER.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
