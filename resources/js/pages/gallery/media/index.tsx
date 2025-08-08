import { MediaFormModal } from '@/components/TableMedia/MediaFormModal';
import { MediaTable } from '@/components/TableMedia/MediaTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function MediaIndex() {
    const {
        media = {},
        albums = [],
        selected_album_id,
        success,
        error,
        errors,
        search: searchQuery,
        per_page,
        media_type: mediaTypeQuery,
    } = usePage().props;

    const [openFormModal, setOpenFormModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const [selectedAlbumId, setSelectedAlbumId] = useState(selected_album_id ? String(selected_album_id) : 'all');
    const [mediaType, setMediaType] = useState(mediaTypeQuery || 'all');
    const [globalFilter, setGlobalFilter] = useState(searchQuery || '');
    const [perPage, setPerPage] = useState(per_page || 5);

    useEffect(() => {
        if (success) toast.success(success);
        if (error) toast.error(error);
        if (errors?.file) toast.error(errors.file);
    }, [success, error, errors]);

    useEffect(() => {
        setSelectedAlbumId(selected_album_id ? String(selected_album_id) : 'all');
    }, [selected_album_id]);

    useEffect(() => {
        setMediaType(mediaTypeQuery || 'all');
    }, [mediaTypeQuery]);

    useEffect(() => {
        setGlobalFilter(searchQuery || '');
    }, [searchQuery]);

    useEffect(() => {
        setPerPage(per_page || 5);
    }, [per_page]);

    const handleOpenCreateModal = () => {
        setEditData(null);
        setOpenFormModal(true);
    };

    const handleOpenEditModal = (item) => {
        setEditData(item);
        setOpenFormModal(true);
    };

    const handleCloseFormModal = () => {
        setOpenFormModal(false);
        setEditData(null);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Gallery', href: '#' },
                { title: 'Albums', href: '/gallery-album' },
                { title: 'Media', href: '/gallery-media' },
            ]}
        >
            <Head title="Galeri Media" />
            <div className="flex flex-col gap-6 rounded-xl p-4">
                <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="mb-1 text-2xl font-bold">Galeri Media</h1>
                        <p className="text-sm text-gray-500">Kumpulan foto & video dari berbagai album.</p>
                    </div>
                    <Button onClick={handleOpenCreateModal} className="gap-2">
                        <Plus className="w-4" /> Tambah Media
                    </Button>
                </div>
                <MediaTable
                    media={media}
                    albums={albums}
                    selectedAlbumId={selectedAlbumId}
                    mediaType={mediaType}
                    globalFilter={globalFilter}
                    perPage={perPage}
                    onEdit={handleOpenEditModal}
                />
                <MediaFormModal
                    open={openFormModal}
                    onClose={handleCloseFormModal}
                    initialData={editData}
                    albums={albums}
                    selectedAlbumId={selectedAlbumId === 'all' ? null : selectedAlbumId}
                />
            </div>
        </AppLayout>
    );
}
