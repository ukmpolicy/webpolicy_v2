import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import React from "react";
import { Inertia } from "@inertiajs/inertia";
interface Permission {
  id: number;
  name: string;
  key: string;
  description?: string;
}

interface RolePermissionFormModalProps {
  open: boolean;
  onClose: () => void;
  role: { id: number; name: string; permissions?: Permission[] } | null;
  allPermissions: Permission[];
}

export function RolePermissionFormModal({ open, onClose, role, allPermissions }: RolePermissionFormModalProps) {
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (role?.permissions) {
      setSelected(role.permissions.map(p => p.id));
    } else {
      setSelected([]);
    }
  }, [role]);

  const { data, setData, post, processing } = useForm<{ permissions: number[] }>({ permissions: [] });

  useEffect(() => {
    return setData('permissions', selected);
  }, [selected, setData]);

  function handleToggle(id: number) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  }

  function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  post(`/roles/${role?.id}/permissions`, {
    onSuccess: () => {
      toast.success("Permissions updated!");
      onClose();
      Inertia.reload({ only: ['roles'] }); // <-- ini penting!
    },
    onError: () => toast.error("Gagal update permissions"),
    preserveScroll: true,
  });
}

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Manage Permissions for {role?.name}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-64 overflow-y-auto space-y-2">
            {allPermissions.map(permission => (
              <label key={permission.id} className="flex items-center gap-2">
                <Checkbox
                  checked={selected.includes(permission.id)}
                  onCheckedChange={() => handleToggle(permission.id)}
                />
                <span>{permission.name}</span>
                <span className="text-xs text-muted-foreground">({permission.key})</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={processing}>Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}