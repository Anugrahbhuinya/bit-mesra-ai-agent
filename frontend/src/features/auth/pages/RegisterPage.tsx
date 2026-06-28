import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, ArrowRight, ShieldAlert, CheckCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";

export const RegisterPage = () => {
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  // Field states
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [year, setYear] = useState(1);
  const [semester, setSemester] = useState(1);
  const [section, setSection] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    // Validate inputs
    if (
      !rollNumber ||
      !name ||
      !email ||
      !password ||
      !department ||
      !program ||
      !section
    ) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    const payload = {
      roll_number: rollNumber.trim(),
      name: name.trim(),
      email: email.trim(),
      password,
      department: department.trim(),
      program: program.trim(),
      year: Number(year),
      semester: Number(semester),
      section: section.trim().toUpperCase(),
    };

    setIsSubmitting(true);
    try {
      await registerStudent(payload);
      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Registration failed:", err);
      const msg = err.response?.data?.detail || "Registration failed. Please verify your details.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 font-sans text-slate-100 overflow-y-auto py-12 relative">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl text-blue-400 mb-4 border border-blue-500/20">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
            Student Registration
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Create your account to access the AI Portal
          </p>
        </div>

        {/* Error notification */}
        {formError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-sm"
          >
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </motion.div>
        )}

        {/* Success notification */}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-400 text-sm"
          >
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Layout for Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 placeholder:text-slate-600 text-sm"
              />
            </div>

            {/* Roll Number */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Roll Number
              </label>
              <input
                type="text"
                placeholder="BTECH/10001/22"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 placeholder:text-slate-600 text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john.doe@bitmesra.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 placeholder:text-slate-600 text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 placeholder:text-slate-600 text-sm"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Department
              </label>
              <input
                type="text"
                placeholder="Computer Science & Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 placeholder:text-slate-600 text-sm"
              />
            </div>

            {/* Program */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Program
              </label>
              <input
                type="text"
                placeholder="B.Tech / MCA / M.Tech"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 placeholder:text-slate-600 text-sm"
              />
            </div>

            {/* Year & Semester Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 text-sm"
                >
                  <option value={1} className="bg-slate-900">1st Year</option>
                  <option value={2} className="bg-slate-900">2nd Year</option>
                  <option value={3} className="bg-slate-900">3rd Year</option>
                  <option value={4} className="bg-slate-900">4th Year</option>
                  <option value={5} className="bg-slate-900">5th Year</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 text-sm"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1} className="bg-slate-900">Sem {i+1}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Section
              </label>
              <input
                type="text"
                placeholder="A / B / C"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 placeholder:text-slate-600 text-sm"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-500/10 active:scale-98 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center border-t border-slate-900/60 pt-6">
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
