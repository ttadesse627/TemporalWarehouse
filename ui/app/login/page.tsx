"use client";

import Link from "next/link";
import { useState } from "react";
import { Package, LogIn } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Placeholder for API integration.
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Login flow is ready. Connect your auth API next.");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1d4ed8_0%,transparent_45%),radial-gradient(circle_at_bottom_left,#0f766e_0%,transparent_40%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          <section className="hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2">
                <Package className="h-5 w-5 text-blue-300" />
                <span className="text-sm font-semibold tracking-wide text-blue-100">Temporal Warehouse</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white">Manage stock with confidence.</h1>
              <p className="mt-4 max-w-md text-slate-300">
                Sign in to monitor inventory, track movement, and keep operations in sync.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
              <p className="text-sm text-slate-300">Environment</p>
              <p className="mt-1 text-lg font-semibold text-white">Production Dashboard</p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur sm:p-8">
            <div className="mb-8">
              <p className="text-sm text-slate-400">Welcome back</p>
              <h2 className="text-3xl font-bold text-white">Sign in</h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" />
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
              <Link href="/" className="transition hover:text-white">
                Back to dashboard
              </Link>
              <Link href="#" className="transition hover:text-white">
                Forgot password?
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
