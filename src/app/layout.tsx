import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cosmed",
  description: "화장품 쇼핑 웹사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
