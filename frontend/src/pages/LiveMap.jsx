import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Search, Layers, MapPin } from "lucide-react";
import L from "leaflet";

import HeatmapLayer from "../components/common/HeatmapLayer";

import "leaflet/dist/leaflet.css";
import "../styles/livemap.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CITY_CENTER = { latitude: 26.8467, longitude: 80.9462 };

const REPORTS = [
  { id: 1, type: "Plastic Waste", area: "Hazratganj", severity: "Medium", latitude: 26.8467, longitude: 80.9462 },
  { id: 2, type: "Garbage Dump", area: "Gomti Nagar", severity: "High", latitude: 26.8506, longitude: 81.0091 },
  { id: 3, type: "Electronic Waste", area: "Aliganj", severity: "Low", latitude: 26.8848, longitude: 80.9418 },
  { id: 4, type: "Mixed Waste", area: "Indira Nagar", severity: "Medium", latitude: 26.8770, longitude: 80.9820 },
  { id: 5, type: "Organic Waste", area: "Chowk", severity: "High", latitude: 26.8600, longitude: 80.9060 },
  { id: 6, type: "Plastic Waste", area: "Hazratganj", severity: "Low", latitude: 26.8490, longitude: 80.9430 },
  { id: 7, type: "Garbage Dump", area: "Gomti Nagar", severity: "Medium", latitude: 26.8540, longitude: 81.0050 },
];

const HEAT_POINTS = REPORTS.flatMap((r) => {
  const weight = r.severity === "High" ? 1 : r.severity === "Medium" ? 0.6 : 0.3;
  return [...Array(6)].map(() => [
    r.latitude + (Math.random() - 0.5) * 0.006,
    r.longitude + (Math.random() - 0.5) * 0.006,
    weight,
  ]);
});

function FlyToController({ target }) {
  const map = useMap();

  if (target) {
    map.flyTo([target.latitude, target.longitude], 15, { duration: 1.2 });
  }

  return null;
}

function LiveMap() {
  const [query, setQuery] = useState("");
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [selected, setSelected] = useState(null);

  const filteredReports = useMemo(() => {
    if (!query.trim()) return REPORTS;

    const q = query.trim().toLowerCase();

    return REPORTS.filter(
      (r) =>
        r.type.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelectReport = (report) => {
    setSelected(report);
  };

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

          <input
            placeholder="Search by area or waste type..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button
          type="button"
          className={showHeatmap ? "active" : ""}
          onClick={() => setShowHeatmap((v) => !v)}
        >
          <Layers size={18} />
          {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
        </button>
      </div>

      <div className="map-layout">
        <div className="map-view">
          <MapContainer
            center={[CITY_CENTER.latitude, CITY_CENTER.longitude]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {showHeatmap && <HeatmapLayer points={HEAT_POINTS} />}

            {filteredReports.map((r) => (
              <Marker key={r.id} position={[r.latitude, r.longitude]}>
                <Popup>
                  <strong>{r.type}</strong>
                  <br />
                  {r.area} &middot; {r.severity} severity
                </Popup>
              </Marker>
            ))}

            <FlyToController target={selected} />
          </MapContainer>
        </div>

        <div className="map-sidebar">
          <h3>Recent Reports</h3>

          {filteredReports.length === 0 && (
            <p className="no-results">No reports match "{query}".</p>
          )}

          {filteredReports.map((r) => (
            <button
              type="button"
              key={r.id}
              className="marker-card"
              onClick={() => handleSelectReport(r)}
            >
              <MapPin size={16} />
              {r.type}
              <span>{r.area}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default LiveMap;
