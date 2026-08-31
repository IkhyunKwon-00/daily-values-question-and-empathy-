import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-logo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "오늘의 가치관",
  description:
    "매일 하나의 가치관 질문에 답을 남기는 저널 앱. 외모가 아닌 생각과 가치관으로 먼저 연결됩니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={caveat.variable}>
      <body>{children}</body>
    </html>
  );
}
