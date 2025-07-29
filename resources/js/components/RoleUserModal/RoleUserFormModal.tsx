import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Import 'router' sudah ada, ini yang akan kita gunakan
import { useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
    role: { id: number; name: string; users: User[] } | null;
    allUsers: User[];
}

export function RoleUserFormModal({ open, onClose, role, allUsers }: RoleUserFormModalProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingEmail, setPendingEmail] = useState("");
    const [alert, setAlert] = useState<string | null>(null);
    const [page, setPage] = useState(0);

    // Kita tetap gunakan useForm untuk mendapatkan state 'processing' dan 'errors' secara otomatis
    const { post, processing, errors, reset } = useForm();

    // Search suggestion (tidak ada perubahan)
    useEffect(() => {
        if (query.length > 1) {
            setSuggestions(
                allUsers
                    .filter(u =>
                        u.email.toLowerCase().includes(query.toLowerCase()) &&
                        !role?.users.some(ru => ru.id === u.id)
                    )
                    .slice(0, 5)
            );
        } else {
            setSuggestions([]);
        }
    }, [query, allUsers, role]);

    const pagedUsers = role?.users?.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) || [];
    const totalPages = Math.ceil((role?.users?.length || 0) / PAGE_SIZE);

    function handleSelect(email: string) {
        setSelectedEmail(email);
        setQuery(email);
        setSuggestions([]);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setAlert(null);

        const userInRole = role?.users?.find(u => u.email === query);
        if (userInRole) {
            setAlert("User sudah ada di role ini.");
            return;
        }

        const user = allUsers.find(u => u.email === query);
        if (user && user.role_id && user.role_id !== role?.id) {
            setPendingEmail(query);
            setShowConfirm(true);
            return;
        }

        doAssign(query);
    }

    // --- PERBAIKAN UTAMA ---
    function doAssign(email: string) {
        // Gunakan router.post yang memungkinkan kita mengirim data secara eksplisit
        router.post(`/roles/${role?.id}/invite-user`, { email: email }, {
            onSuccess: () => {
                toast.success("User assigned/invited!");
                setQuery("");
                setSelectedEmail("");
                reset();
            },
            onError: (errors) => {
                // 'errors' dari useForm akan otomatis terisi oleh Inertia
                toast.error(errors.email || "Gagal assign/invite user");
            },
            preserveScroll: true,
            only: ['roles', 'errors'], // Optimasi: hanya minta data 'roles' dan 'errors' baru
        });
    }

    function handleRemoveUser(userId: number) {
        // Gunakan router.post di sini juga untuk konsistensi
        router.post(`/roles/${role?.id}/remove-user`, { user_id: userId }, {
            onSuccess: () => {
                toast.success("User removed from role!");
            },
            onError: () => toast.error("Gagal remove user"),
            preserveScroll: true,
            only: ['roles'],
        });
    }

    // Tampilan JSX (tidak ada perubahan)
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Manage Users for {role?.name}</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Tambah user ke role (by email):</label>
                        <Input
                            type="email"
                            placeholder="Masukkan email user"
                            value={query}
                            onChange={e => {
                                setQuery(e.target.value);
                                setSelectedEmail("");
                                setAlert(null);
                            }}
                            autoComplete="off"
                            required
                        />
                        {suggestions.length > 0 && (
                            <ul className="border rounded bg-white shadow-lg absolute z-10 w-full mt-1">
                                {suggestions.map(user => (
                                    <li
                                        key={user.id}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSelect(user.email)}
                                    >
                                        {user.name} <span className="text-xs text-muted-foreground">({user.email})</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {alert && <div className="text-red-500 text-xs mt-1">{alert}</div>}
                        {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing || !query}>Assign/Invite</Button>
                    </DialogFooter>
                </form>
                <div className="mt-6">
                    <h4 className="font-semibold mb-2">User pada Role ini:</h4>
                    <ul className="space-y-1">
                        {pagedUsers.map(user => (
                            <li key={user.id} className="flex items-center justify-between gap-2">
                                <span>{user.name} ({user.email})</span>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRemoveUser(user.id)}
                                >
                                    Remove
                                </Button>
                            </li>
                        ))}
                        {role?.users?.length === 0 && <li className="text-muted-foreground">Belum ada user di role ini.</li>}
                    </ul>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
                            <span className="text-xs">Page {page + 1} of {totalPages}</span>
                            <Button size="sm" variant="outline" disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
                        </div>
                    )}
                </div>
            </DialogContent>
            {showConfirm && (
                <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                    <DialogContent>
                        <DialogTitle>Konfirmasi</DialogTitle>
                        <div>
                            User dengan email <b>{pendingEmail}</b> sudah memiliki role lain.<br />
                            Apakah Anda yakin ingin memindahkan user ke role ini?
                        </div>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => setShowConfirm(false)}>Batal</Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setShowConfirm(false);
                                    doAssign(pendingEmail);
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
