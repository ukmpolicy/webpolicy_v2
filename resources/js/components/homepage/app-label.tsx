"use client";
import { LucideAsterisk } from "lucide-react";

export default function AppLabel() {
  const items = Array.from({ length: 10 });

  return (
    <div className="relative overflow-hidden bg-red-600 py-6">
      <div className="flex whitespace-nowrap animate-scroll">
        {items.map((_, idx) => (
          <div key={idx} className="flex items-center space-x-2 px-4 text-black font-bold text-lg">
            <LucideAsterisk className="w-5 h-5" />
            <span>POLYTECHNIC LINUX COMMUNITY</span>
          </div>
        ))}
        {/* Duplikat untuk seamless loop */}
        {items.map((_, idx) => (
          <div key={`copy-${idx}`} className="flex items-center space-x-2 px-4 text-black font-bold text-lg">
            <LucideAsterisk className="w-5 h-5" />
            <span>POLYTECHNIC LINUX COMMUNITY</span>
          </div>
        ))}
      </div>
    </div>
  );
}
