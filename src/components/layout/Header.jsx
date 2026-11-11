import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  CheckCheck,
  Sprout,
  Satellite,
  ShieldAlert,
  FileText,
  UserRound,
  Settings,
  Home,
  ArrowLeft,
} from "lucide-react";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/accounts": "Accounts",
  "/fields": "Field Management",
  "/nasa-data": "NASA Data Integration",
  "/risk-analysis": "Risk Analysis",
  "/crop-rotation": "Crop Rotation",
  "/recommendations": "Recommendations",
  "/reports": "Reports",
};

const initialNotifications = [
  {
    id: 1,
    title: "Welcome to CropSwitch",
    description: "Your agricultural workspace is ready to explore.",
    time: "Getting started",
    icon: Sprout,
    read: false,
  },
  {
    id: 2,
    title: "Field Management",
    description: "Manage your fields and review their saved information.",
    time: "Workspace update",
    icon: Satellite,
    read: false,
  },
  {
    id: 3,
    title: "Risk Analysis",
    description: "Explore the available agricultural risk analysis tools.",
    time: "Workspace update",
    icon: ShieldAlert,
    read: true,
  },
  {
    id: 4,
    title: "Reports",
    description: "Generate and export your workspace reports.",
    time: "Workspace update",
    icon: FileText,
    read: true,
  },
];

function Header({ onMenuClick }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "CropSwitch";

  const notificationRef = useRef(null);
  const adminMenuRef = useRef(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }

      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)
      ) {
        setIsAdminMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsAdminMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
      {/* Page title and mobile menu */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-controls="main-navigation"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="mb-1 truncate text-[11px] text-gray-400 sm:text-xs">
            CropSwitch / Workspace
          </p>

          <h2 className="truncate text-base font-bold text-gray-800 sm:text-xl">
            {title}
          </h2>
        </div>
      </div>

      {/* Header actions */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 md:flex">
          <Search size={17} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            className="w-28 bg-transparent text-sm outline-none lg:w-36"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen((open) => !open);
              setIsAdminMenuOpen(false);
            }}
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={isNotificationsOpen}
            className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-forest-800"
          >
            <Bell size={21} />

            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                <div>
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {unreadCount} unread updates
                  </p>
                </div>

                <button
                  type="button"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1 text-xs font-semibold text-forest-800 transition hover:text-leaf-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckCheck size={15} />
                  Mark all read
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => {
                  const Icon = notification.icon;

                  return (
                    <button
                      type="button"
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`flex w-full gap-3 border-b border-gray-50 px-4 py-4 text-left transition hover:bg-gray-50 ${
                        notification.read ? "bg-white" : "bg-green-50/60"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-forest-800">
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-800">
                            {notification.title}
                          </p>

                          {!notification.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-green-600" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {notification.description}
                        </p>

                        <p className="mt-2 text-[10px] text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-gray-50 px-4 py-2.5 text-center text-[10px] text-gray-400">
                Demo notifications · Not live alerts
              </div>
            </div>
          )}
        </div>

        {/* Admin profile menu */}
        <div className="relative" ref={adminMenuRef}>
          <button
            type="button"
            onClick={() => {
              setIsAdminMenuOpen((open) => !open);
              setIsNotificationsOpen(false);
            }}
            aria-label="Open admin menu"
            aria-expanded={isAdminMenuOpen}
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-semibold text-green-800">
              A
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-gray-800">Admin</p>
              <p className="text-xs text-gray-400">Workspace</p>
            </div>

            <ChevronDown
              size={16}
              className={`hidden text-gray-400 transition sm:block ${
                isAdminMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isAdminMenuOpen && (
            <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-bold text-gray-800">Admin</p>
                <p className="text-xs text-gray-400">CropSwitch Workspace</p>
              </div>

              <Link
                to="/accounts"
                onClick={() => setIsAdminMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 transition hover:bg-green-50 hover:text-forest-800"
              >
                <UserRound size={17} />
                My Account
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setIsAdminMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 transition hover:bg-green-50 hover:text-forest-800"
              >
                <Home size={17} />
                Dashboard
              </Link>

              <Link
                to="/"
                onClick={() => setIsAdminMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 transition hover:bg-green-50 hover:text-forest-800"
              >
                <ArrowLeft size={17} />
                Back to Website
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
