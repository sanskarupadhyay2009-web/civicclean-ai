import Hero from "../components/home/Hero";
import ScanSection from "../components/home/ScanSection";
import ParticleMorphSection from "../components/home/ParticleMorphSection";
import Features from "../components/home/Features";
import Stats from "../components/home/Stats";
import EarthImpact from "../components/home/EarthImpact";

import StackSection from "../components/common/StackSection";
import CursorGlow from "../components/home/CursorGlow";

import "../styles/hero.css";
import "../styles/city.css";
import "../styles/scan.css";
import "../styles/features.css";
import "../styles/stats.css";
import "../styles/stacksection.css";
import "../styles/home.css";

function Home() {
  return (
    <main className="home-stack">

      <CursorGlow />

      <StackSection index={0}>
        <Hero />
      </StackSection>

      <StackSection index={1}>
        <ScanSection />
      </StackSection>

      {/* Not wrapped in StackSection — this section pins itself via
          position:sticky internally for its own scroll-scrub, and
          StackSection applies a CSS transform (scale) to its wrapper,
          which would break a sticky descendant. */}
      <ParticleMorphSection />

      <StackSection index={2}>
        <Features />
      </StackSection>

      <StackSection index={3}>
        <Stats />
      </StackSection>

      <StackSection index={4}>
        <EarthImpact />
      </StackSection>

    </main>
  );
}

export default Home;
