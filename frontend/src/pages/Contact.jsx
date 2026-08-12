import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ArrowUpRight, ShieldCheck, Mail } from "lucide-react";
import { KineticLines, Reveal, SectionTag, pageAnim } from "@/components/Kinetic";
import LazyBg from "@/components/LazyBg";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const inputCls =
  "w-full border-b border-white/20 bg-transparent py-4 text-base md:text-sm text-oki-text placeholder:text-oki-faint focus:border-oki-gold focus:outline-none transition-colors duration-300";

const labelCls = "font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({ name: "", org: "", email: "", message: "" });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
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
            lines={["Start the", "Conversation."]}
            lineClassName="font-display text-6xl font-semibold leading-[0.9] tracking-tighter text-oki-text md:text-9xl"
          />
          <Reveal delay={0.4} className="mt-10 flex max-w-xl items-start gap-4">
            <Mail className="mt-1 h-4 w-4 shrink-0 text-oki-gold" />
            <p className="text-sm leading-relaxed text-oki-muted">
              Partnerships, press, and professional inquiries. Every message is read by the corporate office — no gatekeeping, no minimums.
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
                  <h3 className="mt-6 font-display text-3xl font-medium tracking-tight text-oki-text">Message received.</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-oki-muted">
                    Your message has entered the review channel. The corporate office responds to every serious inquiry — typically within five business days.
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
                  <div>
                    <label htmlFor="contact-email" className={labelCls}>Email</label>
                    <input id="contact-email" data-testid="contact-email-input" type="email" required value={form.email} onChange={set("email")} className={inputCls} placeholder="—" />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className={labelCls}>Message</label>
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
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Corporate Headquarters</p>
              <p className="mt-4 text-sm leading-relaxed text-oki-text">
                One World Trade Center, 85th Floor<br />
                New York, NY 10007<br />
                United States of America
              </p>
              <a href="tel:+12122208443" data-testid="contact-phone-link" className="mt-3 inline-block text-sm text-oki-gold transition-colors duration-300 hover:text-oki-text">
                +1 (212) 220-8443
              </a>
              <div className="my-8 h-px bg-white/10" />
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Protocol</p>
              <ul className="mt-4 space-y-3 text-sm text-oki-muted">
                <li className="flex gap-3"><span className="text-oki-gold">—</span> Every message reviewed within five business days</li>
                <li className="flex gap-3"><span className="text-oki-gold">—</span> NDAs available for sensitive discussions</li>
                <li className="flex gap-3"><span className="text-oki-gold">—</span> No unsolicited solicitations retained</li>
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
