import { StructureMemberFormModal } from '@/components/TableStructureMember/StructureMemberFormModal';
import { StructureMemberTable } from '@/components/TableStructureMember/StructureMemberTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { router, Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function StructureMemberIndex() {
  const {
    data = [],
    periods = [],
    structures = [],
    selectedPeriodId = null,
    selectedStructureId = null,
  } = usePage().props;

  const [formOpen, setFormOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const handlePeriodChange = (value: string) => {
    router.get(
      route('structure-members.index'),
      {
        period_id: value,
        structure_id: selectedStructureId || undefined,
      },
      {
        preserveScroll: true,
        preserveState: true,
      }
    );
  };

  const handleStructureChange = (value: string) => {
    router.get(
      route('structure-members.index'),
      {
        structure_id: value,
        period_id: selectedPeriodId || undefined,
      },
      {
        preserveScroll: true,
        preserveState: true,
      }
    );
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Structure', href: '#' },
        { title: 'Structure', href: '/structures  ' },
        { title: 'Structure Members', href: '/structure-members' },
      ]}
    >
      <Head title="Anggota Struktur" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold">Daftar Anggota Struktur</h1>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">


            {/* Tombol Tambah */}
            <Button
              onClick={() => {
                setEditingData(null);
                setFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Anggota
            </Button>
          </div>
        </div>

        {/* Tabel Anggota Struktur */}
        <StructureMemberTable
          data={data}
          structures={structures}
          periods={periods}
          selectedStructureId={selectedStructureId}
          selectedPeriodId={selectedPeriodId}
          onEdit={(member) => {
            setEditingData(member);
            setFormOpen(true);
          }}
        />

        {/* Modal Form Tambah/Edit */}
        <StructureMemberFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initialData={editingData}
          structures={structures}
          selectedStructureId={selectedStructureId}
        />
      </div>
    </AppLayout>
  );
}
