import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ExpandableListProps {
    items: string[];
}

export const ExpandableList: React.FC<ExpandableListProps> = ({ items }) => {
    // State untuk mengelola ekspansi pada desktop
    const [isExpanded, setIsExpanded] = useState(false);

    // State untuk mendeteksi apakah layar adalah mobile atau bukan
    const [isMobile, setIsMobile] = useState(false);
    const initialCount = 3; // Jumlah item yang ditampilkan di awal untuk desktop

    // Efek untuk mendeteksi ukuran layar
    useEffect(() => {
        const handleResize = () => {
            // Kita tentukan mobile jika lebar layar kurang dari 768px (breakpoint 'md' Tailwind)
            setIsMobile(window.innerWidth < 768);
        };

        // Atur ukuran saat komponen pertama kali dimuat
        handleResize();

        // Tambahkan event listener untuk mendengarkan perubahan ukuran layar
        window.addEventListener('resize', handleResize);

        // Bersihkan event listener saat komponen di-unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Tentukan item yang akan ditampilkan berdasarkan mode (mobile atau desktop)
    const displayedItems = isMobile ? items : isExpanded ? items : items.slice(0, initialCount);

    return (
        <>
            <ul className="space-y-4">
                <AnimatePresence initial={false}>
                    {displayedItems.map((item, idx) => (
                        <motion.li
                            key={idx}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-start gap-3 rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
                        >
                            <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-red-500" />
                            <span className="text-lg leading-relaxed">{item}</span>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
            {/* Tombol hanya akan muncul jika bukan mode mobile DAN jumlah item lebih dari initialCount */}
            {!isMobile && items.length > initialCount && (
                <div className="mt-4 text-center">
                    <Button variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}
                    </Button>
                </div>
            )}
        </>
    );
};
