"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";
import Link from "next/link"; // リンク用

interface Recipe {
  id: string;
  title: string;
  description?: string;
  user_id?: string;
  created_at?: string;
  // 必要に応じて追加
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    async function fetchRecipes() {
      if (!user) return;

      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else if (data) {
        setRecipes(data);
      }
    }

    fetchRecipes();
  }, [user]);

  if (!user) {
    return <p>ログインしていません。ログインしてください。</p>;
  }

  return (
    <main style={{ padding: "1rem" }}>
      <h1>My Recipes</h1>

      {/* 新規レシピ作成ページへの導線を追加 */}
      <Link href="/recipes/create" style={{ marginBottom: "1rem", display: "inline-block" }}>
        <button>レシピを新規作成</button>
      </Link>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {recipes.length === 0 ? (
        <p>まだレシピがありません。</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id} style={{ marginBottom: "1rem" }}>
              <strong>{recipe.title}</strong>
              <p>{recipe.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
