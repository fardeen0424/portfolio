import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter_Tight, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import SmoothScroll from "@/components/smooth-scroll";
import ScrollProgressLine from "@/components/ScrollProgressLine";
import SchemaMarkup from "@/components/SchemaMarkup";
import GoogleSearchConsole from "@/components/GoogleSearchConsole";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: "Fardeen NB - AI Scientist, Researcher & Tech Entrepreneur",
    template: `%s | ${DATA.name}`,
  },
  description: "Official website of Fardeen NB (Fardeen Noor Basha). AI Scientist at Mercurion AI, creator of Neutrino-Instruct, and researcher specializing in transformer architectures.",
  openGraph: {
    title: "Fardeen NB - AI Scientist, Researcher & Tech Entrepreneur",
    description: "Official website of Fardeen NB (Fardeen Noor Basha). AI Scientist at Mercurion AI, creator of Neutrino-Instruct, and researcher specializing in transformer architectures.",
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/me.png",
        width: 800,
        height: 800,
        alt: "Fardeen NB",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Fardeen NB - AI Scientist, Researcher & Tech Entrepreneur",
    card: "summary_large_image",
    images: ["/me.png"],
  },
  verification: {
    google: "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SchemaMarkup />
        <GoogleSearchConsole />
        <link rel="preload" as="image" href="/me.png" fetchPriority="high" />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative",
          interTight.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>
            <SmoothScroll>
              {/* Far left vertical flickering grid */}
              <div 
                className="hidden md:block fixed top-0 bottom-0 left-0 w-[300px] overflow-hidden z-0 pointer-events-none"
                style={{
                  maskImage: "linear-gradient(to right, black, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, black, transparent)",
                }}
              >
                <FlickeringGrid
                  className="h-full w-full"
                  squareSize={4}
                  gridGap={3}
                  color="#f97316"
                  maxOpacity={0.3}
                />
              </div>
              {/* Far right vertical flickering grid */}
              <div 
                className="hidden md:block fixed top-0 bottom-0 right-0 w-[300px] overflow-hidden z-0 pointer-events-none"
                style={{
                  maskImage: "linear-gradient(to left, black, transparent)",
                  WebkitMaskImage: "linear-gradient(to left, black, transparent)",
                }}
              >
                <FlickeringGrid
                  className="h-full w-full"
                  squareSize={4}
                  gridGap={3}
                  color="#f97316"
                  maxOpacity={0.3}
                />
              </div>

              <div className="relative z-10 max-w-2xl mx-auto min-h-screen">
                {/* Left dashed line running full height */}
                <div className="absolute top-0 bottom-0 left-0 border-l-[1.5px] border-dashed border-neutral-500/40 dark:border-[#5e5e5e] pointer-events-none z-10" />
                {/* Right dashed line running full height */}
                <div className="absolute top-0 bottom-0 right-0 border-r-[1.5px] border-dashed border-neutral-500/40 dark:border-[#5e5e5e] pointer-events-none z-10" />
                
                <div className="relative z-10 pt-20 pb-24 sm:pt-28 sm:pb-24 px-6">
                  {children}
                </div>
              </div>
              <Navbar />
              <ScrollProgressLine />
              <div 
                className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent backdrop-blur-2xl z-20"
                style={{
                  maskImage: "linear-gradient(to top, black, transparent)",
                  WebkitMaskImage: "linear-gradient(to top, black, transparent)",
                }}
              />
            </SmoothScroll>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
