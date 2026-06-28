import { useState, useEffect } from "react";
import { 
  Users, Search, Filter, RefreshCw, Edit2, 
  Trash2, KeyRound, ChevronLeft, ChevronRight, X, 
  UserCheck, ShieldAlert, CheckCircle2, Loader2, Plus 
} from "lucide-react";
import adminApi from "../services/api";

interface Student {
  _id: string;
  roll_number: string;
  name: string;
  email: string;
  department: string;
  program: string;
  year: number;
  semester: number;
  section: string;
  status: string;
  created_at: string;
}

export const AdminStudentsPage = () => {
  // Directory States
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [progFilter, setProgFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [semFilter, setSemFilter] = useState("");

  // Modals / Operations States
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Notifications
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form inputs for editing
  const [formRoll, setFormRoll] = useState("");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formProg, setFormProg] = useState("");
  const [formYear, setFormYear] = useState(1);
  const [formSem, setFormSem] = useState(1);
  const [formSec, setFormSec] = useState("");
  const [formStatus, setFormStatus] = useState("active");

  // Form input for password reset
  const [resetPassword, setResetPassword] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      let url = `/api/admin/students?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (deptFilter) url += `&department=${encodeURIComponent(deptFilter)}`;
      if (progFilter) url += `&program=${encodeURIComponent(progFilter)}`;
      if (yearFilter) url += `&year=${yearFilter}`;
      if (semFilter) url += `&semester=${semFilter}`;

      const response = await adminApi.get(url);
      setStudents(response.data.students || []);
      setTotal(response.data.total || 0);
      setPages(response.data.pages || 1);
    } catch (e: any) {
      console.error("Failed to load students registry", e);
      setErrorMsg(e.response?.data?.detail || "Could not retrieve student records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, deptFilter, progFilter, yearFilter, semFilter]);

  const triggerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleResetFilters = () => {
    setSearch("");
    setDeptFilter("");
    setProgFilter("");
    setYearFilter("");
    setSemFilter("");
    setPage(1);
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setFormRoll(student.roll_number);
    setFormName(student.name);
    setFormEmail(student.email);
    setFormDept(student.department);
    setFormProg(student.program);
    setFormYear(student.year);
    setFormSem(student.semester);
    setFormSec(student.section);
    setFormStatus(student.status);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      roll_number: formRoll.trim(),
      name: formName.trim(),
      email: formEmail.trim(),
      department: formDept.trim(),
      program: formProg.trim(),
      year: Number(formYear),
      semester: Number(formSem),
      section: formSec.trim(),
      status: formStatus,
    };

    try {
      await adminApi.put(`/api/admin/students/${selectedStudent._id}`, payload);
      setSuccessMsg(`Student ${formName} updated successfully!`);
      setIsEditOpen(false);
      fetchStudents();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to update student academic details.");
    } finally {
      setActionLoading(false);
    }
  };

  const openResetModal = (student: Student) => {
    setSelectedStudent(student);
    setResetPassword("");
    setIsResetOpen(true);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !resetPassword.trim()) return;

    if (resetPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await adminApi.post(`/api/admin/students/${selectedStudent._id}/reset-password`, {
        new_password: resetPassword,
      });
      setSuccessMsg(`Password reset successfully for ${selectedStudent.name}!`);
      setIsResetOpen(false);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to reset student password.");
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteModal = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await adminApi.delete(`/api/admin/students/${selectedStudent._id}`);
      setSuccessMsg(`Student account ${selectedStudent.name} soft-deleted successfully.`);
      setIsDeleteOpen(false);
      fetchStudents();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to delete student.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-900/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 rounded-xl text-blue-400 border border-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white leading-none">Student Registry</h1>
            <p className="text-xs text-slate-400 mt-1.5">Manage records, toggle academic profiles, and overwrite security settings.</p>
          </div>
        </div>
      </div>

      {/* Global Toast Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-sm animate-pulse">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
          <button className="ml-auto hover:text-white" onClick={() => setErrorMsg(null)}><X size={16} /></button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
          <button className="ml-auto hover:text-white" onClick={() => setSuccessMsg(null)}><X size={16} /></button>
        </div>
      )}

      {/* Filters & Actions bar */}
      <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4 shadow-lg">
        <form onSubmit={triggerSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by student name, roll number, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-900 focus:border-blue-600 rounded-2xl focus:outline-none text-slate-200 placeholder:text-slate-600 text-sm transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-semibold transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-1.5 justify-center"
          >
            <Search size={16} />
            <span>Search</span>
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2.5 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white rounded-2xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 justify-center"
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-900/60 text-xs">
          {/* Department Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Department</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-900 focus:border-blue-600 rounded-xl focus:outline-none text-slate-300 transition-all text-xs"
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Comm</option>
              <option value="Mechanical Engineering">Mechanical Eng</option>
            </select>
          </div>

          {/* Program Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Program</label>
            <select
              value={progFilter}
              onChange={(e) => setProgFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-900 focus:border-blue-600 rounded-xl focus:outline-none text-slate-300 transition-all text-xs"
            >
              <option value="">All Programs</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-900 focus:border-blue-600 rounded-xl focus:outline-none text-slate-300 transition-all text-xs"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* Semester Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Semester</label>
            <select
              value={semFilter}
              onChange={(e) => setSemFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-900 focus:border-blue-600 rounded-xl focus:outline-none text-slate-300 transition-all text-xs"
            >
              <option value="">All Semesters</option>
              {[...Array(8)].map((_, i) => (
                <option key={i+1} value={i+1}>Semester {i+1}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Student list card */}
      <div className="bg-slate-950/40 border border-slate-900 rounded-3xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="mt-4 text-sm font-medium">Fetching students list...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <Users className="w-12 h-12 mx-auto text-slate-700 mb-3" />
            <p>No student records found matching the query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-200">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-900">
                <tr>
                  <th className="px-6 py-4">Roll Number</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Program & Academics</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 bg-slate-950/20">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-blue-400">{student.roll_number}</td>
                    <td className="px-6 py-4 font-semibold text-white">{student.name}</td>
                    <td className="px-6 py-4 text-slate-400">{student.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-300">{student.program} ({student.department})</span>
                        <span className="text-xs text-slate-500 mt-0.5">Year {student.year} — Sem {student.semester} — Sec {student.section}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-lg uppercase tracking-wider border ${
                        student.status === "active" 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : student.status === "suspended"
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(student)}
                        title="Edit Student Info"
                        className="p-2 hover:bg-slate-800 hover:text-blue-400 rounded-xl transition-all cursor-pointer inline-flex text-slate-400"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => openResetModal(student)}
                        title="Reset Student Password"
                        className="p-2 hover:bg-slate-800 hover:text-amber-400 rounded-xl transition-all cursor-pointer inline-flex text-slate-400"
                      >
                        <KeyRound size={14} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(student)}
                        title="Soft Delete Student"
                        className="p-2 hover:bg-slate-800 hover:text-red-500 rounded-xl transition-all cursor-pointer inline-flex text-slate-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {students.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500 bg-slate-950/60">
            <span>Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records</span>
            
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="p-1.5 border border-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-semibold text-slate-300">Page {page} of {pages}</span>
              <button
                disabled={page === pages}
                onClick={() => setPage(p => Math.min(p + 1, pages))}
                className="p-1.5 border border-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
          EDIT STUDENT DETAILS MODAL
         ==================================================================== */}
      {isEditOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Edit Student Profile</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Student Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none text-sm text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Roll Number</label>
                  <input
                    type="text"
                    value={formRoll}
                    onChange={(e) => setFormRoll(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none text-sm text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none text-sm text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none text-sm text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Program</label>
                  <input
                    type="text"
                    value={formProg}
                    onChange={(e) => setFormProg(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none text-sm text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Year</label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none text-sm text-slate-300"
                  >
                    {[1,2,3,4,5].map(y => <option key={y} value={y}>{y}st Year</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Semester</label>
                  <select
                    value={formSem}
                    onChange={(e) => setFormSem(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none text-sm text-slate-300"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i+1} value={i+1}>Semester {i+1}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Section</label>
                  <input
                    type="text"
                    value={formSec}
                    onChange={(e) => setFormSec(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none text-sm text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Account Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none text-sm text-slate-300"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {actionLoading && <Loader2 size={12} className="animate-spin" />}
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          RESET PASSWORD MODAL
         ==================================================================== */}
      {isResetOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Reset Password</h3>
              <button onClick={() => setIsResetOpen(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>

            <form onSubmit={handleResetSubmit} className="p-6 space-y-4">
              <p className="text-xs text-slate-400">
                You are about to override credentials for <span className="font-semibold text-white">{selectedStudent.name}</span>.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none text-sm text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {actionLoading && <Loader2 size={12} className="animate-spin" />}
                  <span>Reset Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          SOFT DELETE CONFIRMATION MODAL
         ==================================================================== */}
      {isDeleteOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-red-500 text-lg">Soft-Delete Student Account</h3>
              <button onClick={() => setIsDeleteOpen(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs">
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <p>
                  Warning: Soft-deleting this account will instantly deactivate the student login session and filter this record out from search indexes. This operation is reversible.
                </p>
              </div>

              <p className="text-xs text-slate-300">
                Are you sure you want to soft delete the account for <span className="font-semibold text-white">{selectedStudent.name}</span> ({selectedStudent.roll_number})?
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {actionLoading && <Loader2 size={12} className="animate-spin" />}
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentsPage;
