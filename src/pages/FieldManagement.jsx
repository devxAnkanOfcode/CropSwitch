import { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Search,
  Sprout,
  Ruler,
  MapPinned,
  X,
  Trash2,
} from "lucide-react";

import FieldMap from "../components/FieldMap";

const initialForm = {
  name: "",
  location: "",
  area: "",
  crop: "",
  latitude: "",
  longitude: "",
};

function FieldManagement() {
  const [selectedField, setSelectedField] = useState(null);

  const [fields, setFields] = useState(() => {
    try {
      const savedFields = localStorage.getItem("cropswitch-fields");

      if (!savedFields) return [];

      const parsedFields = JSON.parse(savedFields);

      return Array.isArray(parsedFields) ? parsedFields : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cropswitch-fields", JSON.stringify(fields));
    } catch (error) {
      console.error("Unable to save field data:", error);
    }
  }, [fields]);

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const totalArea = fields.reduce(
    (total, field) => total + Number(field.area),
    0,
  );

  const filteredFields = fields.filter((field) =>
    `${field.name} ${field.location} ${field.crop}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    const area = Number(form.area);

    if (
      !form.name.trim() ||
      !form.location.trim() ||
      !form.crop ||
      !form.area ||
      !form.latitude ||
      !form.longitude
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (!Number.isFinite(area) || area <= 0) {
      setError("Enter a valid field area greater than zero.");
      return;
    }

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      setError("Latitude must be between -90 and 90.");
      return;
    }

    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      setError("Longitude must be between -180 and 180.");
      return;
    }

    const newField = {
      id: crypto.randomUUID(),
      ...form,
      name: form.name.trim(),
      location: form.location.trim(),
      area: area.toString(),
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    };

    setFields((previous) => [...previous, newField]);
    setForm(initialForm);
    setShowForm(false);
    setError("");
  };

  const deleteField = (id) => {
    setFields((previous) => previous.filter((field) => field.id !== id));

    setSelectedField((previous) => (previous?.id === id ? null : previous));
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Page introduction */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted">Agricultural workspace</p>

          <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
            Field Management
          </h1>

          <p className="mt-2 text-sm text-muted">
            Register and manage your agricultural fields.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-forest-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-forest-900"
        >
          <Plus size={18} />
          Add New Field
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Registered Fields</p>
            <MapPinned size={21} className="text-forest-700" />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-ink">
            {fields.length.toString().padStart(2, "0")}
          </h2>

          <p className="mt-1 text-xs text-subtle">
            Fields added in this session
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Total Cultivated Area</p>
            <Ruler size={21} className="text-forest-700" />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-ink">
            {totalArea.toFixed(2)}
            <span className="ml-2 text-sm font-medium text-muted">
              hectares
            </span>
          </h2>

          <p className="mt-1 text-xs text-subtle">
            Calculated from registered fields
          </p>
        </div>
      </div>

      {/* Field list */}
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-ink">Registered Fields</h3>

            <p className="mt-1 text-xs text-muted">
              Manage your agricultural field records.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2">
            <Search size={17} className="text-subtle" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search fields..."
              aria-label="Search fields"
              className="w-full min-w-0 bg-transparent text-sm outline-none sm:w-48"
            />
          </div>
        </div>

        {filteredFields.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-100">
              <Sprout size={28} className="text-forest-700" />
            </div>

            <h3 className="mt-4 font-semibold text-ink">
              {fields.length === 0
                ? "No fields registered yet"
                : "No matching fields found"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted">
              {fields.length === 0
                ? "Add your first agricultural field to start building your CropSwitch workspace."
                : "Try another field name, location or crop type."}
            </p>

            {fields.length === 0 && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-forest-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-forest-900"
              >
                <Plus size={17} />
                Register First Field
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredFields.map((field) => (
              <div
                key={field.id}
                className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leaf-100">
                    <Sprout size={22} className="text-forest-700" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate font-semibold text-ink">
                      {field.name}
                    </h4>

                    <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                      <MapPin size={14} />
                      {field.location}
                    </p>

                    <p className="mt-1 text-xs text-subtle">
                      {field.latitude}, {field.longitude}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs text-subtle">Crop</p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {field.crop}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-subtle">Area</p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {field.area} ha
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedField(field)}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-forest-800 hover:bg-leaf-100"
                  >
                    View Details
                  </button>

                  <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                    DEMO / LOCAL
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteField(field.id)}
                    aria-label={`Delete ${field.name}`}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-border bg-canvas px-5 py-3">
          <p className="text-xs text-muted">
            Local session data only. Records are not saved to a database.
          </p>
        </div>
      </div>

      {/* Registration form */}
      {showForm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="field-form-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2
                  id="field-form-title"
                  className="text-lg font-bold text-ink"
                >
                  Register New Field
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Enter the field details and geographic coordinates.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close registration form"
                className="rounded-lg p-2 text-muted hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-ink">
                  Field Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. North Field"
                    className="w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-forest-700"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-ink">
                  Location
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Village, district, country"
                    className="w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-forest-700"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-ink">
                  Area (hectares)
                  <input
                    name="area"
                    type="number"
                    min="0.01"
                    step="any"
                    value={form.area}
                    onChange={handleChange}
                    placeholder="e.g. 2.5"
                    className="w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-forest-700"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-ink">
                  Crop Type
                  <select
                    name="crop"
                    value={form.crop}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2.5 font-normal outline-none focus:border-forest-700"
                  >
                    <option value="">Select crop</option>
                    <option value="Rice">Rice</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Maize">Maize</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>

              <div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-ink">
                    Geographic Coordinates
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    Required for future satellite imagery lookup.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-ink">
                    Latitude
                    <input
                      name="latitude"
                      type="number"
                      min="-90"
                      max="90"
                      step="any"
                      value={form.latitude}
                      onChange={handleChange}
                      placeholder="e.g. 22.5726"
                      className="w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-forest-700"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-ink">
                    Longitude
                    <input
                      name="longitude"
                      type="number"
                      min="-180"
                      max="180"
                      step="any"
                      value={form.longitude}
                      onChange={handleChange}
                      placeholder="e.g. 88.3639"
                      className="w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-forest-700"
                    />
                  </label>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-border pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-900"
                >
                  Register Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Field Details Modal */}
      {selectedField && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedField(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="field-details-title"
            className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <p className="text-xs font-medium text-forest-700">
                  FIELD INFORMATION
                </p>

                <h2
                  id="field-details-title"
                  className="mt-1 text-xl font-bold text-ink"
                >
                  {selectedField.name}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {selectedField.location}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedField(null)}
                aria-label="Close field details"
                className="rounded-lg p-2 text-muted hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Field Information */}
            <div className="space-y-5 p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-canvas p-4">
                  <p className="text-xs text-muted">Crop Type</p>
                  <p className="mt-2 font-semibold text-ink">
                    {selectedField.crop}
                  </p>
                </div>

                <div className="rounded-xl bg-canvas p-4">
                  <p className="text-xs text-muted">Field Area</p>
                  <p className="mt-2 font-semibold text-ink">
                    {selectedField.area} hectares
                  </p>
                </div>
              </div>

              {/* Geographic Coordinates */}
              <div>
                <h3 className="font-semibold text-ink">
                  Geographic Coordinates
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted">Latitude</p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {selectedField.latitude}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted">Longitude</p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {selectedField.longitude}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps?q=${selectedField.latitude},${selectedField.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-forest-800 transition hover:bg-leaf-100"
                >
                  <MapPin size={16} />
                  View Location on Google Maps
                </a>
              </div>

              {/* Satellite Imagery Placeholder */}
              <div>
                <h3 className="font-semibold text-ink">Satellite Imagery</h3>

                {/* Interactive Field Map */}
                <div>
                  <h3 className="mb-3 font-semibold text-ink">
                    Field Location Preview
                  </h3>

                  <FieldMap
                    latitude={selectedField.latitude}
                    longitude={selectedField.longitude}
                    fieldName={selectedField.name}
                  />
                </div>

                <div className="mt-3 flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-canvas p-5 text-center">
                  <MapPinned size={28} className="text-forest-700" />

                  <p className="mt-3 text-sm font-semibold text-ink">
                    Satellite imagery not connected
                  </p>

                  <p className="mt-1 max-w-sm text-xs leading-5 text-muted">
                    Satellite imagery and vegetation monitoring will be
                    available after NASA data integration.
                  </p>

                  <span className="mt-3 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                    COMING SOON
                  </span>
                </div>
              </div>

              <div className="flex justify-end border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedField(null)}
                  className="rounded-lg bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-900"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FieldManagement;
