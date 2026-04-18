import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Theo Codex · Multi-Agent Coding Workspace",
  description:
    "Production-oriented architecture foundation for a multi-agent, multi-model coding application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
