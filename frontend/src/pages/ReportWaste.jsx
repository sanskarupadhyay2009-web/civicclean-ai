import { motion } from "framer-motion";
import {
  UploadCloud,
  MapPin,
  Sparkles,
  Loader2,
  Radar,
  Crosshair,
  BrainCircuit,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";

import { analyzeReport } from "../services/reportService";
import LeafletMap from "../components/common/LeafletMap";

import "../styles/report.css";

function ReportWaste() {
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [analysis, setAnalysis] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setAnalysis(null);
    setError("");
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    setImageFile(file);
    setAnalysis(null);
    setError("");
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDetectLocation = () => {
  if (!navigator.geolocation) {
    setError("Geolocation is not supported by this browser.");
    return;
  }

  setLocating(true);
  setError("");

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );

        const data = await response.json();

        setLocation({
          latitude: lat,
          longitude: lon,
          address: data.display_name,
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          state: data.address.state || "",
          country: data.address.country || "",
        });
      } catch (err) {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      } finally {
        setLocating(false);
      }
    },
    () => {
      setError("Unable to detect location.");
      setLocating(false);
    }
  );
};

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Please choose an image first.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { data } = await analyzeReport({
        image: imageFile,
        description,
        location,
      });

      setAnalysis(data.analysis);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Something went wrong while analyzing the image. Please try again.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="report-page">
      <motion.div
        className="report-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Report Waste</h1>

        <p>Upload an image and let CivicClean AI detect waste automatically.</p>
      </motion.div>

      {error && <div className="report-error">{error}</div>}

      <motion.div
        className="scan-zone"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="scan-zone-grid" />

        <div className="scan-zone-header">
          <h2>
            <Radar size={20} />
            AI Scanning Zone
          </h2>

          <span>Upload an image to detect cleanliness issues</span>
        </div>

        <div
          className={`scan-dropzone ${isDragging ? "dragging" : ""} ${
            previewUrl ? "has-image" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={handleChooseImage}
        >
          <div className="scan-line" />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {previewUrl ? (
            <img src={previewUrl} alt="Selected preview" className="scan-preview-image" />
          ) : (
            <>
              <UploadCloud size={48} />

              <p className="scan-dropzone-title">
                Drag &amp; drop an image here
                <br />
                <span>or click to upload</span>
              </p>
            </>
          )}
        </div>

        <p className="scan-caption">JPG, PNG, WEBP up to 10MB</p>

        <div className="scan-features">
          <div className="scan-feature">
            <Crosshair size={18} />
            <div>
              <strong>Laser Scanning</strong>
              <span>High Precision</span>
            </div>
          </div>

          <div className="scan-feature">
            <BrainCircuit size={18} />
            <div>
              <strong>AI Analysis</strong>
              <span>Deep Learning</span>
            </div>
          </div>

          <div className="scan-feature">
            <Zap size={18} />
            <div>
              <strong>Instant Results</strong>
              <span>Real-time Insights</span>
            </div>
          </div>
        </div>

        <textarea
          className="report-description"
          placeholder="Optional: describe what you're reporting..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!imageFile || submitting}
          className="analyze-btn"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="spin" /> Analyzing...
            </>
          ) : (
            "Analyze with AI"
          )}
        </button>
      </motion.div>

      <motion.div
        className="glass-card analysis-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>
          <Sparkles size={22} />
          AI Analysis
        </h2>

        <div className="analysis-grid">
          <div>
            <span>Waste Type</span>
            <strong>{analysis?.wasteType || "--"}</strong>
          </div>

          <div>
            <span>Category</span>
            <strong>{analysis?.category || "--"}</strong>
          </div>

          <div>
            <span>Severity</span>
            <strong>{analysis?.severity || "--"}</strong>
          </div>

          <div>
            <span>Confidence</span>
            <strong>
              {analysis?.confidence != null ? `${analysis.confidence}%` : "--"}
            </strong>
          </div>
        </div>

        <div className="analysis-recommendation-box">
          <span className="recommendation-label">Recommendation</span>
          <p className="analysis-recommendation">
            {analysis?.recommendation || "Run an analysis to see a recommendation here."}
          </p>
        </div>
      </motion.div>

      <motion.div
        className="glass-card location-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>
          <MapPin size={22} />
          Location
        </h2>

        {location ? (
  <>
    <p>
      <strong>📍 {location.address || "Current Location"}</strong>
    </p>

    <p>
      {location.city}
      {location.city && location.state ? ", " : ""}
      {location.state}
      {location.country ? `, ${location.country}` : ""}
    </p>

    <small>
      Latitude: {location.latitude.toFixed(5)}
      <br />
      Longitude: {location.longitude.toFixed(5)}
    </small>

    <LeafletMap
      latitude={location.latitude}
      longitude={location.longitude}
      zoom={17}
      height={280}
      markers={[
        {
          latitude: location.latitude,
          longitude: location.longitude,
          label: "Reported location",
        },
      ]}
    />

    <a
      href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=17/${location.latitude}/${location.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      className="maps-btn"
    >
      Open in OpenStreetMap
    </a>
  </>
) : (
  <p>No location detected yet.</p>
)}

        <button type="button" onClick={handleDetectLocation} disabled={locating}>
          {locating ? "Detecting..." : "Detect Current Location"}
        </button>
      </motion.div>
    </main>
  );
}

export default ReportWaste;
        
