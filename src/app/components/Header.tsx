// src/app/components/Header.tsx
"use client";

import { useUser } from '@/context/UserContext';
import LogoutButton from './LogoutButton';

export default function Header() {
  const { user } = useUser();

  return (
    <header style={{ padding: '1rem', background: '#efefef' }}>
      <h2>My App Header</h2>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <LogoutButton />
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </header>
  );
}
