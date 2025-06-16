import { MemberFormModal } from '@/components/TableMembers/MemberFormModal';
import { MemberTable } from '@/components/TableMembers/MemberTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function MemberIndex() {
    const { members = [], periods = [], departments = [], activePeriodId = null } = usePage().props;
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    return (
        <AppLayout breadcrumbs={[{ title: 'Members', href: '/members' }]}>
            <Head title="Members" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold"> Members List</h1>
                    <Button
                        onClick={() => {
                            setEditData(null);
                            setOpen(true);
                        }}
                    >
                        <Plus className="m-auto w-4" /> Tambah Member
                    </Button>
                </div>
                <MemberTable
                    data={members}
                    onEdit={(member) => {
                        setEditData(member);
                        setOpen(true);
                    }}
                    onView={(member) => {
                        window.location.href = `/members/${member.id}`;
                    }}
                />
                <MemberFormModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setEditData(null);
                    }}
                    initialData={editData}
                    periods={periods}
                    departments={departments}
                />
            </div>
        </AppLayout>
    );
}
