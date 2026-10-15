import DynamicIsland from "@/components/dynamic-island";
import RailToc from "@/components/ui/rail-toc";
import Switch from "@/components/Switch";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Inter_Tight, Geist_Mono, Instrument_Serif } from "next/font/google";
import "@microcharts/react/styles.css";
import "./globals.css";
import SchemaMarkup from "@/components/SchemaMarkup";
import RulerScrollbar from "@/components/RulerScrollbar";
import { PAGE_SECTIONS } from "@/data/sections";
import GoogleSearchConsole from "@/components/GoogleSearchConsole";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const SEO_TITLE = "Fardeen NB – AI Engineer | Production LLMs & Model Training";
const SEO_DESCRIPTION =
  "AI Engineer in Cincinnati, OH. Fardeen NB builds production LLM systems and pre-trained Neutrino-Instruct, an open 7B-parameter model, from scratch.";

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: SEO_TITLE,
    template: `%s | ${DATA.name}`,
  },
  description: SEO_DESCRIPTION,
  applicationName: DATA.name,
  authors: [{ name: DATA.name, url: DATA.url }],
  creator: DATA.name,
  keywords: [
    "Fardeen NB",
    "Fardeen Noor Basha",
    "AI Engineer",
    "LLM engineer",
    "RAG",
    "AI agents",
    "LLM pre-training",
    "Neutrino-Instruct",
    "transformer architecture",
    "long-range dependencies",
    "large language models",
    "Cincinnati AI researcher",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    url: DATA.url,
    siteName: DATA.name,
    locale: "en_US",
    type: "profile",
    firstName: "Fardeen",
    lastName: "NB",
    images: [
      {
        url: "/me.png",
        width: 800,
        height: 800,
        alt: "Fardeen NB, AI Engineer",
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
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: ["/me.png"],
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
          geistSans.variable,
          interTight.variable,
          geistMono.variable,
          instrumentSerif.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>
            <div className="relative z-10 max-w-2xl mx-auto min-h-screen">
              <div className="relative z-10 pt-20 pb-24 sm:pt-28 sm:pb-24 px-6">
                 {children}
              </div>
            </div>
            {/* Top fade behind the island, mirroring the bottom one */}
            <div
              className="pointer-events-none fixed inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-background via-background/80 to-transparent backdrop-blur-xl sm:h-28"
              style={{
                maskImage: "linear-gradient(to bottom, black, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
              }}
            />
            <DynamicIsland />
            {/* Section rail in the left margin, from the width where the island stops being a menu */}
            <div className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block xl:left-8 2xl:left-12">
              <RailToc
                items={PAGE_SECTIONS.map((section) => ({ id: section.id, label: section.short }))}
                offset={96}
              />
            </div>
            {/* Outside the z-10 content wrapper so it stacks above the bottom fade */}
            <RulerScrollbar sections={PAGE_SECTIONS} />
            {/* Theme switch, anchored bottom-left above the bottom fade */}
            <div className="fixed bottom-5 left-5 z-50 sm:bottom-6 sm:left-6">
              <Switch />
            </div>
            <div 
              className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent backdrop-blur-2xl z-20"
              style={{
                maskImage: "linear-gradient(to top, black, transparent)",
                WebkitMaskImage: "linear-gradient(to top, black, transparent)",
              }}
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
