
import { useState } from "react";
import {
  FileText,
  Download,
  MapPin,
  Sprout,
  CalendarDays,
  FileSpreadsheet,
} from "lucide-react";

function readStorage(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function escapeCSV(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCSV(filename, headers, rows) {
  const content = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function Reports() {
  const [fields] = useState(() => readStorage("cropswitch-fields"));
  const [rotations] = useState(() => readStorage("cropswitch-rotations"));

  const completedCount = rotations.filter(
    (item) => item.status === "Completed"
  ).length;

  const plannedCount = rotations.filter(
    (item) => item.status === "Planned"
  ).length;

  const downloadFieldReport = () => {
    const headers = [
      "Field Name",
      "Location",
      "Area",
      "Current Crop",
      "Latitude",
      "Longitude",
    ];

    const rows = fields.map((field) => [
      field.name,
      field.location,
      field.area,
      field.crop,
      field.latitude,
      field.longitude,
    ]);

    downloadCSV("CropSwitch_Field_Report.csv", headers, rows);
  };

  const downloadRotationReport = () => {
    const headers = [
      "Field Name",
      "Crop",
      "Planting Date",
      "Harvest Date",
      "Status",
      "Notes",
    ];

    const rows = rotations.map((item) => {
      const field = fields.find(
        (field) => field.id === item.fieldId
      );

      return [
        field?.name || "Field unavailable",
        item.crop,
        item.plantingDate,
        item.harvestDate || "Not specified",
        item.status,
        item.notes,
      ];
    });

    downloadCSV("CropSwitch_Crop_Rotation_Report.csv", headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <FileText className="text-forest-700" size={26} />
          <h1 className="text-2xl font-bold text-ink">Reports</h1>
        </div>

        <p className="mt-2 text-sm text-muted">
          View agricultural records and export your reports.
        </p>
      </div>

      {/* Data Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-900">
          Report data source
        </p>
        <p className="mt-1 text-xs leading-5 text-blue-800">
          Reports are generated from field and crop rotation records
          saved in this browser. They do not represent verified
          NASA measurements or live backend data.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Registered Fields</p>
            <MapPin className="text-forest-700" size={21} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-ink">
            {fields.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Crop Records</p>
            <Sprout className="text-forest-700" size={21} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-ink">
            {rotations.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Completed Cycles</p>
            <CalendarDays className="text-green-600" size={21} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-ink">
            {completedCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Planned Cycles</p>
            <CalendarDays className="text-blue-600" size={21} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-ink">
            {plannedCount}
          </h2>
        </div>
      </div>

      {/* Report Downloads */}
      <div>
        <h2 className="font-semibold text-ink">Available Reports</h2>
        <p className="mt-1 text-xs text-muted">
          Download your records as CSV spreadsheets.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {/* Field Report */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-leaf-100 p-3">
                <MapPin className="text-forest-800" size={23} />
              </div>

              <div>
                <h3 className="font-semibold text-ink">
                  Field Management Report
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Field names, locations, area, crops and coordinates.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted">
                {fields.length} field records
              </span>

              <button
                onClick={downloadFieldReport}
                disabled={fields.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-forest-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={15} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Rotation Report */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-leaf-100 p-3">
                <Sprout className="text-forest-800" size={23} />
              </div>

              <div>
                <h3 className="font-semibold text-ink">
                  Crop Rotation Report
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Crop names, associated fields, planting and harvest dates.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted">
                {rotations.length} crop records
              </span>

              <button
                onClick={downloadRotationReport}
                disabled={rotations.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-forest-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={15} />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Information */}
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5">
        <FileSpreadsheet className="mt-1 text-forest-700" size={22} />
        <div>
          <h3 className="text-sm font-semibold text-ink">
            About CSV exports
          </h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            Downloaded CSV files can be opened using Microsoft Excel,
            Google Sheets or other spreadsheet applications.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Reports;
