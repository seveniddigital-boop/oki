import Marquee from "react-fast-marquee";

const items = [
  "Delaware C-Corporation",
  "Global Market Intelligence",
  "Bitcoin · Equities · Indices",
  "Live Public Data",
  "Quiet Power",
  "Absolute Precision",
];

export default function EditorialMarquee() {
  return (
    <div data-testid="editorial-marquee" className="border-y border-white/10 bg-oki-surface py-5">
      <Marquee speed={20} gradient={false} pauseOnHover>
        {items.map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-16">
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-oki-faint">{item}</span>
            <span className="h-1 w-1 rotate-45 bg-oki-gold/60" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
