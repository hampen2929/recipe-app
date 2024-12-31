// app/page.tsx
"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext"; // 先に作成済みの UserContext

export default function HomePage() {
  const { user } = useUser();

  // ユーザーがログイン中かどうかで表示を切り替える
  const isLoggedIn = !!user;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Welcome to My Recipe App</h1>
      <p>
        ここではレシピの管理・買い物リスト作成などができます。
      </p>

      {isLoggedIn ? (
        // もしログイン中であれば、ユーザー向けのメッセージやリンクを表示
        <div style={{ marginTop: "1rem" }}>
          <p>ログイン中です: {user.email}</p>
          <p>ご利用ありがとうございます！</p>
          {/* ここに /recipes や /profile などのリンクを置いてもOK */}
          <Link href="/recipes" style={{ marginRight: "1rem" }}>
            レシピ一覧へ
          </Link>
        </div>
      ) : (
        // まだログインしていない場合
        <div style={{ marginTop: "1rem" }}>
          <p>まずはアカウントを作成 or ログインしてください。</p>
          <Link href="/signup" style={{ marginRight: "1rem" }}>
            サインアップ
          </Link>
          <Link href="/login">ログイン</Link>
        </div>
      )}
    </main>
  );
}
