
import { useEffect, useState } from "react";

import {
  MapPinned,
  Satellite,
  Sprout,
  AlertTriangle,
  ArrowUpRight,
  Ruler,
  MapPin,
  ExternalLink,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  dashboardStats,
  dashboardActivity,
  DATA_STATUS,
} from "../data/dashboardData";

const statIcons = {
  fields: MapPinned,
  "nasa-datasets": Satellite,
  "crop-strategies": Sprout,
  "risk-alerts": AlertTriangle,
};

const statusLabels = {
  [DATA_STATUS.DEMO]: "DEMO DATA",
  [DATA_STATUS.VERIFIED]: "VERIFIED",
  [DATA_STATUS.CALCULATED]: "CALCULATED",
  [DATA_STATUS.RECOMMENDATION]: "RECOMMENDATION",
};

// Read registered fields from the existing LocalStorage key
function getSavedFields() {
  try {
    const savedFields = localStorage.getItem("cropswitch-fields");

    if (!savedFields) return [];

    const parsedFields = JSON.parse(savedFields);

    return Array.isArray(parsedFields) ? parsedFields : [];
  } catch (error) {
    console.error("Unable to read field data:", error);
    return [];
  }
}

function Dashboard() {
  const [fields, setFields] = useState(getSavedFields);

  // Refresh when LocalStorage changes in another browser tab
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "cropswitch-fields") {
        setFields(getSavedFields());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Calculate actual field statistics
  const totalArea = fields.reduce(
    (total, field) => total + (Number(field.area) || 0),
    0
  );

  // Calculate crop distribution
  const cropDistribution = fields.reduce((distribution, field) => {
    const crop = field.crop || "Unknown";
    distribution[crop] = (distribution[crop] || 0) + 1;
    return distribution;
  }, {});

  // Most recently added fields based on saved array order
 

  return (
    <div className="space-y-8">

      {/* Dashboard introduction */}
      <div>
        <p className="text-sm text-gray-500">
          Welcome to CropSwitch
        </p>

        <h1 className="text-3xl font-bold text-gray-900 mt-1">
          Agricultural Overview
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor your fields, environmental conditions and crop strategies.
        </p>
      </div>

      {/* Dashboard metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {dashboardStats.map((stat) => {
          const Icon = statIcons[stat.id] || Sprout;

          const isFieldStat = stat.id === "fields";

          const value = isFieldStat ? fields.length : stat.value;

          const status = isFieldStat
            ? DATA_STATUS.CALCULATED
            : stat.status;

          const description = isFieldStat
            ? "Registered agricultural fields"
            : stat.description;

          return (
            <div
              key={stat.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {isFieldStat ? "Registered Fields" : stat.title}
                </p>

                <div className="p-3 bg-green-50 rounded-xl">
                  <Icon size={21} className="text-green-700" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mt-5">
                {value.toString().padStart(2, "0")}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                {description}
              </p>

              <div className="mt-4">
                <span className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200 px-2 py-1 text-[10px] font-semibold tracking-wide text-amber-700">
                  {statusLabels[status] || "UNKNOWN STATUS"}
                </span>
              </div>
            </div>
          );
        })}

        {/* Total cultivated area */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Total Cultivated Area
            </p>

            <div className="p-3 bg-green-50 rounded-xl">
              <Ruler size={21} className="text-green-700" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-5">
            {totalArea.toFixed(2)}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Total area in hectares
          </p>

          <div className="mt-4">
            <span className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200 px-2 py-1 text-[10px] font-semibold tracking-wide text-amber-700">
              CALCULATED
            </span>
          </div>
        </div>

      </div>

      {/* Crop distribution */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              Crop Distribution
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Crops across your registered fields.
            </p>
          </div>

          <Sprout size={22} className="text-green-700" />
        </div>

        {Object.keys(cropDistribution).length === 0 ? (
          <div className="py-8 text-center">
            <Sprout size={30} className="mx-auto text-gray-300" />

            <p className="text-sm text-gray-500 mt-3">
              No crop records available yet.
            </p>

            <Link
              to="/fields"
              className="text-sm font-medium text-green-800 hover:underline mt-2 inline-block"
            >
              Register a field
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(cropDistribution).map(([crop, count]) => (
              <div
                key={crop}
                className="rounded-xl border border-gray-100 bg-[#F7F9F6] p-4"
              >
                <p className="text-sm text-gray-500">{crop}</p>

                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {count}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {count === 1 ? "Field" : "Fields"}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Calculated from locally registered field records.
        </p>
      </div>

      {/* Field monitoring and activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Field Monitoring */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">

          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                Field Monitoring
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Your registered agricultural field locations.
              </p>
            </div>

            <span className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200 px-2 py-1 text-[10px] font-semibold tracking-wide text-amber-700">
              LOCAL RECORDS
            </span>
          </div>

          {fields.length === 0 ? (
            <div className="mt-6 min-h-56 rounded-xl border border-gray-200 bg-[#F7F9F6] flex flex-col items-center justify-center text-center p-6">

              <MapPinned size={35} className="text-green-700" />

              <h4 className="font-semibold text-gray-800 mt-4">
                No registered fields
              </h4>

              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                Register agricultural fields to view their locations and details here.
              </p>

              <Link
                to="/fields"
                className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-[#245238] text-white text-sm font-medium hover:bg-[#173B2A] transition-colors"
              >
                Manage Fields
                <ArrowUpRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#F7F9F6] p-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="rounded-lg bg-green-100 p-2">
                      <MapPin size={19} className="text-green-800" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {field.name}
                      </h4>

                      <p className="text-xs text-gray-500 mt-1">
                        {field.location}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {field.crop} · {field.area} hectares
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${field.latitude},${field.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium text-green-800 hover:underline shrink-0"
                  >
                    View Location
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}

              <Link
                to="/fields"
                className="inline-flex items-center gap-2 text-sm font-medium text-green-800 hover:underline mt-2"
              >
                Manage All Fields
                <ArrowUpRight size={16} />
              </Link>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            Coordinates are user-entered records. Verified field boundaries and satellite analysis are not yet connected.
          </p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 text-lg">
            Recent Activity
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Latest project updates.
          </p>

          <div className="mt-6 space-y-5">
            {dashboardActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />

                <div>
                  <p className="text-sm text-gray-600">
                    {activity.message}
                  </p>

                  <span className="text-[10px] font-semibold tracking-wide text-amber-700 mt-1 inline-block">
                    {statusLabels[activity.status] || "UNKNOWN STATUS"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-5">
            Illustrative project activity. Not a live event log.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
