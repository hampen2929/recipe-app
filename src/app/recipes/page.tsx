// src/app/recipes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    // 自分のレシピを取得
    async function fetchRecipes() {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id) // RLSが効いていれば eq() 無しでもOK
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else if (data) {
        setRecipes(data as Recipe[]);
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
      <Link href="/recipes/create" style={{ marginBottom: "1rem", display: "inline-block" }}>
        新規レシピ作成
      </Link>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {recipes.length === 0 ? (
        <p>まだレシピがありません。</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id} style={{ marginBottom: "1rem" }}>
              <Link href={`/recipes/${recipe.id}`}>
                <strong>{recipe.title}</strong>
              </Link>
              <p>{recipe.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
