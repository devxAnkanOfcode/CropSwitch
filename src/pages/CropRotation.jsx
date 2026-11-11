import { useEffect, useState } from "react";
import {
  Sprout,
  Plus,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  Leaf,
  MapPin,
  X,
} from "lucide-react";

const FIELD_STORAGE_KEY = "cropswitch-fields";
const ROTATION_STORAGE_KEY = "cropswitch-rotations";

const emptyForm = {
  fieldId: "",
  crop: "",
  plantingDate: "",
  harvestDate: "",
  status: "Planned",
  notes: "",
};

function readStorage(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;

  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      date,
      dateKey: formatDateKey(date),
      isCurrentMonth: date.getMonth() === month,
      isToday: formatDateKey(date) === formatDateKey(new Date()),
    };
  });
}

function CropRotation() {
  const [fields] = useState(() => readStorage(FIELD_STORAGE_KEY));

  const [rotations, setRotations] = useState(() =>
    readStorage(ROTATION_STORAGE_KEY),
  );

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedField, setSelectedField] = useState("all");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  useEffect(() => {
    try {
      localStorage.setItem(ROTATION_STORAGE_KEY, JSON.stringify(rotations));
    } catch (error) {
      console.error("Unable to save crop rotation data:", error);
    }
  }, [rotations]);

  const completedCount = rotations.filter(
    (item) => item.status === "Completed",
  ).length;

  const plannedCount = rotations.filter(
    (item) => item.status === "Planned",
  ).length;

  const displayedRotations = rotations
    .filter((item) =>
      selectedField === "all" ? true : item.fieldId === selectedField,
    )
    .sort((a, b) => new Date(b.plantingDate) - new Date(a.plantingDate));

  const calendarDays = getCalendarDays(calendarMonth);

  const changeCalendarMonth = (amount) => {
    setCalendarMonth(
      (previous) =>
        new Date(previous.getFullYear(), previous.getMonth() + amount, 1),
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.fieldId || !form.crop.trim() || !form.plantingDate) {
      setError("Please select a field, crop and planting date.");
      return;
    }

    if (form.harvestDate && form.harvestDate < form.plantingDate) {
      setError("Harvest date cannot be earlier than planting date.");
      return;
    }

    const record = {
      ...form,
      crop: form.crop.trim(),
      id: editingId || crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setRotations((previous) =>
        previous.map((item) => (item.id === editingId ? record : item)),
      );
    } else {
      setRotations((previous) => [...previous, record]);
    }

    resetForm();
  };

  const editRotation = (item) => {
    setForm({
      fieldId: item.fieldId,
      crop: item.crop,
      plantingDate: item.plantingDate,
      harvestDate: item.harvestDate || "",
      status: item.status,
      notes: item.notes || "",
    });

    setEditingId(item.id);
    setShowForm(true);
    setError("");
  };

  const deleteRotation = (id) => {
    if (!window.confirm("Delete this crop rotation record?")) return;

    setRotations((previous) => previous.filter((item) => item.id !== id));
  };

  const getField = (id) => fields.find((field) => field.id === id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="text-forest-700" size={26} />
            <h1 className="text-2xl font-bold text-ink">Crop Rotation</h1>
          </div>

          <p className="mt-2 text-sm text-muted">
            Manage crop history and plan upcoming cultivation cycles.
          </p>
        </div>

        <button
          onClick={() => {
            setForm({
              ...emptyForm,
              fieldId: fields[0]?.id || "",
            });
            setEditingId(null);
            setError("");
            setShowForm(true);
          }}
          disabled={fields.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          Add Crop Record
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Total Records</p>
            <Leaf className="text-forest-700" size={21} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-ink">
            {rotations.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Completed Cycles</p>
            <Sprout className="text-green-600" size={21} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-ink">{completedCount}</h2>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Planned Crops</p>
            <CalendarDays className="text-blue-600" size={21} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-ink">{plannedCount}</h2>
        </div>
      </div>

      {/* Crop Rotation Calendar */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-ink">Crop Calendar</h2>
            <p className="mt-1 text-xs text-muted">
              Track planting and harvest schedules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => changeCalendarMonth(-1)}
              className="rounded-lg border border-border p-2 hover:bg-canvas"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            <h3 className="min-w-36 text-center font-semibold text-ink">
              {calendarMonth.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </h3>

            <button
              onClick={() => changeCalendarMonth(1)}
              className="rounded-lg border border-border p-2 hover:bg-canvas"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold text-muted"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day) => {
            const dayRecords = displayedRotations.filter(
              (item) =>
                item.plantingDate === day.dateKey ||
                item.harvestDate === day.dateKey,
            );

            return (
              <div
                key={day.dateKey}
                className={`min-h-20 rounded-lg border p-2 ${
                  day.isCurrentMonth
                    ? "border-border bg-white"
                    : "border-transparent bg-canvas opacity-50"
                } ${day.isToday ? "ring-2 ring-leaf-500" : ""}`}
              >
                <span className="text-xs font-medium text-ink">
                  {day.date.getDate()}
                </span>

                <div className="mt-1 space-y-1">
                  {dayRecords.map((item) => {
                    const isPlanting = item.plantingDate === day.dateKey;

                    return (
                      <div
                        key={`${item.id}-${day.dateKey}`}
                        title={`${item.crop} - ${isPlanting ? "Planting" : "Harvest"}`}
                        className={`truncate rounded px-1 py-1 text-[10px] font-medium ${
                          isPlanting
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {isPlanting ? "Plant: " : "Harvest: "}
                        {item.crop}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Planting date
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Harvest date
          </span>
        </div>
      </div>

      {/* Field Filter */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-ink">Cultivation History</h2>
            <p className="mt-1 text-xs text-muted">
              View crop records for your registered fields.
            </p>
          </div>

          <select
            value={selectedField}
            onChange={(event) => setSelectedField(event.target.value)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-forest-700"
          >
            <option value="all">All Fields</option>

            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
        </div>

        {/* Empty Fields */}
        {fields.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-canvas p-8 text-center">
            <MapPin className="mx-auto text-muted" size={32} />
            <h3 className="mt-3 font-semibold text-ink">
              No registered fields found
            </h3>
            <p className="mt-2 text-sm text-muted">
              Register a field in Field Management before adding crop rotation
              records.
            </p>
          </div>
        )}

        {/* Empty Records */}
        {fields.length > 0 && displayedRotations.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-canvas p-8 text-center">
            <Sprout className="mx-auto text-forest-700" size={34} />

            <h3 className="mt-3 font-semibold text-ink">No crop records yet</h3>

            <p className="mt-2 text-sm text-muted">
              Start recording cultivation history for your fields.
            </p>
          </div>
        )}

        {/* Rotation Records */}
        <div className="mt-5 space-y-3">
          {displayedRotations.map((item) => {
            const field = getField(item.fieldId);

            return (
              <div
                key={item.id}
                className="rounded-xl border border-border p-4 transition hover:border-leaf-400"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-leaf-100 p-3">
                      <Sprout className="text-forest-800" size={22} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-ink">{item.crop}</h3>

                      <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                        <MapPin size={13} />
                        {field?.name || "Field no longer available"}
                      </p>

                      <p className="mt-2 text-xs text-muted">
                        Planting: {item.plantingDate}
                        {" • "}
                        Harvest: {item.harvestDate || "Not specified"}
                      </p>

                      {item.notes && (
                        <p className="mt-2 text-xs text-muted">{item.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.status}
                    </span>

                    <button
                      onClick={() => editRotation(item)}
                      aria-label="Edit crop record"
                      className="rounded-lg p-2 text-muted hover:bg-leaf-100 hover:text-forest-800"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => deleteRotation(item.id)}
                      aria-label="Delete crop record"
                      className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-semibold text-ink">
                {editingId ? "Edit Crop Record" : "Add Crop Record"}
              </h2>
              <p className="mt-1 text-xs text-muted">
                Enter the cultivation details below.
              </p>
            </div>

            <button
              onClick={resetForm}
              aria-label="Close form"
              className="rounded-lg p-2 text-muted hover:bg-canvas"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-ink">
                Select Field *
                <select
                  name="fieldId"
                  value={form.fieldId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-white px-3 py-3 outline-none focus:border-forest-700"
                >
                  <option value="">Choose a field</option>

                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-ink">
                Crop Name *
                <input
                  name="crop"
                  value={form.crop}
                  onChange={handleChange}
                  placeholder="e.g. Rice, Wheat, Maize"
                  required
                  className="w-full rounded-lg border border-border px-3 py-3 outline-none focus:border-forest-700"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-ink">
                Planting Date *
                <input
                  type="date"
                  name="plantingDate"
                  value={form.plantingDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border px-3 py-3 outline-none focus:border-forest-700"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-ink">
                Harvest Date
                <input
                  type="date"
                  name="harvestDate"
                  value={form.harvestDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-3 outline-none focus:border-forest-700"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-ink">
                Crop Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-3 outline-none focus:border-forest-700"
                >
                  <option value="Planned">Planned</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-ink">
                Notes
                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Optional notes"
                  className="w-full rounded-lg border border-border px-3 py-3 outline-none focus:border-forest-700"
                />
              </label>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted hover:bg-canvas"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-900"
              >
                {editingId ? "Save Changes" : "Save Crop Record"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CropRotation;
