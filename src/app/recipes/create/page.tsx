// src/app/recipes/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";

export default function CreateRecipePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { user } = useUser();

  async function handleCreate() {
    if (!user) {
      alert("ログインしていません");
      return;
    }

    // recipes テーブルに insert
    const { error } = await supabase.from("recipes").insert([
      {
        user_id: user.id,
        title,
        description,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    // 作成成功したら一覧へ
    router.push("/recipes");
  }

  return (
    <main style={{ padding: "1rem" }}>
      <h1>新しいレシピを作成</h1>
      <div style={{ marginBottom: "1rem" }}>
        <label>タイトル:</label>
        <br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>説明:</label>
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          style={{ width: "300px" }}
        />
      </div>
      <button onClick={handleCreate}>作成</button>
    </main>
  );
}
