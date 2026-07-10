import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { BootProvider } from "./auth/BootContext";

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
          {/* 0-3 */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* 4-12 */}
          <Route path="/upload" element={<UploadFiles />} />
          <Route path="/mood" element={<MoodQuestions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/points" element={<PointsRewards />} />
          <Route path="/sessions" element={<SessionsCalendar />} />
          <Route path="/heart-loader" element={<HeartLoaderPage />} />
          <Route path="/analytics" element={<AnalyticsMonitoring />} />
          <Route path="/analytics-2" element={<AnalyticsMonitoring2 />} />
          <Route path="/notifications" element={<NotificationSystem />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BootProvider>
  );
}



