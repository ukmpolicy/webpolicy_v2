import { Link } from '@inertiajs/react';
import React from 'react';

interface Period {
    id: number;
    name: string;
}

interface Pendaftaran {
    id: number;
    status: 'pending' | 'accepted' | 'rejected';
    feedback: string | null;
    created_at: string;
    period?: Period;
}

interface OpenRequirementProps {
    history: Pendaftaran[];
}

const OpenRequirement: React.FC<OpenRequirementProps> = ({ history }) => {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'accepted':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'rejected':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Sedang Ditinjau';
            case 'accepted': return 'Diterima';
            case 'rejected': return 'Ditolak';
            default: return 'Tidak Diketahui';
        }
    };

    return (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors duration-300 hover:border-red-500 sm:p-8">
            <header className="mb-6 flex flex-col gap-2 border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold text-white md:text-3xl">Riwayat Pendaftaran</h2>
                <p className="text-sm text-zinc-400">
                    Pantau status lamaran kamu bergabung dengan UKM-POLICY. Jika ditolak, kamu berkesempatan mendaftar kembali di periode (tahun) berikutnya.
                </p>
            </header>

            {history && history.length === 0 ? (
                <div className="py-8 text-center text-zinc-400">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                    <p className="text-sm">Belum ada riwayat pendaftaran.</p>
                    <Link href="/daftar" className="mt-3 inline-block text-red-500 hover:text-red-400 text-sm font-medium hover:underline">
                        Daftar Sekarang
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {history?.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 transition-colors hover:bg-black/60">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-white">
                                        Pendaftaran Periode {item.period?.name || 'Unknown'}
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        {new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(item.created_at))} WIB
                                    </p>
                                </div>
                                <div className="shrink-0 mt-2 sm:mt-0">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(item.status)}`}>
                                        {getStatusLabel(item.status)}
                                    </span>
                                </div>
                            </div>

                            {item.feedback && (
                                <div className="mt-3 rounded-lg border border-white/5 bg-white/5 p-3">
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                        Catatan Reviewer:
                                    </p>
                                    <p className="text-xs italic text-zinc-300">
                                        "{item.feedback}"
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default OpenRequirement;
