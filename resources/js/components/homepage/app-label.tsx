'use client';
import { LucideAsterisk } from 'lucide-react';

export default function AppLabel() {
    const items = Array.from({ length: 15 });

    return (
        <div className="relative overflow-hidden bg-red-700 py-6">
            <div className="animate-scroll flex whitespace-nowrap">
                {items.map((_, idx) => (
                    <div key={idx} className="flex items-center space-x-2 px-4 text-lg font-bold text-black">
                        <LucideAsterisk className="h-5 w-5" />
                        <span>POLYTECHNIC LINUX COMMUNITY</span>
                    </div>
                ))}
                {/* Duplikat untuk seamless loop */}
                {items.map((_, idx) => (
                    <div key={`copy-${idx}`} className="flex items-center space-x-2 px-4 text-lg font-bold text-black">
                        <LucideAsterisk className="h-5 w-5" />
                        <span>POLYTECHNIC LINUX COMMUNITY</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
