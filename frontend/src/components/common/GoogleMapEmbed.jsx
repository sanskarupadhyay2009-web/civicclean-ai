/**
 * Lightweight Google Maps embed using the Maps Embed API (just an iframe,
 * no JS SDK/loader needed). Requires VITE_GOOGLE_MAPS_API_KEY to be set
 * as an environment variable in Vercel.
 */
function GoogleMapEmbed({ latitude, longitude, zoom = 16, height = 260 }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="map-embed-missing" style={{ height }}>
        Google Maps API key is not configured. Add
        VITE_GOOGLE_MAPS_API_KEY in your Vercel environment variables.
      </div>
    );
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=${zoom}`;

  return (
    <iframe
      title="Location map"
      src={src}
      width="100%"
      height={height}
      style={{ border: 0, borderRadius: "14px" }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

export default GoogleMapEmbed;
