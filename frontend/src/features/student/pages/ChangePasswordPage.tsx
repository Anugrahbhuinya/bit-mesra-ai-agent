import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, ShieldAlert, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import studentService from "../services/studentService";

export const ChangePasswordPage = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await studentService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccessMsg("Password changed successfully! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      console.error("Change password error:", err);
      const msg = err.response?.data?.detail || "Failed to change password. Verify your current password.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 text-white max-w-xl mx-auto font-sans">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} />
          <span>Dashboard</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-950/40 border border-slate-800 rounded-3xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-900/60">
          <div className="p-2 bg-blue-600/10 rounded-xl text-blue-400 border border-blue-500/20">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Update Security Credentials</h2>
            <p className="text-xs text-slate-400 mt-0.5">Protect your student portal account.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 placeholder:text-slate-700 text-sm"
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              New Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 placeholder:text-slate-700 text-sm"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Re-type new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 placeholder:text-slate-700 text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Change Password</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ChangePasswordPage;
