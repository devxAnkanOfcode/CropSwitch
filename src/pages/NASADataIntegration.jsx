import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Satellite,
  MapPin,
  CalendarDays,
  Layers,
  Sprout,
  Ruler,
  ExternalLink,
  Map,
} from "lucide-react";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

const STORAGE_KEY = "cropswitch-fields";

const NASA_ATTRIBUTION =
  'Imagery provided by <a href="https://earthdata.nasa.gov" target="_blank" rel="noreferrer">NASA GIBS</a>';

function getSavedFields() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Unable to load saved fields:", error);
    return [];
  }
}

function getYesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function NASADataIntegration() {
  const [fields, setFields] = useState(getSavedFields);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [observationDate, setObservationDate] = useState(getYesterday);
  const [mapMode, setMapMode] = useState("street");

  useEffect(() => {
    const updateFields = () => {
      setFields(getSavedFields());
    };

    window.addEventListener("storage", updateFields);

    return () => {
      window.removeEventListener("storage", updateFields);
    };
  }, []);

  const selectedField =
    fields.find((field) => field.id === selectedFieldId) || fields[0] || null;

  const latitude = Number(selectedField?.latitude);
  const longitude = Number(selectedField?.longitude);

  const hasValidCoordinates =
    selectedField?.latitude !== "" &&
    selectedField?.longitude !== "" &&
    selectedField?.latitude != null &&
    selectedField?.longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  const maxDate = getYesterday();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-forest-700 font-medium mb-2">
          <Satellite size={18} />
          Earth Observation
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          NASA Data Integration
        </h1>

        <p className="text-gray-500 mt-2">
          Explore satellite imagery and environmental data for agricultural
          field monitoring.
        </p>
      </div>

      {/* Integration Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Satellite className="text-blue-600 shrink-0 mt-1" size={20} />

        <div>
          <h3 className="font-semibold text-blue-800">
            NASA GIBS imagery layer configured
          </h3>

          <p className="text-sm text-blue-700 mt-1">
            Satellite imagery is requested directly from NASA GIBS. Image
            availability depends on the selected date and layer.
          </p>
        </div>
      </div>

      {/* Main Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Field Selection */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-forest-700" size={20} />

            <h2 className="font-semibold text-gray-800">Select Field</h2>
          </div>

          <p className="text-sm text-gray-500">
            Choose a registered agricultural field.
          </p>

          {fields.length > 0 ? (
            <select
              value={selectedField?.id || ""}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              className="w-full mt-4 border border-gray-200 rounded-lg p-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-forest-700"
            >
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                No registered fields found.
              </p>

              <Link
                to="/fields"
                className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-forest-700 hover:underline"
              >
                Register a field
                <ExternalLink size={15} />
              </Link>
            </div>
          )}
        </div>

        {/* Observation Date */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="text-forest-700" size={20} />

            <h2 className="font-semibold text-gray-800">Observation Date</h2>
          </div>

          <p className="text-sm text-gray-500">
            Choose a date for the satellite imagery.
          </p>

          <input
            type="date"
            value={observationDate}
            max={maxDate}
            onChange={(e) => setObservationDate(e.target.value)}
            className="w-full mt-4 border border-gray-200 rounded-lg p-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-forest-700"
          />

          <p className="text-xs text-gray-400 mt-2">
            Imagery may not be available for every date.
          </p>
        </div>
      </div>

      {/* Selected Field Details */}
      {selectedField && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-800 mb-4">
            Selected Field Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin size={16} />
                Field Name
              </div>

              <p className="font-semibold text-gray-800 mt-2">
                {selectedField.name || "Not available"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin size={16} />
                Location
              </div>

              <p className="font-semibold text-gray-800 mt-2">
                {selectedField.location || "Not available"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Sprout size={16} />
                Crop
              </div>

              <p className="font-semibold text-gray-800 mt-2">
                {selectedField.crop || "Not specified"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Ruler size={16} />
                Area
              </div>

              <p className="font-semibold text-gray-800 mt-2">
                {selectedField.area
                  ? `${selectedField.area} hectares`
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Satellite Map */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="text-forest-700" size={20} />

              <h2 className="font-semibold text-gray-800">Satellite Imagery</h2>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Explore the selected field using NASA satellite imagery.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMapMode("street")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                mapMode === "street"
                  ? "bg-forest-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Map size={16} />
              Street
            </button>

            <button
              onClick={() => setMapMode("nasa")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                mapMode === "nasa"
                  ? "bg-forest-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Satellite size={16} />
              NASA
            </button>
          </div>
        </div>

        {selectedField && hasValidCoordinates ? (
          <>
            <MapContainer
              key={selectedField.id}
              center={[latitude, longitude]}
              zoom={7}
              minZoom={2}
              maxZoom={9}
              scrollWheelZoom={true}
              style={{
                height: "420px",
                width: "100%",
                borderRadius: "12px",
                zIndex: 0,
              }}
            >
              {mapMode === "street" ? (
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={19}
                />
              ) : (
                <TileLayer
                  key={observationDate}
                  attribution={NASA_ATTRIBUTION}
                  url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${observationDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
                  maxNativeZoom={9}
                  maxZoom={9}
                />
              )}

              <CircleMarker
                center={[latitude, longitude]}
                radius={9}
                pathOptions={{
                  color: "#ffffff",
                  weight: 3,
                  fillColor: "#16a34a",
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <strong>{selectedField.name}</strong>
                  <br />
                  {selectedField.location}
                  <br />
                  Latitude: {latitude}
                  <br />
                  Longitude: {longitude}
                </Popup>
              </CircleMarker>
            </MapContainer>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 text-xs text-gray-500">
              <p>
                {mapMode === "nasa"
                  ? "Source: NASA GIBS — Terra MODIS True Color"
                  : "Source: OpenStreetMap"}
              </p>

              <p>Observation date: {observationDate}</p>
            </div>

            {mapMode === "nasa" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-amber-800">
                  <strong>Resolution note:</strong> Terra MODIS imagery has a
                  native maximum zoom of level 9 for this layer. It is intended
                  for regional observation, not precise inspection of small
                  field boundaries.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="min-h-[300px] rounded-xl bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-6">
            <Satellite size={48} className="text-gray-400 mb-4" />

            <h3 className="font-semibold text-gray-700">
              {!selectedField
                ? "No field selected"
                : "Valid coordinates required"}
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-md">
              {!selectedField
                ? "Register and select a field to begin satellite monitoring."
                : "This field does not have valid latitude and longitude. Update its coordinates in Field Management."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NASADataIntegration;
