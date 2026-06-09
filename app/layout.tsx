import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Echoes of Tomorrow — Messages Across Time",
  description:
    "A private space to communicate with your future self. Write echoes, lock time capsules, explore parallel lives, and let your future self respond.",
  keywords: ["future self", "time capsule", "journaling", "reflection", "AI", "self-development"],
  authors: [{ name: "Echoes of Tomorrow" }],
  openGraph: {
    title: "Echoes of Tomorrow",
    description: "Messages across time",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
