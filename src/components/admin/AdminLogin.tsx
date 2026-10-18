"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandHeader } from "@/components/BrandHeader";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("كلمة المرور غير صحيحة");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="welcome" style={{ maxWidth: 480 }}>
      <BrandHeader compact />
      <div className="welcome-hero">
        <p className="eyebrow">لوحة الإدارة</p>
        <h1>نتائج تقييم As-Is</h1>
        <p className="lede">عرض وتجميع إجابات المشاركين حسب الوحدة والدورة.</p>
      </div>
      <form className="welcome-panel" onSubmit={onSubmit}>
        <label>
          كلمة مرور الأدمن
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            autoFocus
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading || !password}>
          {loading ? "جاري الدخول…" : "دخول"}
        </button>
      </form>
    </section>
  );
}
