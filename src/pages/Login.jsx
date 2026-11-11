
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Leaf } from "lucide-react";
import logo from "../assets/Cropswitch_logo.webp";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(
      "Login is not connected yet. Authentication will be available after backend integration."
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

        <div className="mt-8 grid overflow-hidden rounded-3xl bg-white shadow-xl lg:min-h-[650px] lg:grid-cols-2">
          {/* Left branding panel */}
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
                  Smarter Insights.
                  <br />
                  Better Agriculture.
                </h1>

                <p className="mt-5 text-sm leading-7 text-green-100/75">
                  Access your agricultural workspace and explore field
                  information, satellite observations, risk analysis,
                  and data-driven planning tools in one place.
                </p>
              </div>
            </div>

            <p className="relative z-10 mt-16 text-xs text-green-100/50">
              Analyze • Adapt • Grow
            </p>
          </div>

          {/* Login form */}
          <div className="flex items-center justify-center p-6 sm:p-12 lg:p-14">
            <div className="w-full max-w-md">
              <p className="text-xs font-bold uppercase tracking-[2px] text-forest-700">
                Welcome Back
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-forest-950">
                Sign in to CropSwitch
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter your details to access your agricultural workspace.
              </p>

              <form onSubmit={handleSubmit} className="mt-9 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
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
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
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

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-forest-900"
                >
                  Sign In
                  <ArrowRight size={18} />
                </button>

                {message && (
                  <p
                    role="status"
                    className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800"
                  >
                    {message}
                  </p>
                )}
              </form>

              <p className="mt-7 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-forest-800 hover:text-leaf-600"
                >
                  Create Account
                </Link>
              </p>

              <p className="mt-8 text-center text-xs text-gray-400">
                © 2026 CropSwitch. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
