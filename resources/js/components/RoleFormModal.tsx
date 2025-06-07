import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

interface RoleFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: { id?: number; name: string };
}

export function RoleFormModal({ open, onClose, initialData }: RoleFormModalProps) {
  const isEdit = !!initialData?.id;
  const { data, setData, post, put, processing, errors, reset } = useForm(initialData || { name: "" });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const action = isEdit
      ? put(`/roles/${initialData.id}`, {
          onSuccess: () => {
            toast.success("Role berhasil diubah!");
            onClose();
            reset();
          },
          onError: () => {
            toast.error("Gagal mengubah role.");
          },
        })
      : post("/roles", {
          onSuccess: () => {
            toast.success("Role berhasil ditambahkan!");
            onClose();
            reset();
          },
          onError: () => {
            toast.error("Gagal menambah role.");
          },
        });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{isEdit ? "Edit Role" : "Tambah Role"}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Role</Label>
            <Input
              id="name"
              value={data.name}
              onChange={e => setData("name", e.target.value)}
              autoFocus
            />
            <InputError message={errors.name} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={processing}>{isEdit ? "Simpan Perubahan" : "Simpan"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}