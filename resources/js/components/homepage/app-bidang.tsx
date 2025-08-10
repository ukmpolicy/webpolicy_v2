'use client';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';

type Division = {
    id: number;
    name: string;
    description?: string;
};

export default function AppBidang({ divisions }: { divisions: Division[] }) {
    return (
        <section className="relative overflow-hidden border-b border-zinc-800 bg-black px-6 py-16 text-white md:px-10">
            {/* Pattern Grid */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] opacity-[0.03]"
                style={{ backgroundSize: '50px 50px' }}
            ></div>

            {/* Glow efek */}
            <div className="absolute top-[-200px] left-[-200px] h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[150px]"></div>
            <div className="absolute right-[-200px] bottom-[-200px] h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[120px]"></div>

            {/* Garis animasi */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 h-px w-full animate-[pulse_6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>

            <div className="relative z-10 mx-auto max-w-[1200px]">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="relative inline-block text-4xl font-bold italic md:text-5xl">
                        Bidang
                        <span className="absolute -bottom-3 left-1/2 block h-[3px] w-28 -translate-x-1/2 rounded-full bg-red-600"></span>
                    </h2>
                </div>

                {/* List */}
                <div className="space-y-10">
                    {divisions.length > 0 ? (
                        divisions.map((item, idx) => (
                            <div
                                key={item.id}
                                className={clsx(
                                    'group flex items-start justify-between rounded-xl border-b border-gray-800 px-4 pb-8 transition-all duration-300 hover:border-red-600 hover:bg-white/[0.02]',
                                )}
                            >
                                {/* Left: Number + Content */}
                                <div className="flex w-full flex-col md:flex-row md:items-start md:space-x-10">
                                    {/* Nomor */}
                                    <div className="w-16 shrink-0 font-mono text-2xl font-bold text-red-500 md:text-3xl">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>

                                    {/* Text */}
                                    <div className="flex w-full flex-col md:flex-row md:justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <div className="text-lg tracking-wider text-gray-400 uppercase">Bidang</div>
                                            <div className="text-3xl font-extrabold transition-colors duration-300 group-hover:text-red-500 md:text-4xl">
                                                {item.name}
                                            </div>
                                        </div>
                                        <div className="text-lg leading-relaxed text-gray-400 md:max-w-2xl">
                                            Bidang ini memiliki fokus utama pada{' '}
                                            <span className="font-semibold text-white">{item.name ?? 'bidang yang belum terdefinisi'}</span>, yang
                                            memainkan peran penting dalam menjalankan visi dan misi organisasi.
                                        </div>
                                    </div>
                                </div>

                                {/* Button */}
                                <div className="ml-6 shrink-0">
                                    <button className="rounded-lg bg-zinc-900 p-4 transition-colors duration-300 group-hover:bg-red-600">
                                        <ArrowUpRight size={22} className="transition-colors group-hover:text-black" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-lg text-gray-400 italic">Tidak ada bidang.</div>
                    )}
                </div>
            </div>
        </section>
    );
}
