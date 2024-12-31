// app/signup/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }

    alert("Sign up successful! もし確認メールが有効なら、メールをチェックしてください。");
    router.push("/"); // トップページに戻る
  }

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ display: "inline-block" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="mail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </main>
  );
}
