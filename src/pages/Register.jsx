
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Leaf,
  UserRound,
} from "lucide-react";
import logo from "../assets/Cropswitch_logo.webp";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessageType("error");
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    setMessageType("info");
    setMessage(
      "Your details passed frontend validation. Account creation will be available after backend authentication is integrated."
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F8EF] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-forest-800 transition hover:text-leaf-600"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mt-8 grid overflow-hidden rounded-3xl bg-white shadow-xl lg:min-h-[700px] lg:grid-cols-2">
          {/* Branding panel */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-forest-950 p-8 text-white sm:p-12">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10" />

            <div className="relative z-10">
              <img
                src={logo}
                alt="CropSwitch"
                className="h-20 w-40 object-contain object-left"
              />

              <div className="mt-16 max-w-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-400/15 text-leaf-400">
                  <Leaf size={25} />
                </div>

                <h1 className="mt-7 text-3xl font-extrabold leading-tight sm:text-4xl">
                  Start Your
                  <br />
                  Agricultural Journey.
                </h1>

                <p className="mt-5 text-sm leading-7 text-green-100/75">
                  Create your CropSwitch account and bring field
                  management, agricultural insights, and planning
                  tools together in one workspace.
                </p>
              </div>
            </div>

            <p className="relative z-10 mt-16 text-xs text-green-100/50">
              Analyze • Adapt • Grow
            </p>
          </div>

          {/* Registration form */}
          <div className="flex items-center justify-center p-6 sm:p-12 lg:p-14">
            <div className="w-full max-w-md">
              <p className="text-xs font-bold uppercase tracking-[2px] text-forest-700">
                Get Started
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-forest-950">
                Create Your Account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter your details to get started with CropSwitch.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-forest-700 focus:bg-white focus:ring-2 focus:ring-forest-700/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="register-email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-forest-700 focus:bg-white focus:ring-2 focus:ring-forest-700/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="register-password"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-forest-700 focus:bg-white focus:ring-2 focus:ring-forest-700/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-forest-800"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-forest-700 focus:bg-white focus:ring-2 focus:ring-forest-700/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-forest-800"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-forest-900"
                >
                  Create Account
                  <ArrowRight size={18} />
                </button>

                {message && (
                  <p
                    role="status"
                    className={`rounded-xl border p-3 text-sm leading-6 ${
                      messageType === "error"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-blue-200 bg-blue-50 text-blue-800"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-forest-800 hover:text-leaf-600"
                >
                  Sign In
                </Link>
              </p>

              <p className="mt-7 text-center text-xs text-gray-400">
                © 2026 CropSwitch. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
