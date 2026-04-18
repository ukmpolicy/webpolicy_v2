import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarClock, Megaphone, CheckCircle2, PlayCircle, StopCircle, ArrowRight, AlarmClock } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';

type Period = {
    id: number;
    name: string;
    is_open_recruitment: boolean;
    recruitment_announcement_at: string | null;
    recruitment_started_at: string | null;
    recruitment_ended_at: string | null;
    recruitment_description: string | null;
};

// --- Helper Functions untuk Timer ---
const getStatus = (announcement: string | null, start: string | null, end: string | null) => {
    const now = new Date().getTime();
    const annTime = announcement ? new Date(announcement).getTime() : null;
    const startTime = start ? new Date(start).getTime() : null;
    const endTime = end ? new Date(end).getTime() : null;

    if (endTime && now >= endTime) {
        return { label: 'Pendaftaran Telah Ditutup', color: 'bg-red-100 text-red-800 border-red-200', targetTime: null };
    } else if (startTime && now >= startTime) {
        return { label: 'Pendaftaran Sedang Berjalan! Berakhir dalam:', color: 'bg-green-100 text-green-800 border-green-200', targetTime: endTime };
    } else if (annTime && now >= annTime) {
        return { label: 'Siap-siap! Pendaftaran akan dibuka dalam:', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', targetTime: startTime };
    } else if (annTime) {
        return { label: 'Menunggu Waktu Pengumuman...', color: 'bg-blue-100 text-blue-800 border-blue-200', targetTime: annTime };
    } else {
        return { label: 'Jadwal belum ditentukan', color: 'bg-gray-100 text-gray-800 border-gray-200', targetTime: null };
    }
};

const formatTimeleft = (targetTime: number | null) => {
    if (!targetTime) return null;
    const diff = targetTime - new Date().getTime();
    if (diff <= 0) return 'Waktu habis';

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    return `${d} hari, ${h} jam, ${m} menit, ${s} detik`;
};

export default function PengaturanWaktu() {
    const { activePeriod } = usePage().props as unknown as { activePeriod: Period | null };

    // Format utility untuk datetime picker (YYYY-MM-DDTHH:mm)
    const formatForInput = (dateStr: string | null) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        // adjust for timezone offset to local
        const offset = d.getTimezoneOffset() * 60000;
        const localDate = new Date(d.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    const [form, setForm] = useState({
        is_open_recruitment: activePeriod?.is_open_recruitment || false,
        recruitment_announcement_at: formatForInput(activePeriod?.recruitment_announcement_at || null),
        recruitment_started_at: formatForInput(activePeriod?.recruitment_started_at || null),
        recruitment_ended_at: formatForInput(activePeriod?.recruitment_ended_at || null),
        recruitment_description: activePeriod?.recruitment_description || '',
    });

    const [loading, setLoading] = useState(false);

    // Live Countdown State
    const [liveStatus, setLiveStatus] = useState(getStatus(form.recruitment_announcement_at, form.recruitment_started_at, form.recruitment_ended_at));
    const [timeLeftStr, setTimeLeftStr] = useState(formatTimeleft(liveStatus.targetTime));

    useEffect(() => {
        // Evaluate setiap input berubah
        const currentStatus = getStatus(form.recruitment_announcement_at, form.recruitment_started_at, form.recruitment_ended_at);
        setLiveStatus(currentStatus);
        setTimeLeftStr(formatTimeleft(currentStatus.targetTime));

        // Timer interval 1 detik
        const interval = setInterval(() => {
            const newStatus = getStatus(form.recruitment_announcement_at, form.recruitment_started_at, form.recruitment_ended_at);
            setLiveStatus(newStatus);
            setTimeLeftStr(formatTimeleft(newStatus.targetTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [form.recruitment_announcement_at, form.recruitment_started_at, form.recruitment_ended_at]);

    const handleSave = () => {
        setLoading(true);
        router.post('/pengaturan-waktu', {
            _method: 'put',
            ...form
        }, {
            onFinish: () => setLoading(false),
            onSuccess: () => toast.success('Pengaturan jadwal pendaftaran berhasil disimpan!'),
            onError: () => toast.error('Gagal menyimpan pengaturan. Coba lagi.'),
        });
    };

    if (!activePeriod) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Open Recruitment', href: '/pendaftaran' }, { title: 'Pengaturan Waktu', href: '/pengaturan-waktu' }]}>
                <Head title="Pengaturan Waktu Pendaftaran" />
                <div className="flex h-[50vh] flex-col items-center justify-center gap-4 rounded-xl border bg-card p-8 text-center m-4">
                    <Megaphone className="h-12 w-12 text-muted-foreground" />
                    <div>
                        <h2 className="text-xl font-bold">Tidak Ada Periode Aktif</h2>
                        <p className="mt-2 text-muted-foreground">Silakan tentukan atau aktifkan satu periode kepengurusan terlebih dahulu.</p>
                    </div>
                    <Link href="/periods">
                        <Button className="mt-2 gap-2">Ke Manajemen Periode <ArrowRight size={16}/></Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Open Recruitment', href: '/pendaftaran' }, { title: 'Pengaturan Waktu', href: '/pengaturan-waktu' }]}>
            <Head title="Pengaturan Jadwal Pendaftaran" />
            <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto w-full">

                <div className="mb-2">
                    <h1 className="text-2xl font-bold">Pengaturan Waktu Pendaftaran</h1>
                    <p className="text-muted-foreground">Periode Aktif Saat Ini: <strong className="text-primary">{activePeriod.name}</strong></p>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    {/* Status Open Recruitment Toggle */}
                    <div className="mb-8 flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <CheckCircle2 size={20} className={form.is_open_recruitment ? "text-green-500" : "text-muted-foreground"} />
                                Status Pendaftaran
                            </h3>
                            <p className="text-sm text-muted-foreground">Nyalakan toggle ini jika tahun ini membuka pendaftaran baru.</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={form.is_open_recruitment}
                                onChange={(e) => setForm({ ...form, is_open_recruitment: e.target.checked })}
                            />
                            <div className="peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                        </label>
                    </div>

                    {/* Live Timer Preview */}
                    {form.is_open_recruitment && (
                        <div className={`mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg border p-4 ${liveStatus.color}`}>
                            <div className="flex items-center gap-3">
                                <AlarmClock size={28} className="opacity-80" />
                                <div>
                                    <h4 className="font-bold">{liveStatus.label}</h4>
                                    <p className="text-sm opacity-90">Preview status public page</p>
                                </div>
                            </div>
                            {timeLeftStr && (
                                <div className="text-xl font-mono font-bold tracking-tight bg-white/50 dark:bg-black/20 px-4 py-2 rounded-md">
                                    {timeLeftStr}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Timeline Jadwal Pendaftaran */}
                    <div className="space-y-6">
                        <h3 className="font-semibold text-lg border-b pb-2">Timeline Pelaksanaan</h3>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Waktu Pengumuman */}
                            <div className="flex flex-col gap-2 rounded-lg border p-4 hover:border-primary/50 transition-colors">
                                <label className="flex items-center gap-2 font-medium text-sm text-muted-foreground">
                                    <Megaphone size={16} /> Waktu Pengumuman
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                                    value={form.recruitment_announcement_at}
                                    onChange={(e) => setForm({ ...form, recruitment_announcement_at: e.target.value })}
                                    disabled={!form.is_open_recruitment}
                                />
                                <span className="text-xs text-muted-foreground">Timer countdown (coming soon) sebelum pendaftaran betul-betul dibuka.</span>
                            </div>

                            {/* Waktu Buka */}
                            <div className="flex flex-col gap-2 rounded-lg border p-4 border-green-200 hover:border-green-400 bg-green-50/10 transition-colors">
                                <label className="flex items-center gap-2 font-medium text-sm text-green-700 dark:text-green-400">
                                    <PlayCircle size={16} /> Pendaftaran Dibuka
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                                    value={form.recruitment_started_at}
                                    onChange={(e) => setForm({ ...form, recruitment_started_at: e.target.value })}
                                    disabled={!form.is_open_recruitment}
                                />
                                <span className="text-xs text-muted-foreground">Waktu dimana form registrasi mulai bisa diakses oleh calon anggota.</span>
                            </div>

                            {/* Waktu Tutup */}
                            <div className="flex flex-col gap-2 rounded-lg border p-4 border-red-200 hover:border-red-400 bg-red-50/10 transition-colors">
                                <label className="flex items-center gap-2 font-medium text-sm text-red-700 dark:text-red-400">
                                    <StopCircle size={16} /> Pendaftaran Ditutup
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                                    value={form.recruitment_ended_at}
                                    onChange={(e) => setForm({ ...form, recruitment_ended_at: e.target.value })}
                                    disabled={!form.is_open_recruitment}
                                />
                                <span className="text-xs text-muted-foreground">Waktu pengakhiran pendaftaran. Tombol Submit akan dimatikan otomatis.</span>
                            </div>
                        </div>

                        {/* Pengumuman Singkat / Keterangan */}
                        <div className="mt-6">
                            <label className="mb-2 flex items-center gap-2 font-medium text-sm">
                                <CalendarClock size={16} /> Keterangan / Deskripsi (Opsional)
                            </label>
                            <textarea
                                className="w-full rounded-md border px-3 py-2 text-sm bg-background resize-none min-h-[100px]"
                                placeholder="Misalnya: Open Recruitment Angkatan 15..."
                                value={form.recruitment_description}
                                onChange={(e) => setForm({ ...form, recruitment_description: e.target.value })}
                                disabled={!form.is_open_recruitment}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button size="lg" onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                            {loading ? 'Menyimpan...' : 'Simpan Pengaturan Waktu'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
