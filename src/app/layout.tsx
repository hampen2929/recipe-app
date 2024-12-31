// app/layout.tsx (例)
import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Recipe App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Header />
          <main className="min-h-screen bg-gray-50 p-4">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
