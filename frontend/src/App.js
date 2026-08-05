import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Holdings from "@/pages/Holdings";
import Strategy from "@/pages/Strategy";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

function europeanTheme() {
  try {
    const hour = parseInt(
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hour: "numeric", hour12: false }).format(new Date()),
      10
    );
    return hour >= 7 && hour < 19 ? "light" : "dark";
  } catch {
    return "dark";
  }
}

const PAGE_META = {
  "/": ["OKI Inc. — International Asset Holdings", "OKI Inc. is a Delaware C-Corporation engineered for international asset ownership. We acquire, structure, and hold strategic assets across borders. Ownership is the strategy."],
  "/holdings": ["Holdings & Assets — OKI Inc.", "A consolidated view of the OKI Inc. portfolio: equity holdings, strategic real assets, intellectual property, and private credit — structured for control and held on a generational horizon."],
  "/strategy": ["Strategy — OKI Inc.", "The OKI doctrine: identify high-conviction global assets, structure them through Delaware holding architecture, and hold with long-duration control orientation."],
  "/about": ["Corporate Architecture — OKI Inc.", "OKI Inc. is a Delaware C-Corporation — the optimal vehicle for international asset ownership. Governance, leadership offices, and the registered office at 16192 Coastal Highway, Lewes, Delaware."],
  "/contact": ["Investor Access — OKI Inc.", "Serious capital and strategic conversations only. All inquiries are reviewed by the Chief Investment Office of OKI Inc."],
};

function RouteMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const [title, desc] = PAGE_META[pathname] || PAGE_META["/"];
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", desc);
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.theme = europeanTheme();
    };
    apply();
    const id = setInterval(apply, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="App grain">
      <BrowserRouter>
        <RouteMeta />
        <SmoothScroll>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/strategy" element={<Strategy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </SmoothScroll>
      </BrowserRouter>
    </div>
  );
}

export default App;
