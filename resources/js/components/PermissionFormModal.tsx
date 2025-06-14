import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { useEffect } from "react";

interface PermissionFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: { id?: number; name: string; key: string; description?: string };
}

export function PermissionFormModal({ open, onClose, initialData }: PermissionFormModalProps) {
  const isEdit = !!initialData?.id;
  const { data, setData, post, put, processing, errors, reset } = useForm(
    initialData || { name: "", key: "", description: "" }
  );


  useEffect(() => {
    setData(initialData || { name: "", key: "", description: "" });
  }, [initialData, setData]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isEdit) {
      put(`/permissions/${initialData.id}`, {
        onSuccess: () => {
          toast.success("Permission berhasil diubah!");
          onClose();
          reset();
        },
        onError: () => {
          toast.error("Gagal mengubah permission.");
        },
      });
    } else {
      post("/permissions", {
        onSuccess: () => {
          toast.success("Permission berhasil ditambahkan!");
          onClose();
          reset();
        },
        onError: () => {
          toast.error("Gagal menambah permission.");
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{isEdit ? "Edit Permission" : "Tambah Permission"}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Permission</Label>
            <Input
              id="name"
              value={data.name}
              onChange={e => setData("name", e.target.value)}
              autoFocus
            />
            <InputError message={errors.name} />
          </div>
          <div>
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              value={data.key}
              onChange={e => setData("key", e.target.value)}
            />
            <InputError message={errors.key} />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              value={data.description || ""}
              onChange={e => setData("description", e.target.value)}
            />
            <InputError message={errors.description} />
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