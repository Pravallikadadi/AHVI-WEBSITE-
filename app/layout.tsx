import type { Metadata } from "next";
import { ToastProvider } from "@/lib/toast";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { NetworkStatus } from "@/components/network-status";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AHVI — Your Personal AI Stylist", template: "%s | AHVI" },
  description:
    "AHVI is your personal AI stylist that understands your wardrobe, your style and your lifestyle — helping you decide what to wear, what to buy and what to keep.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <SmoothScroll />
          <NetworkStatus />
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
