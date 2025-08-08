import BirthdayCalendar from '@/components/homepage/dashboard/birthday-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, FileText, GalleryHorizontal, User, Users } from 'lucide-react';

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
        popularArticles, // Menerima data artikel terpopuler
    } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Halo, Selamat Datang! Dashboard UKM-POLICY</h1>
                </div>

                {/* Bagian Metrik Utama */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Kartu untuk total seluruh anggota */}
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
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
                            <CardTitle className="text-sm font-medium">Anggota Aktif</CardTitle>
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
                            <p className="text-muted-foreground text-xs">Foto & video</p>
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
