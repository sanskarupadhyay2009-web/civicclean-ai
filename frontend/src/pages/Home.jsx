import Hero from "../components/home/Hero";
import ScanSection from "../components/home/ScanSection";
import Features from "../components/home/Features";
import Stats from "../components/home/Stats";
import EarthImpact from "../components/home/EarthImpact";
import CommunityStories from "../components/home/CommunityStories";

import StackSection from "../components/common/StackSection";
import ScrollFX from "../components/common/ScrollFX";
import CyberParticleBackground from "../components/home/CyberParticleBackground";
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

      <CyberParticleBackground />
      <CursorGlow />

      <ScrollFX />

      <StackSection index={0}>
        <Hero />
      </StackSection>

      <StackSection index={1}>
        <ScanSection />
      </StackSection>

      <StackSection index={2}>
        <Features />
      </StackSection>

      <StackSection index={3}>
        <Stats />
      </StackSection>

      <StackSection index={4}>
        <EarthImpact />
      </StackSection>

      <StackSection index={5}>
        <CommunityStories />
      </StackSection>

    </main>
  );
}

export default Home;
