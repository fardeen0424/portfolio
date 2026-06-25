import Link from "next/link";
import { Linkedin } from "lucide-react";
import { DATA } from "@/data/resume";

export default function ContactSection() {
  return (
    <div className="relative mt-8">
      {/* Contact Badge - Outside the overflow-hidden card to prevent clipping */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 border bg-primary rounded-full px-4 py-1 shadow-sm">
        <span className="text-background text-xs font-semibold uppercase tracking-wider">Contact</span>
      </div>

      {/* Main Card */}
      <div className="border rounded-2xl bg-background/50 dark:bg-neutral-950/50 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center text-center gap-6 py-16 md:py-20 px-8 md:px-12">
        
        {/* Content Container */}
        <div className="flex flex-col items-center gap-6 z-10 max-w-xl">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold text-neutral-800 dark:text-neutral-200 sm:text-4xl">
              Let&apos;s build something great.
            </h2>
            <p className="text-muted-foreground md:text-lg lg:text-xl text-balance leading-relaxed">
              Want to collaborate, discuss research, or just have a chat? Shoot me a message on LinkedIn. I am always open to interesting opportunities and discussions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
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

      </div>
    </div>
  );
}

