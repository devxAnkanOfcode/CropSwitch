import { Link } from "react-router-dom";
import {
  ArrowRight,
  Satellite,
  MapPin,
  ShieldCheck,
  Sprout,
  BarChart3,
  Globe2,
  CheckCircle2,
} from "lucide-react";

import logo from "../assets/Cropswitch_logo.webp";
import heroImage from "../assets/hero.webp";

const features = [
  {
    icon: Satellite,
    title: "Satellite Monitoring",
    description: "Explore satellite imagery and environmental observations.",
  },
  {
    icon: MapPin,
    title: "Smart Field Management",
    description: "Register, organize and monitor your fields.",
  },
  {
    icon: ShieldCheck,
    title: "Agricultural Risk Analysis",
    description: "Identify potential risks and plan ahead.",
  },
  {
    icon: Sprout,
    title: "Crop Rotation",
    description: "Support sustainable and productive farming.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Insights",
    description: "Get actionable insights from your data.",
  },
  {
    icon: Globe2,
    title: "Global Field Support",
    description: "Access agricultural tools anywhere in the world.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
          <Link to="/" className="shrink-0">
            <img
              src={logo}
              alt="CropSwitch - Analyze Adapt Grow"
              className="h-12 w-auto max-w-[190px] object-contain sm:h-14"
            />
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            <a
              href="#home"
              className="text-sm font-semibold text-forest-800 hover:text-leaf-600"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-sm font-semibold text-gray-600 hover:text-forest-800"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm font-semibold text-gray-600 hover:text-forest-800"
            >
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-forest-800 hover:bg-leaf-100 sm:inline-flex"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-900"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="relative overflow-hidden bg-[#F3F8EF]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-24">
            {/* Hero Content */}
            <div className="relative z-10 max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-semibold text-forest-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-leaf-500" />
                Smarter Agriculture. Better Decisions.
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-forest-950 sm:text-5xl lg:text-[54px]">
                Transform the Way You{" "}
                <span className="text-forest-700">Understand Farming.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
                CropSwitch brings satellite imagery, field management and
                agricultural insights together to help make farming decisions
                more informed and efficient.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 rounded-xl bg-forest-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-forest-900/15 transition hover:-translate-y-0.5 hover:bg-forest-900"
                >
                  Start with CropSwitch
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="#features"
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-forest-700 hover:text-forest-800"
                >
                  Explore Features
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-forest-700" />
                  Centralized field management
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-forest-700" />
                  Satellite imagery exploration
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-leaf-500/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white shadow-2xl shadow-forest-950/15">
                <img
                  src={heroImage}
                  alt="Agricultural fields monitored using satellite technology"
                  className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[470px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/30 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-xl backdrop-blur sm:left-8 sm:right-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leaf-100 text-forest-800">
                    <Satellite size={23} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-forest-950">
                      Smarter Agricultural Insights
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Field data, satellite imagery and analysis in one place
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="bg-gradient-to-b from-[#F7FAF3] to-white px-5 py-14 sm:px-8 lg:px-10 lg:py-16"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[2px] text-forest-700">
                — What CropSwitch Offers —
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-forest-950 sm:text-3xl">
                Everything You Need for Smarter Field Management
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
                Explore a unified agricultural workspace designed to bring field
                information and environmental insights together.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="h-full rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-leaf-300 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-100 text-forest-800">
                      <Icon size={24} />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-forest-950">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* About */}
        <section
          id="about"
          className="bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-20"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[2px] text-forest-700">
                About CropSwitch
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-forest-950 sm:text-4xl">
                Bringing Technology Closer to Agriculture.
              </h2>

              <p className="mt-5 text-base leading-8 text-gray-600">
                CropSwitch aims to make agricultural information easier to
                explore and understand. It brings field management, satellite
                imagery and analytical tools together in one workspace to
                support more informed agricultural planning.
              </p>

              <Link
                to="/register"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-forest-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-forest-900"
              >
                Explore CropSwitch
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="rounded-3xl bg-forest-950 p-8 text-white shadow-xl sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-leaf-400">
                Our Approach
              </p>

              <div className="mt-8 space-y-7">
                {[
                  {
                    number: "01",
                    title: "Analyze",
                    description:
                      "Explore field information and environmental observations.",
                  },
                  {
                    number: "02",
                    title: "Adapt",
                    description:
                      "Understand potential agricultural risks and opportunities.",
                  },
                  {
                    number: "03",
                    title: "Grow",
                    description:
                      "Support better planning through organized insights.",
                  },
                ].map((item) => (
                  <div key={item.number} className="flex gap-5">
                    <span className="text-2xl font-extrabold text-leaf-400">
                      {item.number}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-green-100/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl bg-[#EDF6E5] px-7 py-9 text-center sm:px-12 lg:flex-row lg:text-left">
            <div>
              <h2 className="text-2xl font-bold text-forest-950">
                Ready to explore smarter agriculture?
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Get started with the CropSwitch agricultural workspace.
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-forest-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-forest-900"
            >
              Create Your Account
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 sm:px-8 md:flex-row lg:px-10">
          <img
            src={logo}
            alt="CropSwitch"
            className="h-11 w-auto max-w-[170px] object-contain"
          />

          <p className="text-xs text-gray-500">Analyze • Adapt • Grow</p>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} CropSwitch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
