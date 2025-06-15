import { MemberFormModal } from '@/components/TableMembers/MemberFormModal';
import { MemberTable } from '@/components/TableMembers/MemberTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function MembersIndex() {
    const {
        members = [],
        periods = [],
        oldInput = {},
    } = usePage().props as {
        members: any[];
        periods: { id: number; name: string }[];
        oldInput?: Record<string, any>;
    };
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    return (
        <AppLayout breadcrumbs={[{ title: 'Members', href: '/members' }]}>
            <Head title="Members" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Daftar Anggota</h1>
                    <Button
                        onClick={() => {
                            setEditData(null);
                            setOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tambah Member
                    </Button>
                </div>
                <MemberTable
                    data={members}
                    periods={periods}
                    onEdit={(member) => {
                        setEditData(member);
                        setOpen(true);
                    }}
                />
                <MemberFormModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setEditData(null);
                    }}
                    initialData={{
                        period_id: '',
                        name: '',
                        nim: '',
                        address: '',
                        email: '',
                        department: '',
                        study_program: '',
                        joined_college_on: '',
                        graduated_college_on: '',
                        born_at: '',
                        birth_date_at: '',
                        picture: null,
                        ...editData,
                        ...oldInput,
                    }}
                    periods={periods}
                />
            </div>
        </AppLayout>
    );
}
