import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
