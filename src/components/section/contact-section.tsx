import Link from "next/link";
import Strands from "@/components/Strands";
import { DATA } from "@/data/resume";

export default function ContactSection() {
  return (
    <div className="border rounded-xl relative overflow-hidden bg-background/50 backdrop-blur-sm">
      {/* Label Badge */}
      <div className="absolute -top-4 border bg-primary z-20 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
        <span className="text-background text-sm font-medium">Contact</span>
      </div>
      
      {/* Background Strands Container */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Strands
            colors={["#0000fe","#5a00ff","#ff5500"]}
            count={4}
            speed={0.5}
            amplitude={1}
            waviness={0.2}
            thickness={0.5}
            glow={0.6}
            taper={3}
            spread={1}
            intensity={0.4}
            saturation={2}
            opacity={1}
            scale={1.9}
            glass={false}
            refraction={1}
            dispersion={3.2}
            glassSize={0.59}
            hueShift={0}
          />
          {/* Smooth overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center p-12 md:p-16">
        <h2 className="text-3xl font-semibold tracking-tighter text-neutral-800 dark:text-neutral-200 sm:text-5xl">
          Get in Touch
        </h2>
        <p className="mx-auto max-w-lg text-muted-foreground md:text-lg lg:text-xl text-balance leading-relaxed">
          Want to chat? Just shoot me a dm{" "}
          <Link
            href={DATA.contact.social.X.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm transition-colors"
          >
            with a direct question on twitter
          </Link>{" "}
          and I&apos;ll respond whenever I can. I will ignore all
          soliciting.
        </p>
      </div>
    </div>
  );
}

