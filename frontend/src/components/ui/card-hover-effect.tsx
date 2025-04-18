"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardHoverEffectProps {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}

export function CardHoverEffect({ items, className }: CardHoverEffectProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-6 h-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <motion.div
            className="absolute inset-0 bg-card border rounded-lg"
            initial={false}
            animate={{
              scale: hoveredIndex === idx ? 1.05 : 1,
              boxShadow:
                hoveredIndex === idx
                  ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  : "0 0 #0000",
            }}
            transition={{ duration: 0.2 }}
          />
          <div className="relative z-10">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
                {item.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground flex-grow">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}