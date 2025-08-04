import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { router, useForm } from '@inertiajs/react';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 5;

interface User {
    id: number;
    name: string;
    email: string;
    role_id?: number;
}

interface RoleUserFormModalProps {
    open: boolean;
    onClose: () => void;
    role: {
        id: number;
        name: string;
        users: User[];
        is_super_admin_role?: boolean;
    } | null;
    allUsers: User[];
    currentUser: { id: number; email: string } | null;
}

export function RoleUserFormModal({ open, onClose, role, allUsers, currentUser }: RoleUserFormModalProps) {
    // Ganti 'query' dengan 'email' di useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', // Inisialisasi email di data useForm
    });

    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingEmail, setPendingEmail] = useState('');
    const [alert, setAlert] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        // Gunakan data.email untuk query suggestion
        if (data.email.length > 1) {
            setSuggestions(
                allUsers
                    .filter((u) => u.email.toLowerCase().includes(data.email.toLowerCase()) && !role?.users.some((ru) => ru.id === u.id))
                    .slice(0, 5),
            );
        } else {
            setSuggestions([]);
        }
    }, [data.email, allUsers, role]); // Perbarui dependency array

    const pagedUsers = role?.users?.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) || [];
    const totalPages = Math.ceil((role?.users?.length || 0) / PAGE_SIZE);

    function handleSelect(email: string) {
        setData('email', email); // Set data.email
        setSelectedEmail(email);
        setSuggestions([]);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setAlert(null);

        // --- MODIFIKASI 1: Cegah user menambahkan atau memindahkan dirinya sendiri ---
        // Gunakan data.email untuk perbandingan
        if (currentUser && data.email.toLowerCase() === currentUser.email.toLowerCase()) {
            setAlert('Anda tidak bisa memindahkan atau menetapkan role ke diri Anda sendiri. Silakan hubungi admin lain.');
            return;
        }
        // --- Akhir MODIFIKASI 1 ---

        const userInRole = role?.users?.find((u) => u.email === data.email); // Gunakan data.email
        if (userInRole) {
            setAlert('User sudah ada di role ini.');
            return;
        }

        const user = allUsers.find((u) => u.email === data.email); // Gunakan data.email
        if (user && user.role_id && user.role_id !== role?.id) {
            setPendingEmail(data.email); // Gunakan data.email
            setShowConfirm(true);
            return;
        }

        doAssign(); // Tidak perlu passing email karena sudah ada di data useForm
    }

    // --- PERBAIKAN UTAMA: doAssign tidak lagi menerima parameter email ---
    function doAssign() {
        // post() akan otomatis mengirim data dari state 'data' useForm
        post(`/roles/${role?.id}/invite-user`, {
            onSuccess: () => {
                toast.success('User assigned/invited!');
                setData('email', ''); // Reset email di data useForm
                setSelectedEmail('');
                reset(); // Reset form state lainnya
                router.reload({ only: ['roles'] });
            },
            onError: (validationErrors: any) => {
                // Perbaiki nama parameter
                toast.error(validationErrors.email || 'Gagal assign/invite user');
            },
            preserveScroll: true,
            only: ['roles', 'errors'],
        });
    }

    function handleRemoveUser(userId: number) {
        // --- MODIFIKASI 2: Cegah user menghapus dirinya sendiri dari role ---
        if (currentUser && currentUser.id === userId) {
            toast.error('Anda tidak bisa menghapus diri Anda sendiri dari role.');
            return;
        }
        // --- Akhir MODIFIKASI 2 ---

        setIsRemoving(true);
        router.post(
            `/roles/${role?.id}/remove-user`,
            { user_id: userId }, // Ini sudah benar karena user_id adalah data tunggal
            {
                onSuccess: () => {
                    toast.success('User removed from role!');
                    router.reload({ only: ['roles'] });
                },
                onError: (errors: any) => {
                    toast.error(errors.general || 'Gagal remove user');
                },
                onFinish: () => {
                    setIsRemoving(false);
                },
                preserveScroll: true,
                only: ['roles'],
            },
        );
    }

    // Tampilan JSX
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Manage Users for {role?.name}</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block font-medium">Tambah user ke role (by email):</label>
                        <Input
                            type="email"
                            placeholder="Masukkan email user"
                            value={data.email} // Ikat ke data.email
                            onChange={(e) => {
                                setData('email', e.target.value); // Update data.email
                                setSelectedEmail('');
                                setAlert(null);
                            }}
                            autoComplete="off"
                            required
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute z-10 mt-1 w-full rounded border bg-white shadow-lg">
                                {suggestions.map((user) => (
                                    <li key={user.id} className="cursor-pointer px-3 py-2 hover:bg-gray-100" onClick={() => handleSelect(user.email)}>
                                        {user.name} <span className="text-muted-foreground text-xs">({user.email})</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {alert && <div className="mt-1 text-xs text-red-500">{alert}</div>}
                        {errors.email && <div className="mt-1 text-xs text-red-500">{errors.email}</div>}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={onClose}>
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing || !data.email.trim()}>
                            {' '}
                            {/* Pastikan email tidak kosong */}
                            Assign/Invite
                        </Button>
                    </DialogFooter>
                </form>
                <div className="mt-6">
                    <h4 className="mb-2 font-semibold">User pada Role ini:</h4>
                    <ul className="space-y-1">
                        {pagedUsers.map((user) => (
                            <li key={user.id} className="flex items-center justify-between gap-2">
                                <span>
                                    {user.name} ({user.email})
                                </span>
                                {(role?.is_super_admin_role && currentUser?.id === user.id) || currentUser?.id === user.id ? (
                                    <Button size="sm" variant="destructive" disabled title="Anda tidak bisa menghapus diri Anda sendiri dari role.">
                                        <X className="mr-1 h-4 w-4" /> Remove
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="destructive" onClick={() => handleRemoveUser(user.id)} disabled={isRemoving}>
                                        {isRemoving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <X className="mr-1 h-4 w-4" />}
                                        Remove
                                    </Button>
                                )}
                            </li>
                        ))}
                        {role?.users?.length === 0 && <li className="text-muted-foreground">Belum ada user di role ini.</li>}
                    </ul>
                    {totalPages > 1 && (
                        <div className="mt-2 flex items-center justify-center gap-2">
                            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                                Prev
                            </Button>
                            <span className="text-xs">
                                Page {page + 1} of {totalPages}
                            </span>
                            <Button size="sm" variant="outline" disabled={page === totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
            {showConfirm && (
                <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                    <DialogContent>
                        <DialogTitle>Konfirmasi</DialogTitle>
                        <div>
                            User dengan email <b>{pendingEmail}</b> sudah memiliki role lain.
                            <br />
                            Apakah Anda yakin ingin memindahkan user ke role ini?
                        </div>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setShowConfirm(false);
                                    doAssign(); // Tidak perlu passing email
                                }}
                            >
                                Pindahkan User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </Dialog>
    );
}
