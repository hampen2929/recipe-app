// src/app/test-supabase/page.tsx

import { supabase } from '@/lib/supabaseClient';

export default async function TestSupabasePage() {
  // サーバーコンポーネントで直接 Supabase クライアントを呼ぶ例
  // (ただし Auth など一部の操作はクライアントコンポーネント側で行うことが多いです)
  
  // ① test_table から全件SELECTしてみる
  const { data, error } = await supabase.from('test_table').select('*');

  if (error) {
    console.error('Supabase Error:', error);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Test Supabase Connection</h1>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
