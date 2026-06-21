"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Wrong username or password!");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5"
      style={{ background: "linear-gradient(135deg, #1a0b0c 0%, #4a0d0e 50%, #1a0b0c 100%)" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 animate-fade-in">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center text-2xl text-white"
            style={{ background: "linear-gradient(to right, #ffb25f, #ed1c24, #ff0000)" }}>
            ⚡
          </div>
          <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Patel Light</h2>
          <p className="text-sm text-slate-500 mt-1">Customer Manager — Please login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Username
            </label>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:border-[#Fd0304] focus-within:ring-2 focus-within:ring-red-100 transition-all">
              <span className="px-3 text-slate-400 text-sm">👤</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className="flex-1 py-3 pr-3 text-sm outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Password
            </label>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:border-[#Fd0304] focus-within:ring-2 focus-within:ring-red-100 transition-all">
              <span className="px-3 text-slate-400 text-sm">🔒</span>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="flex-1 py-3 text-sm outline-none bg-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="px-3 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">
              ❌ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(to right, #ff6b6b, #Fd0304)" }}
          >
            {loading ? "Signing in…" : "🔐 Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
