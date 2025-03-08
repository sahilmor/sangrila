'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownCircle } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleParallax = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const parallaxElement = heroRef.current.querySelector('.parallax-bg') as HTMLElement;
      
      if (parallaxElement) {
        parallaxElement.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  const handleScrollDown = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={heroRef} className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 parallax-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29uY2VydHN8ZW58MHwwfDB8fHww"
          alt="Sangrila Event"
          layout="fill"
          className="absolute inset-0 object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <span className="bg-white/10 text-white backdrop-blur-sm py-1 px-4 rounded-full text-sm font-medium">
            March 21-22, 2025
          </span>
        </motion.div>
        
        <motion.h1
          className="mt-6 text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          SANGRILA <span className="text-sangrila-400">2K25</span>
        </motion.h1>
        
        <motion.p
          className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Join us for the most anticipated cultural event of the year featuring 
          spectacular performances, unforgettable reunions, and moments that will 
          last a lifetime.
        </motion.p>
        
        {/* <motion.div
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button asChild className="bg-sangrila-500 hover:bg-sangrila-600 text-white px-8 py-6" size="lg">
            <Link href="#register">Register Now</Link>
          </Button>
        </motion.div> */}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <motion.button
          onClick={handleScrollDown}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 1.2,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 0.5
          }}
          className="text-white flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          <span className="text-sm font-medium">Scroll Down</span>
          <ArrowDownCircle size={24} />
        </motion.button>
      </div>
    </div>
  );
}
