"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";

interface ShoppingListItem {
  id: string;
  name: string;
  quantity?: string;
  is_purchased: boolean;
}

export default function ShoppingListDetail() {
  const { id: listId } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("");

  useEffect(() => {
    if (!user) return;

    async function fetchItems() {
      const { data, error } = await supabase
        .from("shopping_list_items")
        .select("*")
        .eq("shopping_list_id", listId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
      } else if (data) {
        setItems(data as ShoppingListItem[]);
      }
    }

    fetchItems();
  }, [user, listId]);

  async function handleAddItem() {
    if (!newItemName) return;

    const { data, error } = await supabase
      .from("shopping_list_items")
      .insert([
        {
          shopping_list_id: listId,
          name: newItemName,
          quantity: newItemQty,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }
    // state更新
    setItems((prev) => [...prev, data]);
    setNewItemName("");
    setNewItemQty("");
  }

  async function togglePurchased(itemId: string, currentVal: boolean) {
    const { data, error } = await supabase
      .from("shopping_list_items")
      .update({ is_purchased: !currentVal })
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, ...data } : i))
    );
  }

  async function handleDeleteItem(itemId: string) {
    const { error } = await supabase
      .from("shopping_list_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      alert(error.message);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  if (!user) {
    return <p>ログインしてください。</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>買い物リスト: {listId}</h1>

      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          placeholder="アイテム名"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="数量 (optional)"
          value={newItemQty}
          onChange={(e) => setNewItemQty(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={handleAddItem}>追加</button>
      </div>

      <ul style={{ paddingLeft: "1rem" }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.5rem" }}>
            <label style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={item.is_purchased}
                onChange={() => togglePurchased(item.id, item.is_purchased)}
                style={{ marginRight: "0.5rem" }}
              />
              <strong style={{ marginRight: "0.5rem" }}>{item.name}</strong>
              {item.quantity && <span>({item.quantity})</span>}
            </label>
            <button
              onClick={() => handleDeleteItem(item.id)}
              style={{ marginLeft: "1rem", color: "red" }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
