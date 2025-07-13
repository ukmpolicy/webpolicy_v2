import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// --- TAMBAHAN: Import komponen AlertDialog ---
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit, Save, X } from "lucide-react";

// Definisikan tipe data untuk keamanan tipe
interface Vission {
  id: number;
  content: string;
}

interface Period {
  id: number;
  name: string;
  is_active: boolean;
  vissions: Vission[];
}

interface VissionManagementModalProps {
  open: boolean;
  onClose: () => void;
  period: Period | null;
}

export function VissionManagementModal({ open, onClose, period }: VissionManagementModalProps) {
  // --- TAMBAHAN: State untuk mengontrol modal konfirmasi hapus ---
  const [vissionToDelete, setVissionToDelete] = useState<Vission | null>(null);

  // Form helper untuk menambah Visi BARU
  const { data: newData, setData: setNewData, post, processing: isAdding, errors: addErrors, reset: resetAddForm } = useForm({
    content: "",
  });

  // Form helper untuk MENGEDIT Visi YANG SUDAH ADA
  const { data: editData, setData: setEditData, put, processing: isEditing, errors: editErrors, reset: resetEditForm, clearErrors: clearEditErrors } = useForm({
    id: 0,
    content: "",
  });

  // --- Event Handlers ---

  function handleAddVission(e: React.FormEvent) {
    e.preventDefault();
    if (!period) return;

    post(`/periods/${period.id}/vissions`, {
      onSuccess: () => {
        toast.success("Visi berhasil ditambahkan!");
        resetAddForm();
        router.reload({ only: ['periods'] });
      },
      onError: () => toast.error("Gagal menambahkan visi. Periksa kembali isian Anda."),
      preserveScroll: true,
    });
  }

  // --- PERUBAHAN: Fungsi ini sekarang dipanggil dari AlertDialog ---
  function confirmDeleteVission() {
    if (!vissionToDelete) return;

    router.delete(`/vissions/${vissionToDelete.id}`, {
      onSuccess: () => {
        toast.success("Visi berhasil dihapus!");
        setVissionToDelete(null); // Tutup modal konfirmasi
      },
      onError: () => toast.error("Gagal menghapus visi."),
      preserveScroll: true,
      // onFinish untuk memastikan state bersih bahkan jika ada error
      onFinish: () => setVissionToDelete(null),
    });
  }

  function startEditing(vission: Vission) {
    setEditData({ id: vission.id, content: vission.content });
  }

  function cancelEditing() {
    resetEditForm();
    clearEditErrors();
  }

  function handleUpdateVission(e: React.FormEvent) {
    e.preventDefault();
    put(`/vissions/${editData.id}`, {
        onSuccess: () => {
            toast.success("Visi berhasil diubah!");
            cancelEditing();
            router.reload({ only: ['periods'] });
        },
        onError: () => toast.error("Gagal mengubah visi. Periksa kembali isian Anda."),
        preserveScroll: true,
    });
  }

  useEffect(() => {
    resetAddForm();
    cancelEditing();
  }, [period, open]);

  if (!period) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kelola Visi untuk Periode: {period.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 mt-4">
            {period.vissions && period.vissions.length > 0 ? period.vissions.map(vission => (
              <div key={vission.id} className="flex items-center gap-2 p-2 rounded-md border">
                {editData.id === vission.id ? (
                  <form onSubmit={handleUpdateVission} className="flex-grow flex items-center gap-2">
                    <div className="flex-grow">
                      <Input
                          type="text"
                          value={editData.content}
                          onChange={(e) => setEditData('content', e.target.value)}
                          className="flex-grow"
                          autoFocus
                      />
                      {editErrors.content && <div className="text-xs text-red-500 mt-1">{editErrors.content}</div>}
                    </div>
                    <Button type="submit" size="icon" variant="outline" disabled={isEditing} title="Simpan">
                        <Save className="w-4 h-4" />
                    </Button>
                    <Button type="button" size="icon" variant="ghost" onClick={cancelEditing} title="Batal">
                        <X className="w-4 h-4" />
                    </Button>
                  </form>
                ) : (
                  <>
                    <span className="flex-grow">{vission.content}</span>
                    <Button size="icon" variant="ghost" onClick={() => startEditing(vission)} disabled={!period.is_active} title="Ubah Visi">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {/* --- PERUBAHAN: Tombol hapus sekarang membuka AlertDialog --- */}
                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => setVissionToDelete(vission)} disabled={!period.is_active} title="Hapus Visi">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada visi untuk periode ini.</p>
            )}
          </div>

          {period.is_active ? (
              <form onSubmit={handleAddVission} className="mt-6 pt-4 border-t">
                <label className="font-medium text-sm">Tambah Visi Baru</label>
                <div className="flex items-start gap-2 mt-2">
                  <div className="flex-grow">
                      <Input
                        type="text"
                        placeholder="Ketik visi baru di sini..."
                        value={newData.content}
                        onChange={e => setNewData('content', e.target.value)}
                        disabled={isAdding}
                      />
                      {addErrors.content && <div className="text-xs text-red-500 mt-1">{addErrors.content}</div>}
                  </div>
                  <Button type="submit" disabled={isAdding}>
                    {isAdding ? "Menyimpan..." : "Simpan Visi"}
                  </Button>
                </div>
              </form>
          ) : (
              <p className="text-sm text-center text-amber-600 mt-6 pt-4 border-t">Periode ini sudah tidak aktif, Anda tidak dapat mengubah data visi.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* --- TAMBAHAN BARU: Komponen AlertDialog untuk Konfirmasi Hapus --- */}
      <AlertDialog open={!!vissionToDelete} onOpenChange={() => setVissionToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan. Ini akan menghapus visi secara permanen:
                      <br />
                      <strong className="mt-2 block">"{vissionToDelete?.content}"</strong>
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setVissionToDelete(null)}>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDeleteVission}>
                      Ya, Hapus Visi
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
