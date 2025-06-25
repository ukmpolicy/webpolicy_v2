import { AlbumFormModal } from '@/components/TableAlbum/AlbumFormModal';
import { AlbumTable } from '@/components/TableAlbum/AlbumTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
// Buat komponen AlbumTable dan AlbumFormModal sesuai kebutuhan

export default function AlbumIndex() {
    const { albums = [] } = usePage().props;
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Gallery', href: '#' },
                { title: 'Albums', href: '/gallery-album' },
            ]}
        >
            <Head title="Albums" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Album List</h1>
                    <Button
                        onClick={() => {
                            setEditData(null);
                            setOpen(true);
                        }}
                    >
                        <Plus className="m-auto w-4" /> Tambah Album
                    </Button>
                </div>
                <AlbumTable
                    data={albums}
                    onEdit={(album) => {
                        setEditData(album);
                        setOpen(true);
                    }}
                />
                <AlbumFormModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setEditData(null);
                    }}
                    initialData={editData}
                />
            </div>
        </AppLayout>
    );
}
