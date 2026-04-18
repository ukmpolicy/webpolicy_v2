import BirthdayCalendar from '@/components/homepage/dashboard/birthday-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, FileText, GalleryHorizontal, User, Users, Clock, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Article {
    id: number;
    title: string;
    slug: string;
    view_count: number;
    picture: string;
}

const getImageUrl = (path?: string): string => {
    return path ? `/storage/${path}` : '/images/penguin.png';
};

export default function Dashboard() {
    const {
        totalMembersCount,
        activeMembersCount,
        activePeriodName,
        totalArticlesCount,
        publishedArticlesCount,
        draftArticlesCount,
        totalAlbumsCount,
        publicAlbumsCount,
        privateAlbumsCount,
        totalMediaCount,
        birthdays,
        popularArticles,
        recruitmentTeaser,
        recruitmentStart,
        recruitmentEnd,
        totalApplicantsCount,
        pendingApplicantsCount,
        serverTime,
    } = usePage().props as any;

    const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);
    const [statusText, setStatusText] = useState('Memuat timeline...');
    const [statusMode, setStatusMode] = useState<'pending' | 'open' | 'closed'>('pending');
    const [timeOffset, setTimeOffset] = useState(0);

    // Hitung selisih waktu server vs client untuk akurasi presisi
    useEffect(() => {
        if (serverTime) {
            const serverDate = new Date(serverTime).getTime();
            const clientDate = new Date().getTime();
            setTimeOffset(serverDate - clientDate);
        }
    }, [serverTime]);

    useEffect(() => {
        if (!recruitmentTeaser || !recruitmentStart || !recruitmentEnd) {
            setStatusText('Timeline Pendaftaran Belum Diatur');
            setStatusMode('closed');
            return;
        }

        const updateTimer = () => {
            // Gunakan waktu client yang sudah disesuaikan dengan selisih waktu server
            const now = new Date().getTime() + timeOffset;
            const teaser = new Date(recruitmentTeaser).getTime();
            const start = new Date(recruitmentStart).getTime();
            const end = new Date(recruitmentEnd).getTime();

            // Tahap 1: Sebelum Buka (Countdown to Opening)
            if (now < start) {
                const distance = start - now;
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
                
                // Teks status bergantung pada apakah sudah masuk masa teaser atau belum
                if (now < teaser) {
                    setStatusText('Pendaftaran Akan Segera Datang');
                } else {
                    setStatusText('Pendaftaran Akan Dibuka Dalam:');
                }
                setStatusMode('pending');
            } 
            // Tahap 2: Sedang Berlangsung (Countdown to Closing)
            else if (now >= start && now <= end) {
                const distance = end - now;
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
                setStatusText('Pendaftaran Sedang Berlangsung. Sisa Waktu:');
                setStatusMode('open');
            } 
            // Tahap 3: Selesai / Ditutup
            else {
                setTimeLeft(null);
                setStatusText('Pendaftaran Telah Ditutup');
                setStatusMode('closed');
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [recruitmentTeaser, recruitmentStart, recruitmentEnd]);

    // Helper format tanggal singkat
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Jika belum masuk masa teaser, kita bisa memilih untuk menyembunyikan card ini sepenuhnya
    const isVisible = recruitmentTeaser ? new Date().getTime() >= new Date(recruitmentTeaser).getTime() : false;
    // Namun untuk Admin/Dashboard, biarkan tetap terlihat agar tahu statusnya.
    // Di sini saya biarkan tetap terlihat tapi dengan status 'pending'.

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Selamat Datang Dashboard UKM-POLICY</h1>
                </div>

                {/* Bagian Timer Open Recruitment */}
                <Card className={`overflow-hidden border-0 shadow-sm ${
                    statusMode === 'open' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 
                    statusMode === 'pending' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : 
                    'bg-gray-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 border'
                }`}>
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full bg-white/20 backdrop-blur-sm ${statusMode === 'closed' && 'bg-gray-200 dark:bg-zinc-800'}`}>
                                {statusMode === 'open' && <CheckCircle2 className="w-8 h-8 text-white" />}
                                {statusMode === 'pending' && <Clock className="w-8 h-8 text-white" />}
                                {statusMode === 'closed' && <AlertCircle className="w-8 h-8 text-gray-500 dark:text-gray-400" />}
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${statusMode === 'closed' ? 'text-gray-900 dark:text-zinc-100' : 'text-white'}`}>Status Open Recruitment</h3>
                                <div className="flex flex-col gap-0.5 mt-1">
                                    <p className={`font-medium ${statusMode === 'closed' ? 'text-gray-500 dark:text-gray-400' : 'text-white/90'}`}>{statusText}</p>
                                    {(statusMode === 'open' || statusMode === 'pending' || (statusMode === 'closed' && recruitmentStart)) && (
                                        <p className={`text-[10px] uppercase tracking-wider font-bold opacity-75 ${statusMode === 'closed' ? 'text-zinc-400' : 'text-white'}`}>
                                            {formatDate(recruitmentStart)} — {formatDate(recruitmentEnd)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {timeLeft && (
                            <div className="flex items-center gap-4 bg-white/10 dark:bg-black/20 p-4 rounded-xl backdrop-blur-md border border-white/10">
                                <div className="text-center group">
                                    <div className={`text-3xl font-bold font-mono tracking-tight tabular-nums transition-transform ${statusMode === 'closed' ? 'text-gray-900 dark:text-white' : 'text-white group-hover:scale-110'}`}>
                                        {timeLeft.days.toString().padStart(2, '0')}
                                    </div>
                                    <div className={`text-[10px] uppercase tracking-[0.2em] font-black mt-1 ${statusMode === 'closed' ? 'text-gray-500' : 'text-white/70'}`}>Hari</div>
                                </div>
                                <div className={`text-2xl font-light mb-4 opacity-30 ${statusMode === 'closed' ? 'text-gray-400' : 'text-white'}`}>:</div>
                                <div className="text-center group">
                                    <div className={`text-3xl font-bold font-mono tracking-tight tabular-nums transition-transform ${statusMode === 'closed' ? 'text-gray-900 dark:text-white' : 'text-white group-hover:scale-110'}`}>
                                        {timeLeft.hours.toString().padStart(2, '0')}
                                    </div>
                                    <div className={`text-[10px] uppercase tracking-[0.2em] font-black mt-1 ${statusMode === 'closed' ? 'text-gray-500' : 'text-white/70'}`}>Jam</div>
                                </div>
                                <div className={`text-2xl font-light mb-4 opacity-30 ${statusMode === 'closed' ? 'text-gray-400' : 'text-white'}`}>:</div>
                                <div className="text-center group">
                                    <div className={`text-3xl font-bold font-mono tracking-tight tabular-nums transition-transform ${statusMode === 'closed' ? 'text-gray-900 dark:text-white' : 'text-white group-hover:scale-110'}`}>
                                        {timeLeft.minutes.toString().padStart(2, '0')}
                                    </div>
                                    <div className={`text-[10px] uppercase tracking-[0.2em] font-black mt-1 ${statusMode === 'closed' ? 'text-gray-500' : 'text-white/70'}`}>Menit</div>
                                </div>
                                <div className={`text-2xl font-light mb-4 opacity-30 ${statusMode === 'closed' ? 'text-gray-400' : 'text-white'}`}>:</div>
                                <div className="text-center group">
                                    <div className={`text-3xl font-bold font-mono tracking-tight tabular-nums transition-transform ${statusMode === 'closed' ? 'text-gray-900 dark:text-white' : 'text-white group-hover:scale-110'}`}>
                                        {timeLeft.seconds.toString().padStart(2, '0')}
                                    </div>
                                    <div className={`text-[10px] uppercase tracking-[0.2em] font-black mt-1 ${statusMode === 'closed' ? 'text-gray-500' : 'text-white/70'}`}>Detik</div>
                                </div>
                            </div>
                        )}
                        {(statusMode === 'closed' || !isVisible) && (
                            <Link href="/open-recruitment-timeline">
                                <span className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest hover:ring-2 hover:ring-offset-2 hover:ring-zinc-500 transition-all active:scale-95 shadow-lg">
                                    {recruitmentStart ? 'Perbarui Jadwal' : 'Atur Jadwal Awal'}
                                </span>
                            </Link>
                        )}
                    </CardContent>
                </Card>

                {/* Bagian Metrik Utama */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {/* Kartu untuk total seluruh anggota */}
                    <Card className="transition-shadow hover:shadow-lg border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalMembersCount}</div>
                            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">Seluruh periode</p>
                        </CardContent>
                    </Card>

                    {/* Kartu untuk Pelamar Open Recruitment (BARU) */}
                    <Card className="transition-shadow hover:shadow-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pelamar</CardTitle>
                            <UserPlus className="text-blue-500 h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight">{totalApplicantsCount || '0'}</div>
                            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">
                                <span className="text-amber-600 dark:text-amber-500">{pendingApplicantsCount || '0'} Menunggu</span> | {activePeriodName}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Kartu untuk anggota periode aktif */}
                    <Card className="transition-shadow hover:shadow-lg border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Anggota Aktif</CardTitle>
                            <User className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeMembersCount}</div>
                            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">Periode Terpilih</p>
                        </CardContent>
                    </Card>

                    {/* Kartu untuk artikel (dengan detail status) */}
                    <Card className="transition-shadow hover:shadow-lg border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
                            <FileText className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalArticlesCount || '0'}</div>
                            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">
                                {publishedArticlesCount || '0'} Pub | {draftArticlesCount || '0'} Drf
                            </p>
                        </CardContent>
                    </Card>

                    {/* Kartu untuk total album (dengan detail status) */}
                    <Card className="transition-shadow hover:shadow-lg border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Album</CardTitle>
                            <GalleryHorizontal className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalAlbumsCount || '0'}</div>
                            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">
                                {publicAlbumsCount || '0'} Pub | {privateAlbumsCount || '0'} Pri
                            </p>
                        </CardContent>
                    </Card>

                    {/* Kartu untuk total dokumentasi */}
                    <Card className="transition-shadow hover:shadow-lg border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Galeri Media</CardTitle>
                            <GalleryHorizontal className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalMediaCount || '0'}</div>
                            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">Foto & Video</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bagian Berita Populer */}
                <div className="mt-6">
                    <h2 className="mb-4 text-xl font-bold">Berita Populer</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {popularArticles && popularArticles.length > 0 ? (
                            popularArticles.map((article) => (
                                <Link key={article.id} href={route('blog.show', article.slug)} className="group block">
                                    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                                        <img
                                            src={getImageUrl(article.picture)}
                                            alt={article.title}
                                            className="h-40 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <CardContent className="flex flex-col gap-2 p-4">
                                            <h3 className="line-clamp-2 text-lg font-bold">{article.title}</h3>
                                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                <Eye className="h-4 w-4" />
                                                <span>{article.view_count} kali dilihat</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-sm">Tidak ada berita populer saat ini.</p>
                        )}
                    </div>
                </div>

                {/* Bagian Kalender Ulang Tahun */}
                <div className="mt-6">
                    <h2 className="mb-4 text-xl font-bold">Kalender Ulang Tahun</h2>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <BirthdayCalendar birthdays={birthdays} />
                        {/* Area kosong di samping kalender */}
                        <div className="hidden min-h-96 rounded-xl border border-dashed lg:block" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
