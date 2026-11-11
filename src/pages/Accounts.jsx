
import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Save,
  Bell,
  Globe,
} from "lucide-react";

const STORAGE_KEY = "cropswitch-account";

const defaultProfile = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  role: "Farmer",
  language: "English",
  notifications: true,
};

function readProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === "object"
      ? { ...defaultProfile, ...saved }
      : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function Accounts() {
  const [profile, setProfile] = useState(readProfile);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setMessage("Account profile saved successfully.");
    } catch {
      setMessage("Unable to save profile. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <UserRound className="text-forest-700" size={26} />
          <h1 className="text-2xl font-bold text-ink">Accounts</h1>
        </div>
        <p className="mt-2 text-sm text-muted">
          Manage your profile and account preferences.
        </p>
      </div>

      {/* Profile Overview */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-100">
            <UserRound size={32} className="text-forest-800" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink">
              {profile.name || "Your Profile"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {profile.role} Account
            </p>
            <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Demo Account
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-white"
      >
        <div className="border-b border-border p-5">
          <h2 className="font-semibold text-ink">Personal Information</h2>
          <p className="mt-1 text-xs text-muted">
            Update your basic account details.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-ink">
            Full Name
            <span className="relative block">
              <UserRound
                size={17}
                className="absolute left-3 top-3.5 text-muted"
              />
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-border py-3 pl-10 pr-3 outline-none focus:border-forest-700"
              />
            </span>
          </label>

          <label className="space-y-2 text-sm font-medium text-ink">
            Email Address
            <span className="relative block">
              <Mail
                size={17}
                className="absolute left-3 top-3.5 text-muted"
              />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-border py-3 pl-10 pr-3 outline-none focus:border-forest-700"
              />
            </span>
          </label>

          <label className="space-y-2 text-sm font-medium text-ink">
            Phone Number
            <span className="relative block">
              <Phone
                size={17}
                className="absolute left-3 top-3.5 text-muted"
              />
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-border py-3 pl-10 pr-3 outline-none focus:border-forest-700"
              />
            </span>
          </label>

          <label className="space-y-2 text-sm font-medium text-ink">
            Organization
            <span className="relative block">
              <Building2
                size={17}
                className="absolute left-3 top-3.5 text-muted"
              />
              <input
                name="organization"
                value={profile.organization}
                onChange={handleChange}
                placeholder="Farm or organization name"
                className="w-full rounded-lg border border-border py-3 pl-10 pr-3 outline-none focus:border-forest-700"
              />
            </span>
          </label>
        </div>

        <div className="border-t border-border p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={19} className="text-forest-700" />
            <h2 className="font-semibold text-ink">Account Settings</h2>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-ink">
              Account Role
              <select
                name="role"
                value={profile.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-white px-3 py-3 outline-none focus:border-forest-700"
              >
                <option value="Farmer">Farmer</option>
                <option value="Agronomist">Agronomist</option>
                <option value="Administrator">Administrator</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-ink">
              Preferred Language
              <span className="relative block">
                <Globe
                  size={17}
                  className="absolute left-3 top-3.5 text-muted"
                />
                <select
                  name="language"
                  value={profile.language}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-3 outline-none focus:border-forest-700"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Bengali">Bengali</option>
                </select>
              </span>
            </label>
          </div>

          <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl bg-canvas p-4">
            <input
              type="checkbox"
              name="notifications"
              checked={profile.notifications}
              onChange={handleChange}
              className="h-4 w-4 accent-forest-800"
            />
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-forest-700" />
              <div>
                <p className="text-sm font-medium text-ink">
                  Enable Notifications
                </p>
                <p className="mt-1 text-xs text-muted">
                  Notification preference for future integration.
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Save */}
        <div className="flex flex-col gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <p
            className={`text-sm ${
              message.includes("successfully")
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {message}
          </p>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest-900"
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>
      </form>

      {/* Demo Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-900">
          Frontend demonstration
        </p>
        <p className="mt-1 text-xs leading-5 text-blue-800">
          Profile information is stored locally in this browser.
          Login authentication, password management and actual
          role-based permissions require backend integration.
        </p>
      </div>
    </div>
  );
}

export default Accounts;
