import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";
import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import { handleInertiaPromise } from "@/lib/toast-helpers";

interface RoleFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: { id?: number; name: string };
}

export function RoleFormModal({ open, onClose, initialData }: RoleFormModalProps) {
  const isEdit = !!initialData?.id;

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: "",
  });

  useEffect(() => {
    if (open) {
      setData('name', initialData?.name || "");
      clearErrors();
    }
  }, [open, initialData]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isEdit) {
      handleInertiaPromise(
        // --- PERBAIKAN: Kirim 'options' saja. 'data' sudah otomatis disertakan oleh useForm. ---
        (options) => put(`/roles/${initialData!.id}`, options),
        {
          loadingText: 'Mengubah role...',
          successText: 'Role berhasil diubah!',
          errorText: 'Gagal mengubah role.',
          onSuccess: onClose,
        }
      );
    } else {
      handleInertiaPromise(
        // --- PERBAIKAN: Sama seperti di atas untuk 'post'. ---
        (options) => post("/roles", options),
        {
          loadingText: 'Menambah role...',
          successText: 'Role berhasil ditambahkan!',
          errorText: 'Gagal menambah role.',
          onSuccess: onClose,
        }
      );
    }
  }

  const hasChanged = isEdit ? data.name !== initialData?.name : true;
  const canSubmit = data.name.trim() !== "" && hasChanged;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Role" : "Tambah Role"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Anda sedang mengubah role "${initialData?.name}".`
              : "Buat role baru untuk mengatur izin akses pengguna."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid w-full items-center gap-1.5">
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
            <Button type="submit" disabled={processing || !canSubmit}>
              {isEdit ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
