// src/hooks/useSupabaseUser.ts
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// カスタムフック：ログイン中ユーザーの情報を返す
export function useSupabaseUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
      } else {
        setUser(data.user);
      }
    }

    fetchUser();

    // onAuthStateChange でリアルタイムに状態変化を拾う
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
      }
    );

    // クリーンアップ
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return user;
}
