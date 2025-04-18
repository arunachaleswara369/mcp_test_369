"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function BackgroundBeams({
  className,
}: {
  className?: string;
}) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const beamsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!beamsContainerRef.current) return;
      
      const rect = beamsContainerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setMousePosition({ x, y });
    };

    document.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={beamsContainerRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div
        className="absolute inset-0 z-10 bg-black [mask-image:radial-gradient(transparent,white)] dark:bg-black/20"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent opacity-0 dark:opacity-100"
        aria-hidden="true"
      />
      <div
        className="absolute left-0 top-0 z-0 h-full w-full"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />
    </div>
  );
}