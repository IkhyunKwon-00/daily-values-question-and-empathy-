import type { Metadata } from "next";
import { Cormorant_Garamond, Gowun_Batang } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-logo",
  display: "swap",
});

const gowunBatang = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-voice",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "weve",
    template: "%s · weve",
  },
  description:
    "사람을 만나기 전에, 그 사람의 생각을 만나는 가치관 기반 소셜 서비스.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${cormorant.variable} ${gowunBatang.variable}`}>
      <body>{children}</body>
    </html>
  );
}
