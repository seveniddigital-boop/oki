const DARK_TOWER =
  "https://images.unsplash.com/photo-1557137200-fec234cd5740?q=85&w=1600&auto=format&fit=crop";
const LIGHT_TOWER =
  "https://images.unsplash.com/photo-1533348239637-984bae0f8a5b?q=85&w=1600&auto=format&fit=crop";

export default function RealTower({ className = "" }) {
  return (
    <div className={`relative ${className}`} data-testid="hero-tower">
      <div className="tower-dark mask-x absolute inset-0">
        <div
          className="mask-v h-full w-full bg-cover bg-[center_top]"
          style={{ backgroundImage: `url(${DARK_TOWER})`, filter: "brightness(0.6) saturate(0.75) contrast(1.05)", transform: "scale(1.35)" }}
        />
      </div>
      <div className="tower-light mask-x absolute inset-0">
        <div
          className="mask-v h-full w-full bg-cover bg-[center_top] mix-blend-multiply"
          style={{ backgroundImage: `url(${LIGHT_TOWER})`, transform: "scale(1.35)" }}
        />
      </div>
    </div>
  );
}
