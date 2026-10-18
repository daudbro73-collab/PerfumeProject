"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { ADMIN_PASSWORD, ADMIN_SESSION_KEY } from "@/lib/constants";

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthed(sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");
    setReady(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      setAuthed(true);
      setError("");
      setPassword("");
      return;
    }
    setError("Неверный пароль");
  };

  if (!ready) {
    return <div className="min-h-screen bg-milk" />;
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center px-4">
        <div className="w-full max-w-sm glass-card rounded-2xl p-8">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-6 h-6 text-gold" />
          </div>
          <h1 className="text-2xl font-semibold text-ink text-center mb-1">CRM Élixir</h1>
          <p className="text-sm text-ink-muted text-center mb-6">Введите пароль для входа</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Пароль"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-milk text-ink text-sm focus:outline-none focus:border-gold/50"
            />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-gold text-ink font-medium rounded-full hover:shadow-lg hover:shadow-gold/25 transition-all text-sm"
            >
              Войти
            </button>
          </form>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-muted hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            На сайт
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
