import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Notadebayo - Aplikasi Notepad Digital",
  description: "Aplikasi notepad dan to-do list digital yang modern dan powerful",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={fontSans.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
