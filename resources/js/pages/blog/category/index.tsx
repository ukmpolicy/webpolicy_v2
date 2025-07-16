import { CategoryFormModal } from '@/components/Blog/CategoryFormModal';
import { CategoryTable } from '@/components/Blog/CategoryTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CategoryIndex() {
    const { categories = [], success, error } = usePage().props;

    const [openFormModal, setOpenFormModal] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (success) toast.success(success);
        if (error) toast.error(error);
    }, [success, error]);

    const handleOpenCreateModal = () => {
        setEditData(null);
        setOpenFormModal(true);
    };

    const handleOpenEditModal = (category) => {
        setEditData(category);
        setOpenFormModal(true);
    };

    const handleCloseFormModal = () => {
        setOpenFormModal(false);
        setEditData(null);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Blog', href: '#' },
                { title: 'Kategori Artikel', href: '/category-articles' },
            ]}
        >
            <Head title="Kategori Artikel" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Daftar Kategori Artikel</h1>
                    <Button onClick={handleOpenCreateModal}>
                        <Plus className="m-auto w-4" /> Tambah Kategori
                    </Button>
                </div>
                <CategoryTable data={categories} onEdit={handleOpenEditModal} />
                <CategoryFormModal open={openFormModal} onClose={handleCloseFormModal} initialData={editData} />
            </div>
        </AppLayout>
    );
}
