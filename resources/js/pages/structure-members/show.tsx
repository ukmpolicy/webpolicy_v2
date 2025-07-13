import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function StructureMemberShow() {
    const { structureMember } = usePage().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Anggota Struktur', href: '/structure-members' },
                { title: structureMember.name, href: `/structure-members/${structureMember.id}` },
            ]}
        >
            <Head title={structureMember.name} />

            <div className="flex flex-col gap-6 px-6 py-8 md:px-10 lg:px-20">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Detail Anggota Struktur
                    </h1>
                    <Button asChild variant="secondary">
                        <Link href="/structure-members">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Profile Foto & Nama */}
                    <div className="col-span-1 rounded-xl border bg-white p-6 text-center shadow-md dark:bg-zinc-900">
                        <div className="mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full border-4 border-gray-200 dark:border-zinc-700">
                            <img
                                src={
                                    structureMember.picture
                                        ? `/storage/${structureMember.picture}`
                                        : '/default-profile.png'
                                }
                                alt={structureMember.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-semibold">{structureMember.name}</h2>
                        <p className="text-sm text-muted-foreground">
                            {structureMember.structure?.name || '-'}
                        </p>
                    </div>

                    {/* Informasi Akademik */}
                    <div className="col-span-1 lg:col-span-2 rounded-xl border bg-white p-6 shadow-md dark:bg-zinc-900">
                        <h3 className="mb-6 text-lg font-semibold">Informasi </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Jurusan</p>
                                <p className="text-base font-medium">{structureMember.department}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Program Studi</p>
                                <p className="text-base font-medium">{structureMember.study_program}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Struktur</p>
                                <p className="text-base font-medium">{structureMember.structure?.name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Periode</p>
                                <p className="text-base font-medium">{structureMember.structure?.period?.name || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
