import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import fs from "fs";
import path from "path";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Read site config for metadata
function getSiteConfig() {
  try {
    const filePath = path.join(process.cwd(), "data", "site.json");
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return {
      siteName: "Live At Probolinggo",
      tagline: "Dari Warga Untuk Warga",
      seoDescription: "Portal layanan warga Probolinggo",
      seoKeywords: "probolinggo, layanan warga",
    };
  }
}

const site = getSiteConfig();

export const metadata: Metadata = {
  title: `${site.siteName} — ${site.tagline}`,
  description: site.seoDescription,
  keywords: site.seoKeywords,
  openGraph: {
    title: `${site.siteName} — ${site.tagline}`,
    description: site.seoDescription,
    type: "website",
    locale: "id_ID",
    siteName: site.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.siteName} — ${site.tagline}`,
    description: site.seoDescription,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: site.siteName,
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Prevent FOUC for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
