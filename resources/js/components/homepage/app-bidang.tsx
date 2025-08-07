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
        <section className="bg-black px-6 py-12 text-white md:px-10">
            <div className="mx-auto max-w-[1200px]">
                <div className="mb-12 text-center">
                    <h2 className="relative mb-12 text-center text-3xl font-bold italic md:text-4xl">
                        Bidang
                        <div className="absolute -bottom-2 left-1/2 h-[2px] w-28 -translate-x-1/2 bg-red-600" />
                    </h2>
                </div>

                <div className="space-y-8">
                    {divisions.length > 0 ? (
                        divisions.map((item, idx) => (
                            <div
                                key={item.id}
                                className={clsx(
                                    'group flex items-start justify-between border-b border-gray-700 pb-6 transition-all duration-300 hover:border-red-600',
                                )}
                            >
                                <div className="flex w-full flex-col md:flex-row md:items-start md:space-x-10">
                                    <div className="w-12 shrink-0 font-mono text-lg text-white">{String(idx + 1).padStart(2, '0')}</div>
                                    <div className="flex w-full flex-col md:flex-row md:justify-between">
                                        <div>
                                            <div className="text-base font-bold text-white">Bidang</div>
                                            <div className="text-3xl font-extrabold transition-colors duration-300 group-hover:text-red-500">
                                                {item.name}
                                            </div>
                                        </div>
                                        <div className="mt-4 text-gray-400 md:mt-0 md:max-w-2xl">
                                            Bidang ini memiliki fokus utama pada{' '}
                                            <span className="font-semibold text-white">{item.name ?? 'bidang yang belum terdefinisi'}</span>, yang
                                            memainkan peran penting dalam menjalankan visi dan misi organisasi.
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-4 shrink-0">
                                    <button className="rounded-md bg-zinc-900 p-3 transition-colors duration-300 group-hover:bg-red-600">
                                        <ArrowUpRight size={20} className="group-hover:text-black" />
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
