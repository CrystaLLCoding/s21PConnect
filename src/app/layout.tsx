import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeerConnect 21 — School 21 Anonim Autentifikatsiya & Matchmaking",
  description: "School 21 startapchilari uchun anonim autentifikatsiya, loyihalar va o‘zaro rozilik orqali jamoa shakllantirish platformasi.",
  keywords: ["School 21", "PeerConnect 21", "Tashkent", "Samarkand", "École 42", "Anonim", "Startups", "Coding"],
  authors: [{ name: "School 21 Community" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[#080B11] text-slate-100 selection:bg-[#00F5A0]/30 selection:text-[#00F5A0] font-sans">
        {children}
      </body>
    </html>
  );
}
