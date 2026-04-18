import { Link } from '@inertiajs/react';
import React, { useEffect, useMemo, useState } from 'react';

interface HeroCountdownOverlayProps {
    openAt: string;
    closeAt?: string;
    href?: string;
}

type CountdownState = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

const getRemainingTime = (targetDate: Date): CountdownState => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
    };
};

const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

const CountdownBox = ({
    label,
    value,
}: {
    label: string;
    value: number;
}) => (
    <div className="flex min-w-[64px] flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
        <span className="text-lg font-black text-white sm:text-xl">
            {String(value).padStart(2, '0')}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
            {label}
        </span>
    </div>
);

const HeroCountdownOverlay: React.FC<HeroCountdownOverlayProps> = ({
    openAt,
    closeAt,
    href = '/open-recruitment',
}) => {
    const openDate = useMemo(() => new Date(openAt), [openAt]);
    const closeDate = useMemo(() => (closeAt ? new Date(closeAt) : null), [closeAt]);

    const [now, setNow] = useState<Date>(new Date());
    const [countdown, setCountdown] = useState<CountdownState>(() => getRemainingTime(openDate));

    useEffect(() => {
        const timer = setInterval(() => {
            const currentNow = new Date();
            setNow(currentNow);

            if (currentNow < openDate) {
                setCountdown(getRemainingTime(openDate));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [openDate]);

    const isUpcoming = now < openDate;
    const isOpen = now >= openDate && (!closeDate || now <= closeDate);
    const isClosed = !!closeDate && now > closeDate;

    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
            <div className="pointer-events-auto mx-auto w-full max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
                <div className="rounded-[28px] border border-white/10 bg-black/75 px-5 py-5 shadow-2xl backdrop-blur-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        {isUpcoming && (
                            <>
                                <div className="space-y-2">
                                    <span className="inline-flex rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400">
                                        Open Recruitment
                                    </span>
                                    <h2 className="text-xl font-black leading-tight text-white sm:text-2xl">
                                        Pendaftaran Akan Dibuka
                                    </h2>
                                    <p className="max-w-2xl text-sm leading-7 text-zinc-300">
                                        Hitung mundur menuju pembukaan Open Recruitment UKM-POLICY.
                                        Dibuka pada{' '}
                                        <span className="font-semibold text-white">
                                            {formatDateTime(openAt)}
                                        </span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <CountdownBox label="Hari" value={countdown.days} />
                                    <CountdownBox label="Jam" value={countdown.hours} />
                                    <CountdownBox label="Menit" value={countdown.minutes} />
                                    <CountdownBox label="Detik" value={countdown.seconds} />
                                </div>
                            </>
                        )}

                        {isOpen && (
                            <>
                                <div className="space-y-2">
                                    <span className="inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
                                        Pendaftaran Dibuka
                                    </span>
                                    <h2 className="text-xl font-black leading-tight text-white sm:text-2xl">
                                        Saatnya Bergabung dengan UKM-POLICY
                                    </h2>
                                    <p className="max-w-2xl text-sm leading-7 text-zinc-300">
                                        Open Recruitment sudah dibuka. Klik tombol di samping untuk mulai mendaftar.
                                        {closeAt && (
                                            <>
                                                {' '}Ditutup pada{' '}
                                                <span className="font-semibold text-white">
                                                    {formatDateTime(closeAt)}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>

                                <div className="shrink-0">
                                    <Link
                                        href={href}
                                        className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 sm:w-auto"
                                    >
                                        Bergabung Sekarang
                                    </Link>
                                </div>
                            </>
                        )}

                        {isClosed && (
                            <div className="space-y-2">
                                <span className="inline-flex rounded-full border border-zinc-500/25 bg-zinc-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
                                    Pendaftaran Ditutup
                                </span>
                                <h2 className="text-xl font-black leading-tight text-white sm:text-2xl">
                                    Masa Pendaftaran Sudah Berakhir
                                </h2>
                                <p className="max-w-2xl text-sm leading-7 text-zinc-300">
                                    Pantau terus homepage untuk informasi pembukaan Open Recruitment berikutnya.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroCountdownOverlay;