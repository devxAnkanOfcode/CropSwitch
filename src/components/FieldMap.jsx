import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Map, Satellite } from "lucide-react";

// Fix default marker icons in Vite
const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FieldMap({ latitude, longitude, fieldName }) {
  const [mapType, setMapType] = useState("street");

  const position = [Number(latitude), Number(longitude)];

  const isSatellite = mapType === "satellite";

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-border">
      {/* Map */}
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        {isSatellite ? (
          <TileLayer
            key="satellite"
            attribution="Tiles &copy; Esri — Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            key="street"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        <Marker position={position} icon={markerIcon}>
          <Popup>{fieldName}</Popup>
        </Marker>
      </MapContainer>

      {/* Map Layer Switcher */}
      <div className="absolute top-3 right-3 z-[1000] flex gap-1 rounded-lg bg-white p-1 shadow-lg">
        <button
          onClick={() => setMapType("street")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition ${
            !isSatellite
              ? "bg-[#174D35] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Map size={15} />
          Map
        </button>

        <button
          onClick={() => setMapType("satellite")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition ${
            isSatellite
              ? "bg-[#174D35] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Satellite size={15} />
          Satellite
        </button>
      </div>
    </div>
  );
}

export default FieldMap;
