
// src/data/dashboardData.js

/**
 * CropSwitch Dashboard data configuration.
 *
 * Current source: DEMO
 * Future sources: NASA API / Python backend
 *
 * Never classify sample values as verified measurements.
 */

export const DATA_STATUS = {
  DEMO: "demo",
  VERIFIED: "verified",
  CALCULATED: "calculated",
  RECOMMENDATION: "recommendation",
};

export const dashboardStats = [
  {
    id: "fields",
    title: "Total Fields",
    value: 12,
    unit: "fields",
    description: "Illustrative registered fields",
    status: DATA_STATUS.DEMO,
  },
  {
    id: "nasa-datasets",
    title: "NASA Data Sources",
    value: 4,
    unit: "sources",
    description: "Illustrative integration count",
    status: DATA_STATUS.DEMO,
  },
  {
    id: "crop-strategies",
    title: "Crop Strategies",
    value: 9,
    unit: "strategies",
    description: "Illustrative evaluated strategies",
    status: DATA_STATUS.DEMO,
  },
  {
    id: "risk-alerts",
    title: "Risk Alerts",
    value: 3,
    unit: "alerts",
    description: "Illustrative risk scenarios",
    status: DATA_STATUS.DEMO,
  },
];

export const dashboardActivity = [
  {
    id: 1,
    message: "CropSwitch workspace initialized",
    status: DATA_STATUS.DEMO,
  },
  {
    id: 2,
    message: "NASA data integration pending",
    status: DATA_STATUS.DEMO,
  },
  {
    id: 3,
    message: "Field registration pending",
    status: DATA_STATUS.DEMO,
  },
];
