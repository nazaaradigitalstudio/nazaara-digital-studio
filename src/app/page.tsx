import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Founders from "@/components/sections/Founders";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Portfolio";
import Process from "@/components/sections/Process";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Founders />
      <Services />
      <Portfolio />
      <Process />
      <CTA />
      <Footer />
    </main>
  );
}
