"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDownCircle } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleParallax = () => {
      if (!heroRef.current) return;
      const y = window.scrollY * 0.35;
      const el = heroRef.current.querySelector(".parallax-bg") as HTMLElement;
      if (el) el.style.transform = `translateY(${y}px)`;
    };
    window.addEventListener("scroll", handleParallax);
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={heroRef} className="relative h-[100dvh] overflow-hidden">
      {/* bg image */}
      <div className="absolute inset-0 parallax-bg will-change-transform">
        <Image
          src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1920&q=75&auto=format&fit=crop"
          alt="Agaaz Event"
          fill
          className="object-cover"
          priority
        />
        {/* orange→blue overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,115,0,0.35),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.35),transparent_50%)]" />
      </div>

      {/* content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div className="max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 text-white backdrop-blur-md py-1.5 px-5 rounded-full text-sm font-medium"
          >
            4th Oct, 2025 • Geeta University
          </motion.span>

          <motion.h1
            className="mt-6 text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Agaaz{" "}
            <span className="bg-gradient-to-r from-orange-500 to-blue-500 text-transparent bg-clip-text">
              2K25
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-base md:text-xl text-white/85 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            The most anticipated cultural night — electrifying performances, massive vibes,
            and memories for a lifetime.
          </motion.p>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 text-white/85 hover:text-white transition"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9, repeat: Infinity, repeatType: "reverse" }}
        aria-label="Scroll Down"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-wide">Scroll Down</span>
          <ArrowDownCircle size={24} />
        </div>
      </motion.button>
    </section>
  );
}
