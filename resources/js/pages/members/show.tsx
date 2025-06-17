import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function MemberShow() {
    const { member } = usePage().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Members', href: '/members' },
                { title: member.name, href: `/members/${member.id}` },
            ]}
        >
            <Head title={member.name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Detail Member</h1>
                    <Button asChild variant="secondary">
                        <Link href="/members">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="col-span-1">
                        <div className="rounded-lg border bg-white p-6 dark:bg-zinc-900">
                            <div className="flex flex-col items-center">
                                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-gray-200 dark:border-zinc-700">
                                    <img src={`/storage/${member.picture}`} alt={member.name} className="h-full w-full object-cover" />
                                </div>
                                <h2 className="text-center text-xl font-bold">{member.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400">{member.nim}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <div className="rounded-lg border bg-white p-6 dark:bg-zinc-900">
                            <h3 className="mb-4 text-lg font-semibold">Informasi Pribadi</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-medium">{member.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Alamat</p>
                                    <p className="font-medium">{member.address}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Tempat Lahir</p>
                                    <p className="font-medium">{member.born_at}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Lahir</p>
                                    <p className="font-medium">
                                        {new Date(member.birth_date_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 rounded-lg border bg-white p-6 dark:bg-zinc-900">
                            <h3 className="mb-4 text-lg font-semibold">Informasi Akademik</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Jurusan</p>
                                    <p className="font-medium">{member.department}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Program Studi</p>
                                    <p className="font-medium">{member.study_program}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Periode</p>
                                    <p className="font-medium">{member.period?.name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Tahun Masuk</p>
                                    <p className="font-medium">{member.joined_college_on}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Tahun Lulus</p>
                                    <p className="font-medium">{member.graduated_college_on || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
