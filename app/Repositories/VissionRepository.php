<?php

namespace App\Repositories;

use App\Models\Period;
use App\Models\Vission;

class VissionRepository
{
    /**
     * Membuat Visi baru untuk sebuah Periode.
     *
     * @param Period $period
     * @param array $vissionDetails
     * @return Vission
     */
    public function createForPeriod(Period $period, array $vissionDetails): Vission
    {
        // Pastikan relasi di model Period bernama 'visions'
        return $period->vissions()->create($vissionDetails);
    }

    /**
     * Mengubah data Visi yang sudah ada.
     *
     * @param Vission $vission
     * @param array $newDetails
     * @return bool
     */
    public function update(Vission $vission, array $newDetails): bool
    {
        return $vission->update($newDetails);
    }

    /**
     * Menghapus sebuah Visi.
     *
     * @param Vission $vission
     * @return bool
     */
    public function delete(Vission $vission): bool
    {
        return $vission->delete();
    }
}
