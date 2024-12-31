"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

interface ShoppingList {
  id: string;
  created_at: string;
}

export default function ShoppingListIndex() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    async function fetchLists() {
      const { data, error } = await supabase
        .from("shopping_lists")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else if (data) {
        setLists(data as ShoppingList[]);
      }
    }

    fetchLists();
  }, [user]);

  if (!user) return <p>ログインしてください。</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>買い物リスト一覧</h1>
      <Link href="/shopping-list/create">新規作成</Link>
      <ul style={{ marginTop: "1rem" }}>
        {lists.map((list) => (
          <li key={list.id}>
            <Link href={`/shopping-list/${list.id}`}>
              {list.id} （{list.created_at}）
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
