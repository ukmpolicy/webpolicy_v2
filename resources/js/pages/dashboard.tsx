import BirthdayCalendar from '@/components/homepage/dashboard/birthday-calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { FileText, GalleryHorizontal, User, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

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
        birthdays,
        totalMediaCount,
    } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Bagian Judul yang lebih bersih */}
                <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                    <h1 className="text-2xl font-bold">Selamat Datang di Dashboard UKM-POLICY</h1>
                    {activePeriodName && (
                        <Badge
                            variant="secondary"
                            className="mt-2 text-sm md:mt-0 dark:text-green-500" // Perbaiki kelas di sini
                        >
                            Periode: {activePeriodName}
                        </Badge>
                    )}
                </div>
                {/* Bagian Metrik Utama */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Kartu untuk total seluruh anggota */}
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Seluruh Anggota</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalMembersCount}</div>
                            <p className="text-muted-foreground text-xs">Seluruh periode</p>
                        </CardContent>
                    </Card>

                    {/* Kartu untuk anggota periode aktif */}
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Anggota Aktif</CardTitle>
                            <User className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeMembersCount}</div>
                            <p className="text-muted-foreground text-xs">Periode: {activePeriodName}</p>
                        </CardContent>
                    </Card>

                    {/* Kartu untuk artikel (dengan detail status) */}
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
                            <FileText className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalArticlesCount || '0'}</div>
                            <p className="text-muted-foreground text-xs">
                                Diterbitkan: {publishedArticlesCount || '0'} | Draft: {draftArticlesCount || '0'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Kartu untuk total album (dengan detail status) */}
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Album</CardTitle>
                            <GalleryHorizontal className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalAlbumsCount || '0'}</div>
                            <p className="text-muted-foreground text-xs">
                                Publik: {publicAlbumsCount || '0'} | Privat: {privateAlbumsCount || '0'}
                            </p>
                        </CardContent>
                    </Card>
                    {/* Kartu untuk total dokumentasi */}
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Dokumentasi</CardTitle>
                            <GalleryHorizontal className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalMediaCount || '0'}</div>
                            <p className="text-muted-foreground text-xs">Total foto & video</p>
                        </CardContent>
                    </Card>
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
