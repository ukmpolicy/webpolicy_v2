<?php

namespace App\Repositories;

use App\Models\Pendaftaran;

class PendaftaranRepository
{
    public function getAll()
    {
        return Pendaftaran::with(['user', 'period'])->orderBy('created_at', 'desc')->get();
    }

    public function getById($id)
    {
        return Pendaftaran::with(['user', 'period'])->findOrFail($id);
    }

    public function getByUserId($userId)
    {
        return Pendaftaran::with(['period'])->where('user_id', $userId)->get();
    }

    public function getByPeriodId($periodId)
    {
        return Pendaftaran::with(['user'])->where('period_id', $periodId)->get();
    }

    public function create(array $data)
    {
        return Pendaftaran::create($data);
    }

    public function update($id, array $data)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        $pendaftaran->update($data);
        return $pendaftaran;
    }

    public function updateStatus($id, $status, $feedback = null)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        $pendaftaran->update([
            'status' => $status,
            'feedback' => $feedback
        ]);
        return $pendaftaran;
    }

    public function delete($id)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        return $pendaftaran->delete();
    }

    public function checkExists($userId, $nim, $periodId)
    {
        return Pendaftaran::where('period_id', $periodId)
            ->where(function ($query) use ($userId, $nim) {
                $query->where('user_id', $userId)
                      ->orWhere('nim', $nim);
            })
            ->exists();
    }
}
