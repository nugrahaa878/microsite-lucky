import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sasa Event Microsite - Product Knowledge & Lucky Draw",
  description: "Sasa event microsite with product knowledge, recipes, and lucky draw registration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
