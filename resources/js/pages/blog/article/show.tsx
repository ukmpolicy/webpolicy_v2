import TuiViewer from '@/components/tui-viewer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, Tag, User as UserIcon, X } from 'lucide-react';

export default function ArticleShow() {
    const { article } = usePage().props;

    if (!article) {
        return (
            <AppLayout>
                <Head title="Artikel Tidak Ditemukan" />
                <div className="flex h-full flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center text-gray-500">
                        <h1 className="mb-2 text-2xl font-bold">Artikel Tidak Ditemukan</h1>
                        <p>Maaf, artikel yang Anda cari tidak ada atau telah dihapus.</p>
                        <Button onClick={() => window.history.back()} className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Blog', href: '#' },
                { title: 'Artikel', href: '/articles' },
                { title: 'Detail Artikel', href: '#' },
            ]}
        >
            <Head title="Detail Artikel" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header dengan judul halaman dan tombol aksi */}
                <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="mb-1 text-2xl font-bold">Detail Artikel</h1>
                            <p className="text-sm text-gray-500">Detail artikel blog Anda.</p>
                        </div>
                    </div>
                    {/* Tombol Aksi - Desktop: atas kanan, Mobile: bawah */}
                    <div className="hidden flex-wrap gap-2 md:order-last md:flex">
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <X className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                        <Button onClick={() => Inertia.visit(`/articles/${article.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Artikel
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div className="bg-card space-y-6 rounded-lg border p-8 shadow-sm">
                            {/* Judul Artikel: Tambahkan break-words untuk responsivitas */}
                            <h1 className="mb-2 text-3xl leading-tight font-extrabold break-words text-gray-900 uppercase md:text-4xl lg:text-5xl dark:text-gray-100">
                                {article.title}
                            </h1>
                            {article.categories && article.categories.length > 0 && (
                                <div className="mt-4 mb-4">
                                    <h2 className="mb-2 text-lg font-semibold">Kategori</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {article.categories.map((category, index) => (
                                            <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                                                <Tag className="mr-1 h-3 w-3" />
                                                {category.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="mt-4 mb-4">
                                <h2 className="mb-2 text-lg font-semibold">Informasi Artikel</h2>
                                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-7 w-7">
                                            <AvatarImage src={article.author?.avatar} />
                                            <AvatarFallback>
                                                {article.author?.name ? article.author.name.charAt(0).toUpperCase() : 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{article.author?.name || 'Anonim'}</span>
                                    </div>
                                    <Separator orientation="vertical" className="hidden h-5 md:block" />
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(article.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                            {article.picture && (
                                <div className="mt-6 mb-6 overflow-hidden rounded-lg border">
                                    <img
                                        src={`/storage/${article.picture}`}
                                        alt={article.title}
                                        className="h-auto max-h-[500px] w-full object-cover"
                                    />
                                </div>
                            )}
                            {/* KONTEN UTAMA ARTIKEL: Kini hanya perlu kelas prose dan max-w-none */}
                            <div className="prose prose-lg max-w-none">
                                <TuiViewer content={article.content} />
                            </div>
                        </div>

                        {article.summary && (
                            <div className="bg-card mt-6 rounded-lg border p-6 shadow-sm">
                                <h2 className="mb-2 text-lg font-semibold">Ringkasan</h2>
                                <p className="mb-0 text-lg leading-relaxed text-gray-600 dark:text-gray-300">{article.summary}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-card rounded-lg border p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Tentang Penulis</h2>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={article.author?.avatar} />
                                    <AvatarFallback className="text-3xl">
                                        {article.author?.name ? article.author.name.charAt(0).toUpperCase() : 'A'}
                                    </AvatarFallback>
                                </Avatar>
                                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{article.author?.name || 'Anonim'}</p>
                                <p className="text-sm text-gray-500">
                                    <UserIcon className="mr-1 inline-block h-4 w-4 align-text-bottom" />
                                    Web Developer
                                </p>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                    Seorang profesional yang bersemangat dengan keahlian dalam pengembangan web modern dan teknologi frontend.
                                </p>
                                <Button
                                    variant="link"
                                    className="mt-2"
                                    onClick={() => article.author?.id && Inertia.visit(`/articles?author_id=${article.author.id}`)}
                                >
                                    Lihat Semua Artikel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Tombol Aksi untuk Mobile (muncul di bawah, sembunyi di desktop) */}
                <div className="mt-8 flex justify-end gap-3 rounded-lg border p-4 shadow-md md:hidden">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <X className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                    <Button onClick={() => Inertia.visit(`/articles/${article.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Artikel
                    </Button>
                </div>
                <div className="mt-8 border-t pt-6 text-center text-sm text-gray-500">
                    Artikel ini dipublikasikan pada {formatDate(article.created_at)}
                    {article.updated_at !== article.created_at && <span> dan terakhir diperbarui pada {formatDate(article.updated_at)}</span>}
                </div>
            </div>
        </AppLayout>
    );
}
