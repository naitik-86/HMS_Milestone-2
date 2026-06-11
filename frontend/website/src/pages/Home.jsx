import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import Stats from "../components/Stats.jsx";
import WhyChoose from "../components/WhyChoose.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Pricing from "../components/Pricing.jsx";
import CTA from "../components/CTA.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <WhyChoose />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
    </>
  );
}
