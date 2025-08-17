import astronaut from '@/assets/images/policy2.png';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ExpandableList } from './expandable-list';

export default function AppVisiMisi() {
    const { visi = [], misi = [] } = usePage().props as {
        visi?: string[];
        misi?: string[];
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black px-6 py-24 text-white">
            {/* Pattern Grid */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] opacity-[0.03]"
                style={{ backgroundSize: '50px 50px' }}
            ></div>

            {/* Radial Glow */}
            <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[120px]"></div>
            <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[100px]"></div>

            {/* Partikel animasi */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-2 w-2 rounded-full bg-red-500/30"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: 0.1,
                    }}
                    animate={{
                        y: [null, Math.random() * window.innerHeight],
                        opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                        duration: 6 + Math.random() * 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[30%_70%]">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center lg:justify-start"
                >
                    <img
                        src={astronaut}
                        alt="Policy Logo"
                        className="w-[220px] drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-transform duration-500 hover:scale-105 md:w-[260px] lg:w-[300px]"
                    />
                </motion.div>

                {/* VISI & MISI */}
                <div className="space-y-14">
                    {/* VISI */}
                    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
                        <div className="mb-6">
                            <h2 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight">
                                <span className="block h-10 w-2 rounded-full bg-red-600"></span>
                                VISI
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">Tujuan utama dan arah gerak komunitas.</p>
                        </div>
                        {/* Gunakan komponen baru untuk VISI */}
                        {visi.length > 0 ? (
                            <ExpandableList items={visi} />
                        ) : (
                            <ul className="space-y-4">
                                <li className="text-gray-500">-</li>
                            </ul>
                        )}
                    </motion.div>

                    {/* MISI */}
                    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
                        <div className="mb-6">
                            <h2 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight">
                                <span className="block h-10 w-2 rounded-full bg-red-600"></span>
                                MISI
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">Langkah-langkah strategis untuk mencapai visi.</p>
                        </div>
                        {/* Gunakan komponen baru untuk MISI */}
                        {misi.length > 0 ? (
                            <ExpandableList items={misi} />
                        ) : (
                            <ul className="space-y-4">
                                <li className="text-gray-500">-</li>
                            </ul>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
