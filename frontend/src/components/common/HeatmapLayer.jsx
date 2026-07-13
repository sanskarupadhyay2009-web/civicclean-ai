import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

function HeatmapLayer({ points = [] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heatLayer = L.heatLayer(points, {
      radius: 30,
      blur: 25,
      maxZoom: 17,
      gradient: {
        0.2: "#065f46",
        0.4: "#10B981",
        0.6: "#34D399",
        0.8: "#FBBF24",
        1.0: "#EF4444",
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export default HeatmapLayer;
