<?php

namespace App\Services;

use App\Repositories\PertanyaanKuesionerRepository;

class PertanyaanKuesionerService
{
    protected $pertanyaanRepository;

    public function __construct(PertanyaanKuesionerRepository $pertanyaanRepository)
    {
        $this->pertanyaanRepository = $pertanyaanRepository;
    }

    public function getAllPertanyaan()
    {
        return $this->pertanyaanRepository->getAll();
    }

    public function getAllAktif()
    {
        return $this->pertanyaanRepository->getAllAktif();
    }

    public function getPertanyaan($id)
    {
        return $this->pertanyaanRepository->find($id);
    }

    public function createPertanyaan(array $data)
    {
        return $this->pertanyaanRepository->create($data);
    }

    public function updatePertanyaan($id, array $data)
    {
        return $this->pertanyaanRepository->update($id, $data);
    }

    public function deletePertanyaan($id)
    {
        return $this->pertanyaanRepository->delete($id);
    }
}
