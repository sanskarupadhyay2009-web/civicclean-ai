import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Search, Layers, MapPin, Loader2, Trash2 } from "lucide-react";
import L from "leaflet";

import { getReports, deleteReport } from "../services/reportService";
import { useAuth } from "../context/AuthContext";
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

  useEffect(() => {
    const lat = Number(target?.location?.latitude);
    const lng = Number(target?.location?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    map.flyTo([lat,lng],16,{duration:1.2});
  }, [map,target]);

  return null;
}

function LiveMap() {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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
    const validReports = reports.filter((r)=>Number.isFinite(Number(r?.location?.latitude))&&Number.isFinite(Number(r?.location?.longitude)));
    if (!query.trim()) return validReports;

    const q = query.trim().toLowerCase();

    return validReports.filter((r) => {
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

  const heatPoints = useMemo(() => filteredReports.map((r)=>[
    Number(r.location.latitude),
    Number(r.location.longitude),
    SEVERITY_WEIGHT[r.severity] || 0.4,
  ]), [filteredReports]);

  const center = filteredReports.length?{latitude:Number(filteredReports[0].location.latitude),longitude:Number(filteredReports[0].location.longitude)}:DEFAULT_CENTER;

  const handleSelectReport = (report) => {
    setSelected(report);
  };

  const canDelete = (report) =>
    user && (user.role === "admin" || report.user?._id === user._id || report.user === user._id);

  const handleDelete = async (report, e) => {
    e.stopPropagation();

    if (!window.confirm("Remove this report from the public map? It'll stay in your account records, just hidden from the map.")) {
      return;
    }

    setDeletingId(report._id);

    try {
      await deleteReport(report._id);
      setReports((prev) => prev.filter((r) => r._id !== report._id));
      if (selected?._id === report._id) setSelected(null);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Couldn't delete that report. Try again."
      );
    } finally {
      setDeletingId(null);
    }
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
                    {canDelete(r) && (
                      <>
                        <br />
                        <button
                          type="button"
                          className="popup-delete-btn"
                          disabled={deletingId === r._id}
                          onClick={(e) => handleDelete(r, e)}
                        >
                          <Trash2 size={13} />
                          {deletingId === r._id ? "Removing..." : "Remove from map"}
                        </button>
                      </>
                    )}
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
                ? "No reports have been submitted yet. Be the first \u2014 go to Report Waste!"
                : `No reports match "${query}".`}
            </p>
          )}

          {filteredReports.map((r) => (
            <div key={r._id} className="marker-card-row">
              <button
                type="button"
                className="marker-card"
                onClick={() => handleSelectReport(r)}
              >
                <MapPin size={16} />
                {r.wasteType}
                <span>
                  {r.location.city || r.location.address || "Unknown area"}
                </span>
              </button>

              {canDelete(r) && (
                <button
                  type="button"
                  className="marker-delete-btn"
                  title="Delete this report"
                  disabled={deletingId === r._id}
                  onClick={(e) => handleDelete(r, e)}
                >
                  {deletingId === r._id ? (
                    <Loader2 size={15} className="spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default LiveMap;
    
