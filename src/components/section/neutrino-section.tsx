/* eslint-disable @next/next/no-img-element */
"use client";
import * as React from "react";
import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Icons } from "@/components/icons";
import { estimateDownloadSeries, useModelDownloads } from "@/lib/model-downloads";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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
    color: "#ea4f1a",
  },
  month30d: {
    label: "Last 30 Days",
    color: "#ea4f1a",
  },
} satisfies ChartConfig;

interface ChartProps {
  downloads30d: number;
  downloadsAllTime: number;
}

export function ChartLineInteractive({ downloads30d, downloadsAllTime }: ChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("allTime");

  const chartData = React.useMemo(
    () => estimateDownloadSeries({ last30Days: downloads30d, allTime: downloadsAllTime }),
    [downloads30d, downloadsAllTime]
  );

  const total = React.useMemo(
    () => ({
      allTime: downloadsAllTime,
      month30d: downloads30d,
    }),
    [downloadsAllTime, downloads30d]
  );

  return (
    <div
      // The Dynamic Island switches to its downloads sparkline when this card scrolls in.
      id="downloads"
      className="rounded-[14px] bg-card overflow-hidden"
      style={{ boxShadow: "var(--ring-card)" }}
    >
      <div className="flex flex-col items-stretch border-b border-border p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1.5 px-6 py-4 sm:py-5">
          <div className="text-sm font-semibold text-foreground">
            Download Analytics
          </div>
          <div className="text-xs text-muted-foreground">
            Totals from the Hugging Face API. The daily curve is an estimate.
          </div>
        </div>
        <div className="flex border-t border-border sm:border-t-0">
          {(["allTime", "month30d"] as const).map((key) => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="flex flex-1 flex-col justify-center gap-1 border-r last:border-r-0 border-border px-6 py-4 text-left sm:border-l sm:border-r-0 sm:px-8 sm:py-5 data-[active=true]:bg-muted/40 transition-[colors,transform] duration-150 active:scale-[0.98] hover:bg-muted/20 cursor-pointer"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground font-mono">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg font-medium font-sans tracking-tight tabular-nums text-foreground sm:text-xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-2 pt-4 sm:p-6">
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
              className="text-[10px] font-normal text-muted-foreground font-mono"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] border border-border bg-background shadow-md rounded-lg font-normal"
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
              stroke="#ea4f1a"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}

export default function NeutrinoSection() {
  const { last30Days: downloads30d, allTime: downloadsAllTime } = useModelDownloads();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = "ollama run fardeen0424/neutrino";
    if (typeof window !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Clipboard copy failed: ", err);
        });
    } else {
      // Fallback copy method for non-secure contexts
      try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      }
    }
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
    { label: "Formats", value: "GGUF · Safetensors" },
    { label: "License", value: "Apache-2.0" },
    { label: "Architecture", value: "Custom (Neutrino)" },
    { label: "Language", value: "English" },
  ];

  return (
    <article className="w-full flex flex-col gap-6">
      {/* Model Overview Card */}
      <div
        className="rounded-[14px] bg-card px-6 py-7 sm:px-8 sm:py-8"
        style={{ boxShadow: "var(--ring-card)" }}
      >
        {/* Cover Image: concentric border radius with clean image outline */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-muted outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10 mb-6 transition-transform duration-300 hover:scale-[1.005]">
          <img
            src="/neutrino.png"
            alt="Neutrino-Instruct 7B language model cover"
            className="w-full h-auto block rounded-[15px]"
          />
        </div>

        {/* Header row: resume layout with right-aligned action */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-[22px] font-normal leading-tight tracking-tight text-foreground font-serif italic">
                Neutrino-Instruct
              </h3>
              <a
                href="https://huggingface.co/neuralcrew/neutrino-instruct"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
                aria-label="View Neutrino-Instruct on Hugging Face"
              >
                <ArrowUpRight className="size-4" />
              </a>
            </div>
            <p className="text-sm font-medium leading-snug text-muted-foreground font-sans">
              7B instruction-tuned language model · Pre-trained from scratch
            </p>
          </div>
          <a
            href="https://huggingface.co/neuralcrew/neutrino-instruct"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full border border-border bg-background text-foreground hover:bg-muted transition-[colors,transform] duration-150 active:scale-[0.96]"
          >
            <Icons.huggingface className="size-4" />
            <span>Hugging Face</span>
          </a>
        </div>

        {/* Separation line */}
        <div className="-mx-6 sm:-mx-8 border-b border-border my-6" />

        {/* Narrative Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
          Neutrino-Instruct is a 7-billion-parameter language model that I pre-trained and post-trained from scratch. The project tests how far careful curation of open data can go without frontier-scale compute. It uses a custom architecture tuned for multi-turn conversation and instruction following, and it runs locally through GGUF and Ollama.
        </p>

        {/* Separation line */}
        <div className="-mx-6 sm:-mx-8 border-b border-border my-6" />

        {/* Model Specifications */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground font-sans">
            Model Specifications
          </h4>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            {specs.map((spec) => (
              <div key={spec.label} className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground font-mono">{spec.label}</dt>
                <dd className="text-sm font-medium text-foreground font-mono tabular-nums">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Separation line */}
        <div className="-mx-6 sm:-mx-8 border-b border-border my-6" />

        {/* Quick Start (Local Inference) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground font-sans">
              Quick Start (Local Inference)
            </h4>
            <span className="text-xs text-muted-foreground font-mono">Ollama CLI</span>
          </div>
          <div className="relative group">
            <pre className="font-mono text-sm bg-neutral-950 dark:bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-lg px-4 py-3 overflow-x-auto selection:bg-neutral-800">
              <code>
                <span className="text-emerald-400">ollama</span>
                <span className="text-neutral-200"> run </span>
                <span className="text-sky-400">fardeen0424/neutrino</span>
              </code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-[colors,transform] duration-150 active:scale-[0.96] cursor-pointer"
              aria-label="Copy Ollama run command"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-400" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Separation line */}
        <div className="-mx-6 sm:-mx-8 border-b border-border my-6" />

        {/* Pre-training Datasets */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground font-sans">
            Training Datasets ({datasets.length} Curated Sources)
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-5 sm:gap-y-6">
            {datasets.map((ds) => (
              <div
                key={ds}
                className="rounded-full h-8 w-fit px-3.5 flex items-center gap-2 bg-card transition-[transform] duration-150 active:scale-[0.96] cursor-default"
                style={{ boxShadow: "var(--ring-card)" }}
              >
                <span className="text-foreground text-[13px] font-medium font-mono">{ds}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Trend Graph */}
      <ChartLineInteractive downloads30d={downloads30d} downloadsAllTime={downloadsAllTime} />
    </article>
  );
}
