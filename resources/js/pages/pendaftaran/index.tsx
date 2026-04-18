import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { PendaftaranTable } from '@/components/pendaftaran/pendaftaran-table';

export default function PendaftaranIndex() {
    const { pendaftarans = [] } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={[{ title: 'Pendaftaran', href: '/pendaftaran' }]}>
            <Head title="Manajemen Pendaftaran" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Daftar Pendaftaran</h1>
                </div>

                {/* Menggunakan Tabel Pendaftaran berbasis Tanstack */}
                <PendaftaranTable data={pendaftarans} />

            </div>
        </AppLayout>
    );
}
