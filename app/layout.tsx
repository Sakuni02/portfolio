import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { RouteScrollReset } from "@/components/providers/RouteScrollReset";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SITE_NAME } from "@/lib/constants";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Architectural Pencil Drawing`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Luxury architectural pencil drawing studio — hand-rendered perspectives, elevations, and conceptual studies.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SmoothScrollProvider>
            <RouteScrollReset />
            <CustomCursor />
            <Navbar />
            <main>{children}</main>
            <Footer />
            {modal}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
