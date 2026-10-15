"use client";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import scholarData from "@/data/scholar.json";

const chartConfig = {
  citations: {
    label: "Citations",
    color: "#ea4f1a",
  },
} satisfies ChartConfig;

export default function ScholarSection() {
  const { totalCitations, hIndex, citationHistory } = scholarData;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Citations Graph Card */}
      <div
        className="rounded-[14px] bg-card overflow-hidden"
        style={{ boxShadow: "var(--ring-card)" }}
      >
        <div className="flex flex-col items-stretch border-b border-border p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1.5 px-6 py-4 sm:py-5">
            <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Google Scholar Citations
            </div>
            <div className="text-xs text-muted-foreground">
              Citations per year
            </div>
          </div>
          <div className="flex border-t border-border sm:border-t-0">
            <div className="flex flex-col justify-center gap-1 border-border px-6 py-4 text-left sm:border-l sm:px-8 sm:py-5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Total Citations
              </span>
              <span className="text-lg font-medium font-sans tracking-tight tabular-nums text-neutral-800 dark:text-neutral-100 sm:text-xl">
                {totalCitations.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col justify-center gap-1 border-l border-border px-6 py-4 text-left sm:px-8 sm:py-5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                h-index
              </span>
              <span className="text-lg font-medium font-sans tracking-tight tabular-nums text-neutral-800 dark:text-neutral-100 sm:text-xl">
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
                fill="#ea4f1a"
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </div>
    </div>
  );
}
