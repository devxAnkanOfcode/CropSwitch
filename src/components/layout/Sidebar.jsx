import {
  LayoutDashboard,
  Users,
  Map,
  Satellite,
  ShieldAlert,
  Sprout,
  Lightbulb,
  FileText,
  Leaf,
  Settings,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Accounts", path: "/accounts", icon: Users },
  { name: "Field Management", path: "/fields", icon: Map },
  { name: "NASA Data", path: "/nasa-data", icon: Satellite },
  { name: "Risk Analysis", path: "/risk-analysis", icon: ShieldAlert },
  { name: "Crop Rotation", path: "/crop-rotation", icon: Sprout },
  { name: "Recommendations", path: "/recommendations", icon: Lightbulb },
  { name: "Reports", path: "/reports", icon: FileText },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      id="main-navigation"
      className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-forest-900 text-white transition-transform duration-300 ease-in-out lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:w-64 lg:max-w-none lg:translate-x-0 lg:shrink-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-6 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-400">
            <Leaf size={24} className="text-forest-900" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">CropSwitch</h1>
            <p className="text-xs text-green-200">Analyze. Adapt. Grow.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="rounded-lg p-2 text-green-100 hover:bg-white/10 lg:hidden"
        >
          <X size={21} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-green-300/70">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-leaf-400 font-semibold text-forest-900"
                      : "text-green-100/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-green-100/80 hover:bg-white/10"
        >
          <Settings size={19} />
          Settings
        </button>

        <div className="mt-3 flex items-center gap-3 px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D5E9C6] font-bold text-forest-900">
            SN
          </div>

          <div>
            <p className="text-sm font-medium">Space Nova</p>
            <p className="text-xs text-green-200/70">Project Team</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
