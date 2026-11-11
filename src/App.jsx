
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FieldManagement = lazy(() => import("./pages/FieldManagement"));
const RiskAnalysis = lazy(() => import("./pages/RiskAnalysis"));
const NASADataIntegration = lazy(() => import("./pages/NASADataIntegration"));
const CropRotation = lazy(() => import("./pages/CropRotation"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Reports = lazy(() => import("./pages/Reports"));
const Accounts = lazy(() => import("./pages/Accounts"));


function Placeholder({ title }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-500 mt-2">
        This section is under development.
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/CropSwitch">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-forest-800">
            Loading CropSwitch...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/fields" element={<FieldManagement />} />
            <Route path="/nasa-data" element={<NASADataIntegration />} />
            <Route path="/risk-analysis" element={<RiskAnalysis />} />
            <Route path="/crop-rotation" element={<CropRotation />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
