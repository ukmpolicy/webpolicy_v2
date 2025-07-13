import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
interface Mission {
  id: number;
  content: string;
}

interface Period {
  id: number;
  name: string;
  is_active: boolean;
  missions: Mission[];
}

interface MissionManagementModalProps {
  open: boolean;
  onClose: () => void;
  period: Period | null;
}

export function MissionManagementModal({ open, onClose, period }: MissionManagementModalProps) {
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null);

  const { data: newData, setData: setNewData, post, processing: isAdding, errors: addErrors, reset: resetAddForm } = useForm({
    content: "",
  });

  const { data: editData, setData: setEditData, put, processing: isEditing, errors: editErrors, reset: resetEditForm, clearErrors: clearEditErrors } = useForm({
    id: 0,
    content: "",
  });

  function handleAddMission(e: React.FormEvent) {
    e.preventDefault();
    if (!period) return;

    post(`/periods/${period.id}/missions`, {
      onSuccess: () => {
        toast.success("Misi berhasil ditambahkan!");
        resetAddForm();
        router.reload({ only: ['periods'] });
      },
      onError: () => toast.error("Gagal menambahkan misi. Periksa kembali isian Anda."),
      preserveScroll: true,
    });
  }

  function confirmDeleteMission() {
    if (!missionToDelete) return;

    router.delete(`/missions/${missionToDelete.id}`, {
      onSuccess: () => {
        toast.success("Misi berhasil dihapus!");
        setMissionToDelete(null);
      },
      onError: () => toast.error("Gagal menghapus misi."),
      preserveScroll: true,
      onFinish: () => setMissionToDelete(null),
    });
  }

  function startEditing(mission: Mission) {
    setEditData({ id: mission.id, content: mission.content });
  }

  function cancelEditing() {
    resetEditForm();
    clearEditErrors();
  }

  function handleUpdateMission(e: React.FormEvent) {
    e.preventDefault();
    put(`/missions/${editData.id}`, {
        onSuccess: () => {
            toast.success("Misi berhasil diubah!");
            cancelEditing();
            router.reload({ only: ['periods'] });
        },
        onError: () => toast.error("Gagal mengubah misi. Periksa kembali isian Anda."),
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
            <DialogTitle>Kelola Misi untuk Periode: {period.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 mt-4">
            {period.missions && period.missions.length > 0 ? period.missions.map(mission => (
              <div key={mission.id} className="flex items-center gap-2 p-2 rounded-md border">
                {editData.id === mission.id ? (
                  <form onSubmit={handleUpdateMission} className="flex-grow flex items-center gap-2">
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
                    <span className="flex-grow">{mission.content}</span>
                    <Button size="icon" variant="ghost" onClick={() => startEditing(mission)} disabled={!period.is_active} title="Ubah Misi">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => setMissionToDelete(mission)} disabled={!period.is_active} title="Hapus Misi">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada misi untuk periode ini.</p>
            )}
          </div>

          {period.is_active ? (
              <form onSubmit={handleAddMission} className="mt-6 pt-4 border-t">
                <label className="font-medium text-sm">Tambah Misi Baru</label>
                <div className="flex items-start gap-2 mt-2">
                  <div className="flex-grow">
                      <Input
                        type="text"
                        placeholder="Ketik misi baru di sini..."
                        value={newData.content}
                        onChange={e => setNewData('content', e.target.value)}
                        disabled={isAdding}
                      />
                      {addErrors.content && <div className="text-xs text-red-500 mt-1">{addErrors.content}</div>}
                  </div>
                  <Button type="submit" disabled={isAdding}>
                    {isAdding ? "Menyimpan..." : "Simpan Misi"}
                  </Button>
                </div>
              </form>
          ) : (
              <p className="text-sm text-center text-amber-600 mt-6 pt-4 border-t">Periode ini sudah tidak aktif, Anda tidak dapat mengubah data misi.</p>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!missionToDelete} onOpenChange={() => setMissionToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan. Ini akan menghapus misi secara permanen:
                      <br />
                      <strong className="mt-2 block">"{missionToDelete?.content}"</strong>
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setMissionToDelete(null)}>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDeleteMission} >
                      Ya, Hapus Misi
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
