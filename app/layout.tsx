import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Ticker } from "@/components/custom/Ticker";
import { DesktopSidebar } from "@/components/custom/DesktopSidebar";
import { MobileHeader } from "@/components/custom/MobileHeader";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DataPulse — Live API Dashboard",
    template: "%s | DataPulse",
  },
  description:
    "Real-time dashboard aggregating live data from public APIs: aviation, crypto, weather, and more.",
  keywords: ["live data", "api dashboard", "crypto", "aviation", "weather"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", inter.variable, geistMono.variable)}
    >
      <body className="h-full flex flex-col bg-background text-foreground">
        <TooltipProvider delay={300}>
          <Ticker />

          {/* App shell: sidebar + content */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Desktop sidebar — hidden on mobile */}
            <DesktopSidebar />

            {/* Right column */}
            <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
              {/* Mobile top bar — hidden on desktop */}
              <MobileHeader />

              {/* Page content */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
