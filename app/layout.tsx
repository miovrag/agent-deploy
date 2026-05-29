import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Deploy — CustomGPT.ai",
  description: "Deploy your AI agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.29.0/dist/tabler-icons.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
