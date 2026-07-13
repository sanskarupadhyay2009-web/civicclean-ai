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
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_CENTER = {
  latitude: 26.8467,
  longitude: 80.9462,
};

const SEVERITY_WEIGHT = {
  High: 1,
  Medium: 0.6,
  Low: 0.3,
};

function FlyToController({ target }) {
  const map = useMap();

  useEffect(() => {
    if (!target?.location) return;

    map.flyTo(
      [target.location.latitude, target.location.longitude],
      16,
      {
        duration: 1.2,
      }
    );
  }, [map, target]);

  return null;
}

function LiveMap() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
