import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Search, Layers, MapPin, Loader2 } from "lucide-react";
import L from "leaflet";

import { getReports } from "../services/reportService";
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

// Fallback center (Lucknow) used only when there isn't at least one real
// report with a location yet, so the map still opens somewhere sensible.
const DEFAULT_CENTER = { latitude: 26.8467, longitude: 80.9462 };

const SEVERITY_WEIGHT = { High: 1, Medium: 0.6, Low: 0.3 };

function FlyToController({ target }) {
  const map = useMap();

  if (target) {
    map.flyTo([target.location.latitude, target.location.longitude], 16, {
      duration: 1.2,
    });
  }

  return null;
}

function LiveMap() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchReports = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await getReports();

        if (!cancelled) {
          setReports(data.reports || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Couldn't load live reports right now."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchReports();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredReports = useMemo(() => {
    if (!query.trim()) return reports;

    const q = query.trim().toLowerCase();

    return reports.filter((r) => {
      const haystack = [
        r.wasteType,
        r.category,
        r.location?.city,
        r.location?.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [reports, query]);

  const heatPoints = useMemo(
    () =>
      filteredReports.map((r) => [
        r.location.latitude,
        r.location.longitude,
        SEVERITY_WEIGHT[r.severity] || 0.4,
      ]),
    [filteredReports]
  );

  const center = filteredReports[0]?.location || DEFAULT_CENTER;

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

      {error && <div className="report-error">{error}</div>}

      <div className="map-layout">
        <div className="map-view">
          {loading ? (
            <div className="map-loading">
              <Loader2 size={26} className="spin" />
              Loading live reports...
            </div>
          ) : (
            <MapContainer
              center={[center.latitude, center.longitude]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {showHeatmap && heatPoints.length > 0 && (
                <HeatmapLayer points={heatPoints} />
              )}

              {filteredReports.map((r) => (
                <Marker
                  key={r._id}
                  position={[r.location.latitude, r.location.longitude]}
                >
                  <Popup>
                    <strong>{r.wasteType}</strong>
                    <br />
                    {r.location.city || r.location.address || "Unknown area"}
                    <br />
                    {r.severity} severity
                  </Popup>
                </Marker>
              ))}

              <FlyToController target={selected} />
            </MapContainer>
          )}
        </div>

        <div className="map-sidebar">
          <h3>Recent Reports</h3>

          {!loading && filteredReports.length === 0 && (
            <p className="no-results">
              {reports.length === 0
                ? "No reports have been submitted yet. Be the first — go to Report Waste!"
                : `No reports match "${query}".`}
            </p>
          )}

          {filteredReports.map((r) => (
            <button
              type="button"
              key={r._id}
              className="marker-card"
              onClick={() => handleSelectReport(r)}
            >
              <MapPin size={16} />
              {r.wasteType}
              <span>
                {r.location.city || r.location.address || "Unknown area"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default LiveMap;
