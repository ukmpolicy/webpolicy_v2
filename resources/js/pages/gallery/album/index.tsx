import { AlbumFormModal } from '@/components/TableAlbum/AlbumFormModal';
import { AlbumTable } from '@/components/TableAlbum/AlbumTable'; // Pastikan path ini benar
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AlbumIndex() {
    // Ambil albums, success, dan error dari props Inertia
    const { albums = [], success, error } = usePage().props;

    const [openFormModal, setOpenFormModal] = useState(false); // State untuk modal Tambah/Edit
    const [editData, setEditData] = useState(null); // State untuk data album yang akan diedit

    // Effect untuk menampilkan toast messages dari server
    useEffect(() => {
        if (success) toast.success(success);
        if (error) toast.error(error);
    }, [success, error]);

    const handleOpenCreateModal = () => {
        setEditData(null); // Pastikan data edit kosong untuk mode tambah
        setOpenFormModal(true);
    };

    const handleOpenEditModal = (album) => {
        setEditData(album); // Set data album untuk mode edit
        setOpenFormModal(true);
    };

    const handleCloseFormModal = () => {
        setOpenFormModal(false);
        setEditData(null); // Bersihkan data edit saat modal ditutup
    };

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
                    <h1 className="text-xl font-bold">Daftar Album </h1>
                    <Button onClick={handleOpenCreateModal}>
                        <Plus className="m-auto w-4" /> Tambah Album
                    </Button>
                </div>
                {/* Melewatkan data albums dan fungsi onEdit ke AlbumTable */}
                {/* AlbumTable sudah mengelola logika AlertDialog untuk delete */}
                <AlbumTable data={albums} onEdit={handleOpenEditModal} />
                {/* Modal untuk tambah/edit album */}
                <AlbumFormModal open={openFormModal} onClose={handleCloseFormModal} initialData={editData} />
            </div>
        </AppLayout>
    );
}
