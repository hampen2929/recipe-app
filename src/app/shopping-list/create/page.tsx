"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";

export default function CreateShoppingList() {
  const router = useRouter();
  const { user } = useUser();

  async function handleCreate() {
    if (!user) {
      alert("ログインしていません");
      return;
    }

    // shopping_listsにINSERT
    const { data, error } = await supabase.from("shopping_lists").insert([
      { user_id: user.id },
    ]).select().single();

    if (error) {
      alert(error.message);
      return;
    }

    // 作成後、そのショッピングリストの詳細ページに移動するイメージ
    router.push(`/shopping-list/${data.id}`);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>新しい買い物リストを作成</h1>
      <button onClick={handleCreate}>Create List</button>
    </div>
  );
}
