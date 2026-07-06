"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function StaffLogin() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Incorrect email or password.");
      setSubmitting(false);
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-16 px-8">
      <div className="card max-w-[420px] w-full">
        <span className="eyebrow">Staff area</span>
        <h1 className="font-display text-2xl mt-2 mb-1.5">Staff sign in</h1>
        <p className="text-sm text-ink-soft mb-6">
          For treasurer, pastoral, and elders&apos; board access. Not a church member login.
        </p>

        {error && (
          <div className="mb-4 text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-card px-3 py-2.5">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-[13px] font-semibold mb-1.5">Email</label>
          <input
            type="email"
            placeholder="you@shaurimoyosda.org"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <div className="mb-5">
          <label className="block text-[13px] font-semibold mb-1.5">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button
          type="button"
          className="btn-primary w-full disabled:opacity-60"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-[12.5px] text-ink-soft mt-4 text-center">
          Forgotten your password? Contact the church admin to have it reset.
        </p>
      </div>
    </section>
  );
}
