// src/context/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

// Contextで管理するデータの型
interface UserContextValue {
  user: User | null;
  session: Session | null;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  session: null,
});

// Contextを提供するProviderコンポーネント
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // アプリ初期化時に現在のセッションを取得
    supabase.auth.getSession().then(({ data, error }) => {
      if (!error && data?.session) {
        setSession(data.session);
        setUser(data.session.user ?? null);
      }
    });

    // ログイン／ログアウトなど、認証状態が変わるたびにコールバック
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession ?? null);
        setUser(currentSession?.user ?? null);
      }
    );

    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, session }}>
      {children}
    </UserContext.Provider>
  );
}

// Contextを利用するためのヘルパーフック
export function useUser() {
  return useContext(UserContext);
}
