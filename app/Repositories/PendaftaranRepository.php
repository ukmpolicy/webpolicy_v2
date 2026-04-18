<?php

namespace App\Repositories;

use App\Models\Pendaftaran;

class PendaftaranRepository
{
    public function getAll(?int $periodId = null, ?string $status = null)
    {
        $query = Pendaftaran::with(['user', 'period', 'dokumen.jenisBerkas', 'jawaban.pertanyaan']);

        if ($periodId) {
            $query->where('period_id', $periodId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function find($id)
    {
        return Pendaftaran::with(['user', 'period', 'dokumen.jenisBerkas', 'jawaban.pertanyaan'])
            ->findOrFail($id);
    }

    public function findByUser(int $userId, int $periodId)
    {
        return Pendaftaran::withTrashed()
            ->where('user_id', $userId)
            ->where('period_id', $periodId)
            ->with(['dokumen.jenisBerkas', 'jawaban.pertanyaan'])
            ->first();
    }

    public function create(array $data)
    {
        return Pendaftaran::create($data);
    }

    public function update($id, array $data)
    {
        $pendaftaran = Pendaftaran::withTrashed()->findOrFail($id);
        
        if ($pendaftaran->trashed()) {
            $pendaftaran->restore();
        }
        
        $pendaftaran->update($data);
        return $pendaftaran;
    }

    public function delete($id)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        return $pendaftaran->delete();
    }

    public function updateStatus($id, string $status, ?string $feedback = null)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        $pendaftaran->update([
            'status'      => $status,
            'feedback'    => $feedback,
            'reviewed_at' => now(),
        ]);
        return $pendaftaran;
    }

    public function countByStatus(int $periodId): array
    {
        return [
            'pending'  => Pendaftaran::where('period_id', $periodId)->where('status', 'pending')->count(),
            'accepted' => Pendaftaran::where('period_id', $periodId)->where('status', 'accepted')->count(),
            'rejected' => Pendaftaran::where('period_id', $periodId)->where('status', 'rejected')->count(),
            'total'    => Pendaftaran::where('period_id', $periodId)->count(),
        ];
    }
}
