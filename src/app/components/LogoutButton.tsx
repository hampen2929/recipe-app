// src/app/components/LogoutButton.tsx
"use client";

import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    // セッションが変わったのでApp Routerの場合、router.refresh()で再描画
    router.refresh();
  }

  return <button onClick={handleLogout}>Logout</button>;
}
