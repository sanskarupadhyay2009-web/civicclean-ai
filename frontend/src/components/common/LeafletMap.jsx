import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import HeatmapLayer from "./HeatmapLayer";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LeafletMap({
  latitude,
  longitude,
  zoom = 15,
  height = 280,
  markers = [],
  heatPoints = [],
  scrollWheelZoom = true,
}) {
  return (
    <div style={{ height, width: "100%", borderRadius: "14px", overflow: "hidden" }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((m, i) => (
          <Marker key={i} position={[m.latitude, m.longitude]}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}

        {heatPoints.length > 0 && <HeatmapLayer points={heatPoints} />}
      </MapContainer>
    </div>
  );
}

export default LeafletMap;
