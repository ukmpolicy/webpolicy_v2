import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Inertia } from "@inertiajs/inertia";

interface User {
    id: number;
    name: string;
    email: string;
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
    const { data, setData, post, processing, reset, errors } = useForm<{ email: string }>({ email: "" });
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

    function handleSelect(email: string) {
        setSelectedEmail(email);
        setQuery(email);
        setSuggestions([]);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setData("email", query); // <-- set data form
        post(`/roles/${role?.id}/invite-user`, {
            onSuccess: () => {
                toast.success("User assigned/invited!");
                setQuery("");
                setSelectedEmail("");
                reset();
                Inertia.reload({ only: ['roles'] });
            },
            onError: () => toast.error("Gagal assign/invite user"),
            preserveScroll: true,
        });
    }

    function handleRemoveUser(userId: number) {
        Inertia.post(`/roles/${role?.id}/remove-user`, { user_id: userId }, {
            onSuccess: () => {
                toast.success("User removed from role!");
                Inertia.reload({ only: ['roles'] });
            },
            onError: () => toast.error("Gagal remove user"),
            preserveScroll: true,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Manage Users for {role?.name}</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Tambah user ke role (by email):</label>
                        <input
                            type="email"
                            className="input w-full"
                            placeholder="Masukkan email user"
                            value={query}
                            onChange={e => {
                                setQuery(e.target.value);
                                setSelectedEmail("");
                            }}
                            autoComplete="off"
                            required
                        />
                        {suggestions.length > 0 && (
                            <ul className="border rounded bg-white shadow absolute z-10 w-full mt-1">
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
                        {role?.users?.map(user => (
                            <li key={user.id} className="flex items-center gap-2">
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
