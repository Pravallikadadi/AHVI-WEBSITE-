import type { Metadata } from "next";
import { Suspense } from "react";
import { ToastProvider } from "@/lib/toast";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { NetworkStatus } from "@/components/network-status";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AuthPopup } from "@/components/auth/auth-popup";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AHVI — Your Personal AI Stylist", template: "%s | AHVI" },
  description:
    "AHVI is your personal AI stylist that understands your wardrobe, your style and your lifestyle — helping you decide what to wear, what to buy and what to keep.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Anton.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <SmoothScroll />
          <NetworkStatus />
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <ToastProvider>
            <AuthProvider>
              {children}
              <AuthPopup />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}