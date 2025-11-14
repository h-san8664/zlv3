import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZonaLapak - Toko Online Management System",
  description: "Sistem manajemen toko online lengkap dengan fitur pesanan dan inventaris",
  keywords: ["ZonaLapak", "Toko Online", "E-commerce", "Management System", "Next.js"],
  authors: [{ name: "ZonaLapak Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "ZonaLapak - Toko Online Management System",
    description: "Sistem manajemen toko online lengkap dengan fitur pesanan dan inventaris",
    url: "https://chat.z.ai",
    siteName: "ZonaLapak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZonaLapak - Toko Online Management System",
    description: "Sistem manajemen toko online lengkap dengan fitur pesanan dan inventaris",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
