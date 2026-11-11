
import { useState } from "react";
import {
  Lightbulb,
  Sprout,
  Droplets,
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
} from "lucide-react";

const recommendations = [
  {
    id: 1,
    category: "Irrigation",
    priority: "High",
    title: "Review irrigation requirements",
    description:
      "Check current soil moisture and crop water requirements before scheduling the next irrigation cycle.",
    action: "Review water needs",
    icon: Droplets,
  },
  {
    id: 2,
    category: "Weather",
    priority: "Medium",
    title: "Check upcoming weather conditions",
    description:
      "Review the local forecast before planning irrigation, fertilizer application or field operations.",
    action: "Check weather",
    icon: CloudSun,
  },
  {
    id: 3,
    category: "Crop Health",
    priority: "High",
    title: "Inspect crops for early signs of stress",
    description:
      "Inspect leaves, stems and soil conditions regularly to identify possible crop health issues early.",
    action: "Inspect crops",
    icon: ShieldCheck,
  },
  {
    id: 4,
    category: "Crop Planning",
    priority: "Low",
    title: "Review your next cultivation cycle",
    description:
      "Review previous crop records and field conditions before planning your next cultivation cycle.",
    action: "Review crop history",
    icon: Sprout,
  },
];

function readFields() {
  try {
    const data = JSON.parse(
      localStorage.getItem("cropswitch-fields") || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function Recommendations() {
  const [fields] = useState(readFields);
  const [selectedField, setSelectedField] = useState("all");
  const [reviewed, setReviewed] = useState([]);

  const toggleReviewed = (id) => {
    setReviewed((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const pendingCount = recommendations.length - reviewed.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="text-forest-700" size={26} />
            <h1 className="text-2xl font-bold text-ink">
              Recommendations
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted">
            Practical suggestions to help manage your agricultural activities.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white px-4 py-3">
          <p className="text-xs text-muted">Pending reviews</p>
          <p className="mt-1 text-2xl font-bold text-forest-800">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <AlertTriangle className="mt-0.5 shrink-0 text-blue-700" size={19} />
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Demonstration recommendations
          </p>
          <p className="mt-1 text-xs leading-5 text-blue-800">
            These are general sample suggestions for the frontend demo.
            They are not generated from live NASA data or a connected AI model.
          </p>
        </div>
      </div>

      {/* Field Filter */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-ink">Field Overview</h2>
            <p className="mt-1 text-xs text-muted">
              Select a registered field to organize your review.
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

        {fields.length === 0 && (
          <p className="mt-4 rounded-lg bg-canvas p-3 text-sm text-muted">
            No registered fields found. Add fields in Field Management to
            organize your agricultural records.
          </p>
        )}

        {selectedField !== "all" && (
          <p className="mt-3 flex items-center gap-2 text-xs text-muted">
            <MapPin size={14} />
            Selected field:{" "}
            {fields.find((field) => field.id === selectedField)?.name}
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-muted">Total Suggestions</p>
          <p className="mt-2 text-3xl font-bold text-ink">
            {recommendations.length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-muted">High Priority</p>
          <p className="mt-2 text-3xl font-bold text-status-danger">
            {recommendations.filter((item) => item.priority === "High").length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-muted">Reviewed</p>
          <p className="mt-2 text-3xl font-bold text-status-success">
            {reviewed.length}
          </p>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div>
        <div className="mb-4">
          <h2 className="font-semibold text-ink">Suggested Actions</h2>
          <p className="mt-1 text-xs text-muted">
            Review each suggestion and mark it when completed.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {recommendations.map((item) => {
            const Icon = item.icon;
            const isReviewed = reviewed.includes(item.id);

            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-5 transition ${
                  isReviewed
                    ? "border-green-200"
                    : "border-border hover:border-leaf-400"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-leaf-100 p-3">
                      <Icon className="text-forest-800" size={22} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted">
                        {item.category}
                      </p>
                      <h3 className="mt-1 font-semibold text-ink">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      item.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : item.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="text-xs font-medium text-muted">
                    {item.action}
                  </span>

                  <button
                    onClick={() => toggleReviewed(item.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      isReviewed
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-forest-800 text-white hover:bg-forest-900"
                    }`}
                  >
                    <CheckCircle2 size={15} />
                    {isReviewed ? "Reviewed" : "Mark Reviewed"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
