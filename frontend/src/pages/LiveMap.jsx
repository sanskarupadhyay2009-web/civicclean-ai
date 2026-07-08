import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

import GoogleMapEmbed from "../components/common/GoogleMapEmbed";

import "../styles/livemap.css";

// Placeholder city-center coordinates until reports are wired up to a
// real backend endpoint returning live report locations.
const CITY_CENTER = { latitude: 26.8467, longitude: 80.9462 };

function LiveMap() {
  return (
    <main className="map-page">
      <motion.div
        className="map-header"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Live Cleanliness Map</h1>

        <p>Monitor waste reports across the city in real time.</p>
      </motion.div>

      <div className="map-toolbar">
        <div className="map-search">
          <Search size={18} />

          <input placeholder="Search location..." />
        </div>

        <button>
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="map-layout">
        <div className="map-view">
          <GoogleMapEmbed
            latitude={CITY_CENTER.latitude}
            longitude={CITY_CENTER.longitude}
            zoom={12}
            height={480}
          />
        </div>

        <div className="map-sidebar">
          <h3>Recent Reports</h3>

          <div className="marker-card">
            📍 Plastic Waste
            <span>Hazratganj</span>
          </div>

          <div className="marker-card">
            📍 Garbage Dump
            <span>Gomti Nagar</span>
          </div>

          <div className="marker-card">
            📍 Electronic Waste
            <span>Aliganj</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LiveMap;
