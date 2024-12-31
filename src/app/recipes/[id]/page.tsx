// src/app/recipes/[id]/page.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchRecipe() {
      setLoading(true);
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        // 該当レコードが無い / RLSで読めない場合など
        alert("エラー: " + error.message);
        router.push("/recipes");
      } else if (data) {
        setTitle(data.title || "");
        setDescription(data.description || "");
      }
      setLoading(false);
    }

    fetchRecipe();
  }, [id, user, router]);

  // レシピ更新
  async function handleUpdate() {
    const { error } = await supabase
      .from("recipes")
      .update({ title, description })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("レシピを更新しました");
  }

  // レシピ削除
  async function handleDelete() {
    const ok = confirm("本当に削除しますか？");
    if (!ok) return;

    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("削除しました");
    router.push("/recipes");
  }

  if (!user) {
    return <p>ログインしていません</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main style={{ padding: "1rem" }}>
      <h1>レシピ詳細</h1>
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
      <button onClick={handleUpdate} style={{ marginRight: "1rem" }}>
        更新
      </button>
      <button onClick={handleDelete} style={{ backgroundColor: "red", color: "#fff" }}>
        削除
      </button>
    </main>
  );
}
