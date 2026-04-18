import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Clock, CalendarRange, Info, ArrowRight, Eye, Flag, LogOut, Users } from 'lucide-react';
import * as React from 'react';

export default function TimelineSetting() {
    const { teaser_time, start_time, end_time, description, quota, is_open, period } = usePage().props as any;

    const { data, setData, post, processing, errors } = useForm({
        teaser_time: teaser_time ?? '',
        start_time: start_time ?? '',
        end_time: end_time ?? '',
        description: description ?? '',
        quota: quota ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/open-recruitment-timeline');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pengaturan Waktu Pendaftaran', href: '/open-recruitment-timeline' }]}>
            <Head title="Pengaturan Waktu Pendaftaran" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">Timeline Open Recruitment</h1>
                        {is_open && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                Aktif
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pengaturan disimpan ke periode aktif: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{period?.name ?? 'Tidak ada periode aktif'}</span>.
                    </p>
                </div>

                {!period && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm">
                        ⚠️ Belum ada periode aktif. Silakan buat dan aktifkan periode di menu <strong>Kepengurusan → Periode</strong> terlebih dahulu.
                    </div>
                )}

                {/* Visual Flow */}
                <div className="grid grid-cols-5 items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    {[
                        { icon: Eye, label: 'Pengumuman', desc: 'Timer muncul di Dashboard', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 border-blue-200' },
                        null,
                        { icon: Flag, label: 'Pendaftaran Dibuka', desc: 'Form dapat diisi pelamar', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 border-amber-200' },
                        null,
                        { icon: LogOut, label: 'Pendaftaran Ditutup', desc: 'Form dikunci otomatis', color: 'text-zinc-700 bg-zinc-200 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 dark:text-zinc-200' },
                    ].map((step, i) =>
                        step === null ? (
                            <div key={i} className="flex justify-center text-zinc-300 dark:text-zinc-700"><ArrowRight /></div>
                        ) : (
                            <div key={i} className="flex flex-col items-center gap-2 text-center">
                                <div className={`p-3 rounded-full border ${step.color}`}>
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">{step.label}</p>
                                    <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">{step.desc}</p>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Form */}
                <Card className="border-0 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-zinc-500" />
                            <CardTitle className="text-base font-semibold">Konfigurasi Jadwal</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={submit} className="space-y-8">
                            {/* 3 Datetime fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Teaser */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500" htmlFor="teaser_time">
                                        Waktu Pengumuman (Teaser)
                                    </Label>
                                    <div className="relative group">
                                        <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                        <Input id="teaser_time" type="datetime-local" className="pl-9 dark:bg-zinc-950" value={data.teaser_time} onChange={e => setData('teaser_time', e.target.value)} />
                                    </div>
                                    <p className="text-[10px] text-zinc-400">Hitung mundur mulai muncul di Dashboard.</p>
                                    {errors.teaser_time && <p className="text-xs text-red-500">{errors.teaser_time}</p>}
                                </div>

                                {/* Start */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500" htmlFor="start_time">
                                        Waktu Buka Pendaftaran
                                    </Label>
                                    <div className="relative group">
                                        <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                        <Input id="start_time" type="datetime-local" className="pl-9 dark:bg-zinc-950" value={data.start_time} onChange={e => setData('start_time', e.target.value)} />
                                    </div>
                                    <p className="text-[10px] text-zinc-400">Pendaftaran dapat diakses publik.</p>
                                    {errors.start_time && <p className="text-xs text-red-500">{errors.start_time}</p>}
                                </div>

                                {/* End */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500" htmlFor="end_time">
                                        Waktu Tutup / Berakhir
                                    </Label>
                                    <div className="relative group">
                                        <LogOut className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                        <Input id="end_time" type="datetime-local" className="pl-9 dark:bg-zinc-950" value={data.end_time} onChange={e => setData('end_time', e.target.value)} />
                                    </div>
                                    <p className="text-[10px] text-zinc-400">Form dikunci otomatis. Bisa diubah untuk extend.</p>
                                    {errors.end_time && <p className="text-xs text-red-500">{errors.end_time}</p>}
                                </div>
                            </div>

                            {/* Description + Quota */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500" htmlFor="description">
                                        Deskripsi / Pengumuman (Opsional)
                                    </Label>
                                    <Textarea
                                        id="description"
                                        rows={3}
                                        className="resize-none dark:bg-zinc-950"
                                        placeholder="Tuliskan informasi singkat tentang open recruitment ini..."
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    />
                                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500" htmlFor="quota">
                                        Kuota Maksimal (Opsional)
                                    </Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                        <Input
                                            id="quota"
                                            type="number"
                                            min="1"
                                            className="pl-9 dark:bg-zinc-950"
                                            placeholder="Kosongkan = tidak dibatasi"
                                            value={data.quota}
                                            onChange={e => setData('quota', e.target.value)}
                                        />
                                    </div>
                                    {errors.quota && <p className="text-xs text-red-500">{errors.quota}</p>}
                                </div>
                            </div>

                            {/* Info Note */}
                            <div className="bg-zinc-50 dark:bg-zinc-900/40 p-4 flex items-start gap-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <Info className="w-5 h-5 mt-0.5 shrink-0 text-zinc-400" />
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Data disimpan ke tabel <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">periods</span> pada periode aktif saat ini. 
                                    Untuk <strong>memperpanjang/membuka ulang</strong> pendaftaran yang sudah tutup, cukup ubah <em>Waktu Tutup</em> ke tanggal baru dan simpan.
                                </p>
                            </div>

                            {/* Submit */}
                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                                <Button type="submit" disabled={processing || !period} className="h-11 px-8 rounded-xl shadow-md active:scale-95 transition-transform">
                                    {processing ? 'Menyimpan...' : 'Simpan & Terapkan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
