import {
  LayoutDashboard,
  MessageSquare,
  Bell,
  GraduationCap,
  MapPinned,
  LogOut,
  User,
  KeyRound,
  Settings,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "My Profile",
    icon: User,
    path: "/profile",
  },
  {
    label: "Change Password",
    icon: KeyRound,
    path: "/profile/change-password",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
  {
    label: "Chat",
    icon: MessageSquare,
    path: "/chat",
  },
  {
    label: "Notices",
    icon: Bell,
    path: "/notices",
  },
  {
    label: "Academics",
    icon: GraduationCap,
    path: "/academics",
  },
  {
    label: "Campus Map",
    icon: MapPinned,
    path: "/map",
  },
];

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-5 border-b border-zinc-800">
        <h1 className="text-xl font-bold">BIT Mesra AI</h1>
        <p className="text-xs text-zinc-400 mt-1">Campus Assistant</p>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Student Profile Card & Logout */}
      {currentUser && (
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              {currentUser.profile_picture ? (
                <img
                  src={currentUser.profile_picture}
                  alt={currentUser.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <User size={18} />
              )}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate leading-tight">
                {currentUser.name}
              </h4>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5 font-mono">
                {currentUser.roll_number}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-zinc-800/50 hover:bg-red-950/20 border border-zinc-800 hover:border-red-900/30 text-zinc-400 hover:text-red-400 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logout Session</span>
          </button>
        </div>
      )}

      <div className="p-4 border-t border-zinc-800 text-center">
        <p className="text-[10px] text-zinc-500">BIT Mesra AI v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;

