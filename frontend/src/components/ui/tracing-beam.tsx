"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useScroll, useVelocity, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  const yRange = useTransform(scrollYProgress, [0, 1], [0, svgHeight]);
  const smoothY = useSpring(yRange, { damping: 50, stiffness: 400 });

  return (
    <motion.div
      ref={ref}
      className={cn("relative w-full max-w-4xl mx-auto", className)}
    >
      <div className="absolute -left-4 md:-left-20 top-3">
        <motion.div
          className="relative h-full w-4 md:w-20"
          style={{ height: svgHeight }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            width="100%"
            height="100%"
            viewBox={`0 0 20 ${svgHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="10"
              y1="0"
              x2="10"
              y2={svgHeight}
              stroke="#E5E7EB"
              strokeWidth="2"
            />
          </svg>

          <motion.div
            className="absolute top-0 left-0 w-full bg-primary"
            style={{
              height: smoothY,
              width: "4px",
              left: "8px",
              top: "0",
            }}
          />
          <motion.div
            className="absolute top-0 left-0 w-4 h-4 rounded-full border-2 border-primary bg-background z-10"
            style={{
              top: smoothY,
              left: "6px",
              translateY: "-50%",
            }}
          />
        </motion.div>
      </div>
      <div ref={contentRef} className="ml-4 md:ml-20 pt-10 pb-20">
        {children}
      </div>
    </motion.div>
  );
};