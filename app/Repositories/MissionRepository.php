<?php

namespace App\Repositories;

use App\Models\Period;
use App\Models\Mission;

class MissionRepository
{
    /**
     * Membuat Misi baru untuk sebuah Periode.
     *
     * @param Period $period
     * @param array $missionDetails
     * @return Mission
     */
    public function createForPeriod(Period $period, array $missionDetails): Mission
    {
        // Pastikan relasi di model Period bernama 'missions'
        return $period->missions()->create($missionDetails);
    }

    /**
     * Mengubah data Misi yang sudah ada.
     *
     * @param Mission $mission
     * @param array $newDetails
     * @return bool
     */
    public function update(Mission $mission, array $newDetails): bool
    {
        return $mission->update($newDetails);
    }

    /**
     * Menghapus sebuah Misi.
     *
     * @param Mission $mission
     * @return bool
     */
    public function delete(Mission $mission): bool
    {
        return $mission->delete();
    }
}
