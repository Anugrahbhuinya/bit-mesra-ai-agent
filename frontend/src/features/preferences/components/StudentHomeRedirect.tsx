import { Navigate } from "react-router-dom";
import usePreferences from "../hooks/usePreferences";
import DashboardPage from "../../dashboard/pages/DashboardPage";
import { Loader2 } from "lucide-react";

export const StudentHomeRedirect = () => {
  const { preferences, loading } = usePreferences();

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="mt-4 text-xs font-semibold">Configuring home portal...</p>
      </div>
    );
  }

  // Fetch target landing path from preference configurations
  const landing = preferences?.default_home_page || "Dashboard";

  switch (landing) {
    case "Chat":
      return <Navigate to="/chat" replace />;
    case "Notices":
      return <Navigate to="/notices" replace />;
    case "Profile":
      return <Navigate to="/profile" replace />;
    case "Calendar":
      return <Navigate to="/academics" replace />; // fallback academics view
    case "Dashboard":
    default:
      return <DashboardPage />;
  }
};

export default StudentHomeRedirect;
