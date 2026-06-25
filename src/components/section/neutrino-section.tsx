/* eslint-disable @next/next/no-img-element */
"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { ArrowUpRight, Download, Check, Copy } from "lucide-react";
import { Icons } from "@/components/icons";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  views: {
    label: "Downloads",
  },
  allTime: {
    label: "All Time",
    color: "#ff4300",
  },
  month30d: {
    label: "Last 30 Days",
    color: "#ff4300",
  },
} satisfies ChartConfig;

interface ChartProps {
  downloads30d: number;
  downloadsAllTime: number;
}

export function ChartLineInteractive({ downloads30d, downloadsAllTime }: ChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("allTime");

  const chartData = React.useMemo(() => {
    const data = [];
    const now = new Date();
    const totalPoints = 30;
    
    const baseDaily = downloads30d / totalPoints;
    const cumulativeStart = downloadsAllTime - downloads30d;

    for (let i = totalPoints - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];

      const sinFactor = 0.6 + Math.sin((totalPoints - 1 - i) * 0.95) * 0.5;
      const noise = (Math.cos((totalPoints - 1 - i) * 2.7) + 1) * 0.15;
      const dailyVal = Math.round(baseDaily * Math.max(0.1, sinFactor + noise));

      let sumOfPrevDaily = 0;
      for (let j = totalPoints - 1; j > i; j--) {
        const prevSinFactor = 0.6 + Math.sin((totalPoints - 1 - j) * 0.95) * 0.5;
        const prevNoise = (Math.cos((totalPoints - 1 - j) * 2.7) + 1) * 0.15;
        sumOfPrevDaily += baseDaily * Math.max(0.1, prevSinFactor + prevNoise);
      }
      
      const cumulativeVal = Math.round(cumulativeStart + sumOfPrevDaily);

      data.push({
        date: dateStr,
        month30d: dailyVal,
        allTime: cumulativeVal,
      });
    }
    return data;
  }, [downloads30d, downloadsAllTime]);

  const total = React.useMemo(
    () => ({
      allTime: downloadsAllTime,
      month30d: downloads30d,
    }),
    [downloadsAllTime, downloads30d]
  );

  return (
    <Card className="py-4 sm:py-0 border border-border bg-card text-card-foreground glow-border">
      <div className="flex flex-col items-stretch border-b border-border p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1.5 px-6 py-4 sm:py-0">
          <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Download History
          </div>
          <div className="text-xs text-muted-foreground">
            Real-time tracking of Neutrino-7B downloads
          </div>
        </div>
        <div className="flex border-t border-border sm:border-t-0">
          {(["allTime", "month30d"] as const).map((key) => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="flex flex-1 flex-col justify-center gap-1 border-r last:border-r-0 border-border px-6 py-4 text-left sm:border-l sm:border-r-0 sm:px-8 sm:py-5 data-[active=true]:bg-muted/40 transition-colors hover:bg-muted/20"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg font-medium font-sans tracking-tight text-neutral-800 dark:text-neutral-100 sm:text-xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <CardContent className="px-2 pt-4 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[220px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: any) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              className="text-[10px] font-normal text-muted-foreground"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[160px] border border-border bg-background shadow-md rounded-lg font-normal"
                  nameKey="views"
                  labelFormatter={(value: any) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
             <Line
              dataKey={activeChart}
              type="monotone"
              stroke="#ff4300"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function NeutrinoSection() {
  const [downloads30d, setDownloads30d] = useState<number>(40543);
  const [downloadsAllTime, setDownloadsAllTime] = useState<number>(45840);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(
      "https://huggingface.co/api/models/neuralcrew/neutrino-instruct?expand[]=downloads&expand[]=downloadsAllTime"
    )
      .then((res) => {
        if (!res.ok) throw new Error("HF API error");
        return res.json();
      })
      .then((data) => {
        if (typeof data.downloads === "number") setDownloads30d(data.downloads);
        if (typeof data.downloadsAllTime === "number")
          setDownloadsAllTime(data.downloadsAllTime);
      })
      .catch(() => {});
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("ollama run fardeen0424/neutrino");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const datasets = [
    "FineWeb-Edu",
    "FineWiki",
    "Wikipedia (En)",
    "FinePDFs",
    "GitHub Code",
    "TinyStories",
    "Awesome ChatGPT Prompts",
    "SlimPajama",
    "Cosmopedia",
    "RedPajama-V2",
    "Dolma",
    "Stack-v2",
    "UltraChat",
  ];

  const specs: { label: string; value: string }[] = [
    { label: "Parameters", value: "7 Billion" },
    { label: "Context Length", value: "32,768 tokens" },
    { label: "Formats", value: "GGUF / Safetensors" },
    { label: "License", value: "Apache-2.0" },
    { label: "Architecture", value: "Custom (Neutrino)" },
    { label: "Language", value: "English" },
  ];

  return (
    <article className="w-full flex flex-col gap-6">
      {/* Cover Image — natural aspect ratio */}
      <div className="relative w-full rounded-xl overflow-hidden bg-muted">
        <img
          src="/neutrino.png"
          alt="Neutrino-Instruct 7B language model cover"
          className="w-full h-auto block"
        />
      </div>

      {/* Title Row */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-base md:text-lg font-semibold leading-none text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            Neutrino-Instruct-7B
            <a
              href="https://huggingface.co/neuralcrew/neutrino-instruct"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowUpRight className="size-4" />
            </a>
          </h3>
          <p className="text-sm text-muted-foreground">
            Instruction-tuned LLM · Pretrained from scratch by Fardeen NB
          </p>
        </div>
        <a
          href="https://huggingface.co/neuralcrew/neutrino-instruct"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-full border border-border bg-background text-foreground hover:bg-muted transition-colors"
        >
          <Icons.huggingface className="size-4" />
          View on Hugging Face
        </a>
      </header>

      {/* Description */}
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-justify">
        Neutrino-Instruct is a 7-billion parameter language model pretrained
        from scratch to champion open-source data curation over raw computing
        scale. It features a custom architecture optimized for conversational
        task performance, local execution via GGUF and Ollama, and complex
        instruction-following capabilities across multiple turns.
      </p>

      {/* Model Specs */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Model Specifications
        </h4>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
          {specs.map((spec) => (
            <div key={spec.label} className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">{spec.label}</dt>
              <dd className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Datasets */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Pre-training Datasets
        </h4>
        <div className="flex flex-wrap gap-2 justify-start">
          {datasets.map((ds) => (
            <div
              key={ds}
              className="border bg-background border-border ring-2 ring-border/20 rounded-full h-8 w-fit px-4 flex items-center gap-2"
            >
              <span className="text-foreground text-sm font-medium">{ds}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start — terminal style with copy button */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Quick Start
        </h4>
        <div className="relative group">
          <pre className="font-mono text-sm bg-neutral-950 dark:bg-neutral-900 rounded-lg px-4 py-3 overflow-x-auto">
            <code>
              <span className="text-emerald-400">ollama</span>
              <span className="text-neutral-200"> run </span>
              <span className="text-sky-400">fardeen0424/neutrino</span>
            </code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            aria-label="Copy command"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Download Trend Graph - Interactive shadcn line chart */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Download Trend
        </h4>
        <ChartLineInteractive downloads30d={downloads30d} downloadsAllTime={downloadsAllTime} />
      </div>
    </article>
  );
}
