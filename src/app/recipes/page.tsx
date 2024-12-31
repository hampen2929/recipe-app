"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    // userがnullなら何もしない
    if (!user) return;

    // userが存在する場合のみ処理を行う
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
