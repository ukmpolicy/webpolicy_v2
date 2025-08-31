'use client';

import { motion } from 'framer-motion';

type Struktur = {
    id: number;
    name: string;
    position: string;
    picture?: string | null;
    structure_id: number;
};

// Fungsi bantu untuk menjadikan huruf kapital di setiap awal kata
const toTitleCase = (text: string) =>
    text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

// Definisikan varian animasi untuk item
const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AppStruktural({ strukturalList }: { strukturalList: Struktur[] }) {
    return (
        <section className="relative overflow-hidden bg-black px-6 py-20 text-white">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] opacity-[0.03]"
                style={{ backgroundSize: '50px 50px' }}
            ></div>

            {/* Glow Effects */}
            <div className="absolute top-[-200px] left-[-200px] h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[150px]"></div>
            <div className="absolute right-[-200px] bottom-[-200px] h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[120px]"></div>

            <div className="relative z-10 mx-auto max-w-[1200px]">
                <h2 className="relative mb-12 text-center text-3xl font-bold italic md:text-4xl">
                    Struktural
                    <div className="absolute -bottom-2 left-1/2 h-[2px] w-28 -translate-x-1/2 bg-red-600" />
                </h2>

                {strukturalList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {strukturalList.map((person) => (
                            <motion.div
                                key={person.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="group w-full rounded-xl border border-zinc-800 bg-[#111111] p-4 text-center transition-all duration-300 md:cursor-pointer md:hover:border-red-600 md:hover:shadow-[0_0_25px_rgba(255,0,0,0.15)]">
                                    <div className="mb-6 aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
                                        <img
                                            src={person.picture ?? '/images/default-profile.png'}
                                            alt={person.name}
                                            title={person.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex h-20 flex-col justify-end">
                                        <h3 className="mb-2 text-2xl leading-snug font-bold text-white">{toTitleCase(person.name)}</h3>
                                        <p className="text-lg font-semibold text-red-500">{toTitleCase(person.position)}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400">Tidak ada anggota struktural yang tersedia.</p>
                )}
            </div>
        </section>
    );
}
