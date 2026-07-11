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
import Landing from "./pages/Landing";
import { AppShell } from "./components/AppShell";

export default function App() {
  return (
    <BootProvider>
      <BrowserRouter>
        <Routes>
          {/* Public marketing and auth */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected dashboards */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRole="employee">
                <AppShell>
                  <EmployeeDashboard />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AppShell role="admin">
                  <AdminDashboard />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Protected pages */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedRole="admin">
                <AppShell role="admin">
                  <UploadFiles />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mood"
            element={
              <ProtectedRoute allowedRole="employee">
                <AppShell>
                  <MoodQuestions />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRole="admin">
                <AppShell role="admin">
                  <Reports />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/points"
            element={
              <ProtectedRoute allowedRole="employee">
                <AppShell>
                  <PointsRewards />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions"
            element={
              <ProtectedRoute allowedRole={["employee", "admin"]}>
                <AppShell>
                  <SessionsCalendar />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/heart-loader"
            element={
              <AppShell>
                <HeartLoaderPage />
              </AppShell>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRole="admin">
                <AppShell role="admin">
                  <AnalyticsMonitoring />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics-2"
            element={
              <ProtectedRoute allowedRole="admin">
                <AppShell role="admin">
                  <AnalyticsMonitoring2 />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRole={["employee", "admin"]}>
                <AppShell>
                  <NotificationSystem />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BootProvider>
  );
}



