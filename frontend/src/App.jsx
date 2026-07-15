import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIOrb from "./components/common/AIOrb";
import PageTransition from "./components/common/PageTransition";
import ScrollProgressBar from "./components/common/ScrollProgressBar";

import "./styles/aiorb.css";

function App() {
  return (
    <>
      <ScrollProgressBar />

      <Background />

      <Navbar />

      <PageTransition />

      <AIOrb />

      <Footer />
    </>
  );
}

export default App;
