import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Navigation scrollY={scrollY} />
      <Hero scrollY={scrollY} />
      <Features scrollY={scrollY} />
      <Pricing scrollY={scrollY} />
      <Testimonials scrollY={scrollY} />
      <FAQ />
      <Footer />
    </div>
  );
}
