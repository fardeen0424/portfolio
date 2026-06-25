import Link from "next/link";
import { Linkedin } from "lucide-react";
import Strands from "@/components/Strands";
import { DATA } from "@/data/resume";

export default function ContactSection() {
  return (
    <div className="relative mt-8">
      {/* Contact Badge - Outside the overflow-hidden card to prevent clipping */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 border bg-primary rounded-full px-4 py-1 shadow-sm">
        <span className="text-background text-xs font-semibold uppercase tracking-wider">Contact</span>
      </div>

      {/* Main Card */}
      <div className="border rounded-2xl bg-background/50 dark:bg-neutral-950/50 backdrop-blur-md overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-8 md:p-10 shadow-xl dark:shadow-2xl/40">
        
        {/* Left Side: Premium CTA Content */}
        <div className="md:col-span-7 flex flex-col justify-center items-start text-left gap-6 z-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold text-neutral-800 dark:text-neutral-200 sm:text-4xl">
              Let&apos;s build something great.
            </h2>
            <p className="text-muted-foreground md:text-lg lg:text-xl text-balance leading-relaxed max-w-lg">
              Want to collaborate, discuss research, or just have a chat? Shoot me a message on LinkedIn. I am always open to interesting opportunities and discussions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href={DATA.contact.social.LinkedIn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff4300] hover:bg-[#e03a00] text-white font-medium text-sm px-8 py-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ff4300]/20"
            >
              <Linkedin className="w-4 h-4" />
              Connect on LinkedIn
            </Link>
          </div>
        </div>

        {/* Right Side: Interactive Strands Element */}
        <div className="md:col-span-5 relative w-full h-[240px] md:h-full min-h-[220px] rounded-xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-950/5 dark:bg-neutral-950/40">
          <div className="absolute inset-0 pointer-events-none">
            <Strands
              colors={["#0000fe","#5a00ff","#ff5500"]}
              count={4}
              speed={0.6}
              amplitude={1.2}
              waviness={0.3}
              thickness={0.6}
              glow={0.8}
              taper={2}
              spread={1.2}
              intensity={0.5}
              saturation={2}
              opacity={1}
              scale={1.8}
              glass={false}
              refraction={1}
              dispersion={3.2}
              glassSize={0.59}
              hueShift={0}
            />
            {/* Elegant glassmorphism overlay card border effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-background/10" />
          </div>
          
          {/* Subtle floating label to invite interaction */}
          <div className="absolute bottom-3 right-3 bg-background/80 dark:bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-medium text-muted-foreground border border-neutral-200/50 dark:border-neutral-800/50">
            Interactive WebGL
          </div>
        </div>

      </div>
    </div>
  );
}

