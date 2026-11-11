
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Droplets,
  ThermometerSun,
  Wind,
  Info,
  MapPin,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const STORAGE_KEY = "cropswitch-fields";

// Clearly illustrative scores, not actual risk calculations.
const demoRiskPatterns = [
  { score: 82, risk: "High", factor: "Excess rainfall (Demo)" },
  { score: 68, risk: "Medium", factor: "Temperature variation (Demo)" },
  { score: 91, risk: "High", factor: "Water stress (Demo)" },
  { score: 28, risk: "Low", factor: "No major concern (Demo)" },
  { score: 74, risk: "High", factor: "Possible flooding (Demo)" },
  { score: 54, risk: "Medium", factor: "Temperature variation (Demo)" },
];

const riskColors = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#22C55E",
};

function getSavedFields() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to read registered fields:", error);
    return [];
  }
}

function RiskAnalysis() {
  const [fields, setFields] = useState(getSavedFields);

  // Refresh if LocalStorage changes in another browser tab.
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        setFields(getSavedFields());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Connect real registered field details to illustrative risk records.
  const riskFields = fields.map((field, index) => {
    const demo = demoRiskPatterns[index % demoRiskPatterns.length];

    return {
      ...field,
      demoScore: demo.score,
      demoRisk: demo.risk,
      demoFactor: demo.factor,
    };
  });

  // Calculate risk counts dynamically.
  const highRisk = riskFields.filter(
    (field) => field.demoRisk === "High"
  ).length;

  const mediumRisk = riskFields.filter(
    (field) => field.demoRisk === "Medium"
  ).length;

  const lowRisk = riskFields.filter(
    (field) => field.demoRisk === "Low"
  ).length;

  const riskDistribution = [
    { name: "High Risk", value: highRisk, color: riskColors.High },
    { name: "Medium Risk", value: mediumRisk, color: riskColors.Medium },
    { name: "Low Risk", value: lowRisk, color: riskColors.Low },
  ];

  const riskStats = [
    {
      title: "Registered Fields",
      value: fields.length,
      description: "Fields from Field Management",
      icon: Activity,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "High Risk",
      value: highRisk,
      description: "Illustrative high-risk records",
      icon: ShieldAlert,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Medium Risk",
      value: mediumRisk,
      description: "Illustrative medium-risk records",
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Low Risk",
      value: lowRisk,
      description: "Illustrative low-risk records",
      icon: ShieldCheck,
      color: "bg-green-50 text-green-600",
    },
  ];

  const getRiskStyle = (risk) => {
    switch (risk) {
      case "High":
        return "bg-red-50 text-red-700";
      case "Medium":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-green-50 text-green-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">
              Risk Analysis
            </h1>

            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
              DEMO
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Monitor agricultural risks and identify potential field-level concerns.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600">
          <Activity size={17} className="text-forest-700" />
          Sample Risk Overview
        </div>
      </div>

      {/* Demo Notice */}
      <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-amber-700" />

        <div>
          <p className="text-sm font-semibold text-amber-800">
            Illustrative Demo Risk Assessments
          </p>

          <p className="mt-1 text-xs leading-relaxed text-amber-700">
            Field names, crops and locations are taken from your registered
            fields. Risk scores, levels and factors are illustrative demo
            assignments, not actual environmental measurements or verified
            agricultural risk assessments.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {riskStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <div className={`rounded-xl p-2.5 ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-gray-800">
                {String(stat.value).padStart(2, "0")}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Distribution and Risk Factors */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Risk Distribution */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 xl:col-span-1">
          <h2 className="font-semibold text-gray-800">
            Risk Distribution
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Illustrative risk assignments across registered fields
          </p>

          <div className="relative mt-4 h-64">
            {fields.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution.filter((item) => item.value > 0)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {riskDistribution
                        .filter((item) => item.value > 0)
                        .map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                          />
                        ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800">
                    {fields.length}
                  </span>

                  <span className="text-xs text-gray-400">
                    Registered Fields
                  </span>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Activity size={32} className="text-gray-300" />
                <p className="mt-3 text-sm font-medium text-gray-500">
                  No fields available
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Register a field to view its demo assessment.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {riskDistribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="text-sm text-gray-600">
                    {item.name}
                  </span>
                </div>

                <span className="text-sm font-semibold text-gray-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 xl:col-span-2">
          <h2 className="font-semibold text-gray-800">
            Agricultural Risk Factors
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Categories planned for future environmental data integration
          </p>

          <div className="mt-6 space-y-4">

            <div className="flex items-center gap-4 rounded-xl bg-blue-50 p-4">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <Droplets size={23} />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  Water Stress
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Potential drought and insufficient soil moisture
                </p>
              </div>

              <span className="text-xs font-medium text-blue-700">
                Planned
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-orange-50 p-4">
              <div className="rounded-xl bg-orange-100 p-3 text-orange-700">
                <ThermometerSun size={23} />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  Temperature Stress
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Unusual heat and temperature variations
                </p>
              </div>

              <span className="text-xs font-medium text-orange-700">
                Planned
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-purple-50 p-4">
              <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                <Wind size={23} />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  Weather Exposure
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Heavy rainfall, wind and extreme weather events
                </p>
              </div>

              <span className="text-xs font-medium text-purple-700">
                Planned
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Field Risk Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

        <div className="flex flex-col gap-2 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">
              Field-wise Risk Assessment
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Registered fields with illustrative demo assessments
            </p>
          </div>

          <span className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
            {fields.length} Registered Records
          </span>
        </div>

        {fields.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Field Name</th>
                  <th className="px-5 py-4 font-semibold">Crop</th>
                  <th className="px-5 py-4 font-semibold">Risk Score</th>
                  <th className="px-5 py-4 font-semibold">Risk Level</th>
                  <th className="px-5 py-4 font-semibold">Primary Factor</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {riskFields.map((field, index) => (
                  <tr
                    key={field.id || index}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800">
                        {field.name || "Unnamed Field"}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={12} />
                        {field.location || "Location not provided"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {field.crop || "Not specified"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-gray-800">
                        {field.demoScore}/100
                      </span>
                      <span className="ml-1 text-[10px] text-gray-400">
                        DEMO
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getRiskStyle(field.demoRisk)}`}>
                        {field.demoRisk} Risk
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {field.demoFactor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <div className="rounded-2xl bg-gray-100 p-4">
              <MapPin size={28} className="text-gray-400" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-800">
              No Registered Fields
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Add your first field in Field Management. It will appear here
              automatically.
            </p>

            <Link
              to="/fields"
              className="mt-5 rounded-xl bg-forest-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-forest-800"
            >
              Go to Field Management
            </Link>
          </div>
        )}

        <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
          <p className="text-xs text-gray-400">
            Risk scores and factors are illustrative only. They are not
            verified environmental measurements or farming recommendations.
          </p>
        </div>
      </div>

    </div>
  );
}

export default RiskAnalysis;
