"use client";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BookOpen } from "lucide-react";
import scholarData from "@/data/scholar.json";

interface Publication {
  title: string;
  authors: string;
  journal: string;
  citations: string;
  year: string;
}

const chartConfig = {
  citations: {
    label: "Citations",
    color: "#ff4300",
  }
} satisfies ChartConfig;

// Helper to clean and format titles into Title Case with support for AI abbreviations
function formatTitle(title: string): string {
  if (title !== title.toUpperCase()) return title;
  
  const minorWords = ["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "by", "for", "from", "in", "of", "with"];
  const acronyms = ["llm", "llms", "ai", "bert", "gpt-3", "gguf", "rag"];

  return title
    .toLowerCase()
    .split(" ")
    .map((word, idx) => {
      // Strip punctuation to check for minor words or acronyms
      const cleanWord = word.replace(/[^a-zA-Z0-9-]/g, "");
      if (acronyms.includes(cleanWord)) {
        return word.toUpperCase();
      }
      if (minorWords.includes(cleanWord) && idx !== 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export default function ScholarSection() {
  const { totalCitations, hIndex, citationHistory, publications } = scholarData;

  // Filter out empty titles, format all titles, and sort descending by year
  const processedPublications = React.useMemo(() => {
    return (publications as Publication[])
      .filter((pub) => pub.title.trim() !== "")
      .map((pub) => ({
        ...pub,
        title: formatTitle(pub.title)
      }))
      .sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA; // Newest first
      });
  }, [publications]);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Citations Graph Card */}
      <Card className="py-4 sm:py-0 border border-border bg-card text-card-foreground glow-border">
        <div className="flex flex-col items-stretch border-b border-border p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1.5 px-6 py-4 sm:py-5">
            <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Google Scholar Citations
            </div>
            <div className="text-xs text-muted-foreground">
              Year-by-year citation metric tracking
            </div>
          </div>
          <div className="flex border-t border-border sm:border-t-0">
            <div className="flex flex-col justify-center gap-1 border-border px-6 py-4 text-left sm:border-l sm:px-8 sm:py-5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Total Citations
              </span>
              <span className="text-lg font-medium font-sans tracking-tight text-neutral-800 dark:text-neutral-100 sm:text-xl">
                {totalCitations.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col justify-center gap-1 border-l border-border px-6 py-4 text-left sm:px-8 sm:py-5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                h-index
              </span>
              <span className="text-lg font-medium font-sans tracking-tight text-neutral-800 dark:text-neutral-100 sm:text-xl">
                {hIndex}
              </span>
            </div>
          </div>
        </div>
        <CardContent className="px-2 pt-4 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[180px] w-full"
          >
            <BarChart
              data={citationHistory}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px] font-normal text-muted-foreground"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[140px] border border-border bg-background shadow-md rounded-lg font-normal"
                    nameKey="citations"
                  />
                }
              />
              <Bar
                dataKey="citations"
                fill="#ff4300"
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Publications Cards Grid */}
      <div className="flex flex-col gap-4">
        {processedPublications.map((pub, idx) => (
          <div
            key={idx}
            className="border border-border rounded-xl py-6 px-6 flex flex-col sm:flex-row justify-between gap-6 bg-background transition-colors hover:bg-muted/10 glow-border"
          >
            <div className="flex flex-col gap-3 min-w-0">
              {/* Publication Title */}
              <div className="text-sm sm:text-base font-semibold leading-snug text-neutral-800 dark:text-neutral-200">
                {pub.title}
              </div>
              {/* Authors */}
              <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                {pub.authors}
              </div>
              {/* Journal / Venue name */}
              {pub.journal && (
                <div className="text-xs sm:text-sm text-muted-foreground italic flex items-center gap-1.5 mt-1">
                  <BookOpen className="size-3.5 flex-shrink-0" />
                  <span className="truncate">{pub.journal}</span>
                </div>
              )}
            </div>

            {/* Year Metadata */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0 text-right">
              {pub.year && (
                <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-full px-2.5 py-0.5 sm:px-0 sm:py-0 sm:bg-transparent">
                  {pub.year}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
