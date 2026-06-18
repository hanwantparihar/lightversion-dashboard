import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AlertProvider } from "@/contexts/alert-context";
import { siteConfig } from "@/config/site";
import { generateBrandCssVars } from "@/config/colors";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Inject brand CSS variables from src/config/colors.ts */}
      <head>
        <style dangerouslySetInnerHTML={{ __html: generateBrandCssVars() }} />
      </head>
      <body className={`${plusJakarta.variable} font-sans`}>
        <ThemeProvider>
          <AlertProvider>{children}</AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
