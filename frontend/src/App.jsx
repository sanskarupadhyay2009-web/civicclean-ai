import { Outlet } from "react-router-dom";

import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIOrb from "./components/common/AIOrb";

import "./styles/aiorb.css";

function App() {
  return (
    <>
      <Background />

      <Navbar />

      <Outlet />

      <AIOrb />

      <Footer />
    </>
  );
}

export default App;
