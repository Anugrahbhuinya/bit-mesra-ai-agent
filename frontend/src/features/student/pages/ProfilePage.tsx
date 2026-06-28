import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, GraduationCap, Calendar, 
  Hash, BookOpen, UserCheck, Edit2, Camera, 
  ShieldAlert, CheckCircle2, Loader2, ArrowLeft 
} from "lucide-react";
import { Link } from "react-router-dom";
import studentService from "../services/studentService";
import { useAuth } from "../../auth/hooks/useAuth";
import type { StudentUser } from "../../auth/types";

export const ProfilePage = () => {
  const { refreshProfile } = useAuth();
  
  const [profile, setProfile] = useState<StudentUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Avatar Upload States
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoadingProfile(true);
      const data = await studentService.getProfile();
      setProfile(data);
      setEditName(data.name);
      setEditEmail(data.email);
    } catch (e) {
      console.error("Failed to fetch profile details", e);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(null);

    if (!editName.trim() || !editEmail.trim()) {
      setEditError("Name and Email are required fields.");
      return;
    }

    setIsSavingProfile(true);
    try {
      const updated = await studentService.updateProfile({
        name: editName.trim(),
        email: editEmail.trim(),
      });
      setProfile(updated);
      await refreshProfile(); // Sync details to AuthContext/Sidebar
      setEditSuccess("Profile updated successfully!");
      setTimeout(() => {
        setIsEditing(false);
        setEditSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error("Edit profile failed:", err);
      const msg = err.response?.data?.detail || "Failed to update profile. Please verify your inputs.";
      setEditError(msg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit.");
      return;
    }

    // Validate extension
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) {
      setUploadError("Only PNG, JPG, and JPEG images are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const response = await studentService.uploadProfilePicture(formData);
      if (profile) {
        setProfile({
          ...profile,
          profile_picture: response.profile_picture,
        });
      }
      await refreshProfile(); // Sync details to AuthContext/Sidebar
      setUploadSuccess("Avatar updated successfully!");
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      const msg = err.response?.data?.detail || "Failed to upload avatar.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-white min-h-[500px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="mt-4 text-sm text-slate-400">Loading student profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-white bg-slate-900 min-h-screen">
        <p className="text-red-400">Failed to load student profile details.</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 text-white max-w-4xl mx-auto font-sans">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} />
          <span>Dashboard</span>
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Student Profile Settings
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Manage your personal records, avatar, and security settings.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile picture card */}
        <div className="md:col-span-1 bg-slate-950/40 border border-slate-800 rounded-3xl p-6 flex flex-col items-center shadow-xl">
          <div className="relative group mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-900 flex items-center justify-center text-slate-400 shadow-inner">
              {profile.profile_picture ? (
                <img 
                  src={`http://localhost:8000${profile.profile_picture}`} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16" />
              )}
            </div>

            {/* Upload trigger overlay */}
            <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-semibold">
              <Camera className="w-5 h-5 mb-1 text-blue-400" />
              <span>Change Photo</span>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg" 
                onChange={handleFileChange} 
                disabled={isUploading}
                className="hidden" 
              />
            </label>

            {isUploading && (
              <div className="absolute inset-0 bg-black/75 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-center">{profile.name}</h3>
          <p className="text-xs text-zinc-500 font-mono mt-1">{profile.roll_number}</p>

          <div className="w-full mt-6 space-y-2">
            {uploadError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl flex items-center gap-1.5 justify-center">
                <ShieldAlert size={12} />
                <span>{uploadError}</span>
              </p>
            )}
            {uploadSuccess && (
              <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-1.5 justify-center">
                <CheckCircle2 size={12} />
                <span>{uploadSuccess}</span>
              </p>
            )}
          </div>
        </div>

        {/* Details Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-8 shadow-xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900/60">
              <h2 className="text-xl font-bold">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  <Edit2 size={12} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-100 text-sm"
                  />
                </div>

                {editError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-2 text-red-400 text-xs">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                    <span>{editError}</span>
                  </div>
                )}

                {editSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-2 text-emerald-400 text-xs">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                    <span>{editSuccess}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(profile.name);
                      setEditEmail(profile.email);
                      setEditError(null);
                    }}
                    className="px-4 py-2.5 border border-slate-800 hover:bg-slate-900 rounded-xl transition-all text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingProfile && <Loader2 size={12} className="animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-500" />
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Full Name</span>
                    <span className="text-slate-100 font-semibold">{profile.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Email Address</span>
                    <span className="text-slate-100 font-semibold">{profile.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-slate-500" />
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Roll Number</span>
                    <span className="text-slate-100 font-semibold font-mono">{profile.roll_number}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-slate-500" />
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Account Status</span>
                    <span className="inline-flex px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg uppercase tracking-wider mt-0.5">
                      {profile.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Academic Details Card */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-900/60">Academic Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-slate-500" />
                <div>
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Department</span>
                  <span className="text-slate-100 font-semibold">{profile.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-slate-500" />
                <div>
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Program</span>
                  <span className="text-slate-100 font-semibold">{profile.program}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-500" />
                <div>
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Year & Semester</span>
                  <span className="text-slate-100 font-semibold">
                    Year {profile.year} — Semester {profile.semester}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-slate-500" />
                <div>
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Section</span>
                  <span className="text-slate-100 font-semibold font-mono">Section {profile.section}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
