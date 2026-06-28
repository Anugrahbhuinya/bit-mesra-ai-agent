import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Languages, Palette, Bell, 
  Sparkles, Compass, RefreshCw, Loader2, 
  ShieldAlert, CheckCircle2, ArrowLeft 
} from "lucide-react";
import { Link } from "react-router-dom";
import usePreferences from "../hooks/usePreferences";
import type { NotificationPreferences } from "../types";

export const SettingsPage = () => {
  const { preferences, loading, partialUpdatePreferences, resetPreferences } = usePreferences();

  // Operation indicators
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savingField, setSavingField] = useState<string | null>(null);
  
  // Confirmation Modal State
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-white min-h-[500px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="mt-4 text-sm text-slate-400">Loading student settings...</p>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="p-8 text-center text-white bg-slate-900 min-h-screen">
        <p className="text-red-400">Failed to load preference settings.</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  const notifySuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleLanguageChange = async (lang: "English" | "Hindi") => {
    setSavingField("language");
    setErrorMsg(null);
    try {
      await partialUpdatePreferences({ preferred_language: lang });
      notifySuccess(`Preferred language changed to ${lang}!`);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || "Failed to update language settings.");
    } finally {
      setSavingField(null);
    }
  };

  const handleThemeChange = async (themeVal: "Light" | "Dark" | "System") => {
    setSavingField("theme");
    setErrorMsg(null);
    try {
      await partialUpdatePreferences({ theme: themeVal });
      notifySuccess(`Appearance theme updated to ${themeVal}!`);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || "Failed to update appearance theme.");
    } finally {
      setSavingField(null);
    }
  };

  const handleNotificationToggle = async (key: keyof NotificationPreferences) => {
    setSavingField(`notif-${key}`);
    setErrorMsg(null);
    try {
      const currentVal = preferences.notifications[key];
      await partialUpdatePreferences({
        notifications: {
          [key]: !currentVal,
        },
      });
      notifySuccess("Notification preferences synchronized successfully.");
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || "Failed to update notification toggles.");
    } finally {
      setSavingField(null);
    }
  };

  const handleAiStyleChange = async (style: "Brief" | "Detailed") => {
    setSavingField("ai_response");
    setErrorMsg(null);
    try {
      await partialUpdatePreferences({ ai_response_style: style });
      notifySuccess(`AI response style changed to ${style}!`);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || "Failed to update AI prompt styles.");
    } finally {
      setSavingField(null);
    }
  };

  const handleHomeRedirectChange = async (homePage: "Dashboard" | "Chat" | "Notices" | "Calendar" | "Profile") => {
    setSavingField("home_page");
    setErrorMsg(null);
    try {
      await partialUpdatePreferences({ default_home_page: homePage });
      notifySuccess(`Preferred home page landing updated to ${homePage}!`);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || "Failed to update landing page preferences.");
    } finally {
      setSavingField(null);
    }
  };

  const handleConfirmReset = async () => {
    setSavingField("reset");
    setErrorMsg(null);
    try {
      await resetPreferences();
      setShowConfirmReset(false);
      notifySuccess("All preference settings reverted back to default system values!");
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || "Failed to reset settings.");
    } finally {
      setSavingField(null);
    }
  };

  return (
    <div className="p-6 md:p-8 text-white max-w-4xl mx-auto font-sans">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} />
          <span>Dashboard</span>
        </Link>
      </div>

      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
            <Settings className="w-8 h-8 text-blue-400 shrink-0" />
            <span>Portal Preferences</span>
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Customize notification channels, themes, landing paths, and AI response parameters.
          </p>
        </div>

        {/* System Reset Button */}
        <button
          onClick={() => setShowConfirmReset(true)}
          className="px-4 py-2 border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw size={12} className={savingField === "reset" ? "animate-spin" : ""} />
          <span>Reset to System Defaults</span>
        </button>
      </header>

      {/* Operation Toast Alerts */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
          <button className="ml-auto hover:text-white" onClick={() => setErrorMsg(null)}>&times;</button>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
          <button className="ml-auto hover:text-white" onClick={() => setSuccessMsg(null)}>&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Appearance & Language */}
        <div className="space-y-8">
          
          {/* THEME CONTROL CARD */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl relative">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-900/60">
              <Palette className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold">Appearance Theme</h2>
              {savingField === "theme" && <Loader2 className="w-4 h-4 animate-spin text-blue-400 ml-auto" />}
            </div>

            <p className="text-xs text-slate-400 mb-4">Set dark mode options for your dashboard views.</p>

            <div className="grid grid-cols-3 gap-2">
              {(["Light", "Dark", "System"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleThemeChange(t)}
                  className={`py-3 px-4 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                    preferences.theme === t
                      ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                      : "border-slate-800 hover:border-slate-700 bg-slate-950/20 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* LANGUAGE CONTROL CARD */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-900/60">
              <Languages className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold">Preferred Language</h2>
              {savingField === "language" && <Loader2 className="w-4 h-4 animate-spin text-blue-400 ml-auto" />}
            </div>

            <p className="text-xs text-slate-400 mb-4">Configure default language translation for platform interfaces.</p>

            <select
              value={preferences.preferred_language}
              onChange={(e) => handleLanguageChange(e.target.value as "English" | "Hindi")}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-slate-200 transition-all text-sm"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
            </select>
          </div>

          {/* DEFAULT HOME PAGE CARD */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-900/60">
              <Compass className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold">Default landing view</h2>
              {savingField === "home_page" && <Loader2 className="w-4 h-4 animate-spin text-blue-400 ml-auto" />}
            </div>

            <p className="text-xs text-slate-400 mb-4">Configure which platform page you land on immediately after logging in.</p>

            <select
              value={preferences.default_home_page}
              onChange={(e) => handleHomeRedirectChange(e.target.value as any)}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-slate-200 transition-all text-sm"
            >
              <option value="Dashboard">Dashboard Hub</option>
              <option value="Chat">AI Chat Assistant</option>
              <option value="Notices">Notices Directory</option>
              <option value="Calendar">Academics Hub</option>
              <option value="Profile">My Student Profile</option>
            </select>
          </div>

        </div>

        {/* Notifications & AI Parameters */}
        <div className="space-y-8">
          
          {/* NOTIFICATION PREFERENCES CARD */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-900/60">
              <Bell className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold">Notifications</h2>
            </div>

            <p className="text-xs text-slate-400 mb-5">Configure which email and system alert pathways are active.</p>

            <div className="space-y-4">
              {[
                { key: "email_notifications", label: "Email Notifications" },
                { key: "push_notifications", label: "Push Notifications" },
                { key: "notice_updates", label: "Notice Updates" },
                { key: "event_reminders", label: "Event Reminders" },
                { key: "academic_alerts", label: "Academic Alerts" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">{label}</span>
                  <div className="flex items-center gap-2">
                    {savingField === `notif-${key}` && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />}
                    <button
                      onClick={() => handleNotificationToggle(key as keyof NotificationPreferences)}
                      className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer relative ${
                        preferences.notifications[key] ? "bg-blue-600" : "bg-slate-800"
                      }`}
                    >
                      <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 700, damping: 30 }}
                        className="w-4 h-4 bg-white rounded-full shadow-md"
                        style={{
                          marginLeft: preferences.notifications[key] ? "20px" : "0px",
                        }}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI PERSONALIZATION PREFERENCES CARD */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-900/60">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold">AI Assistant Profile</h2>
              {savingField === "ai_response" && <Loader2 className="w-4 h-4 animate-spin text-blue-400 ml-auto" />}
            </div>

            <p className="text-xs text-slate-400 mb-4">Choose default formatting lengths for Gemini LLM responses (Phase 7C integration).</p>

            <div className="grid grid-cols-2 gap-2">
              {(["Brief", "Detailed"] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => handleAiStyleChange(style)}
                  className={`py-3 px-4 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                    preferences.ai_response_style === style
                      ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                      : "border-slate-800 hover:border-slate-700 bg-slate-950/20 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs">
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <p>Warning: This action will restore your theme, language, notifications, and AI configurations back to system default values.</p>
              </div>

              <h3 className="font-bold text-white text-base">Revert preferences to defaults?</h3>
              <p className="text-xs text-slate-400">Are you sure you want to proceed? This will override your current settings configuration.</p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-4 py-2.5 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Revert Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
