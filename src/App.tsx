import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { BootProvider } from "./auth/BootContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";

import UploadFiles from "./pages/UploadFiles";
import MoodQuestions from "./pages/MoodQuestions";
import Reports from "./pages/Reports";
import PointsRewards from "./pages/PointsRewards";
import SessionsCalendar from "./pages/SessionsCalendar";
import HeartLoaderPage from "./pages/HeartLoaderPage";
import AnalyticsMonitoring from "./pages/AnalyticsMonitoring";
import AnalyticsMonitoring2 from "./pages/AnalyticsMonitoring2";
import NotificationSystem from "./pages/NotificationSystem";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <BootProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboards */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Other pages */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedRole="admin">
                <UploadFiles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mood"
            element={
              <ProtectedRoute allowedRole="employee">
                <MoodQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRole="admin">
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/points"
            element={
              <ProtectedRoute allowedRole="employee">
                <PointsRewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions"
            element={
              <ProtectedRoute allowedRole={["employee", "admin"]}>
                <SessionsCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/heart-loader"
            element={<HeartLoaderPage />}
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRole="admin">
                <AnalyticsMonitoring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics-2"
            element={
              <ProtectedRoute allowedRole="admin">
                <AnalyticsMonitoring2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRole="employee">
                <NotificationSystem />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </BootProvider>
  );
}



