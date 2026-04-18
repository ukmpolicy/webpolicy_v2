<?php

namespace App\Services;

use App\Repositories\JenisBerkasRepository;

class JenisBerkasService
{
    protected $jenisBerkasRepository;

    public function __construct(JenisBerkasRepository $jenisBerkasRepository)
    {
        $this->jenisBerkasRepository = $jenisBerkasRepository;
    }

    public function getAllJenisBerkas()
    {
        return $this->jenisBerkasRepository->getAll();
    }

    public function getAllAktif()
    {
        return $this->jenisBerkasRepository->getAllAktif();
    }

    public function getJenisBerkas($id)
    {
        return $this->jenisBerkasRepository->find($id);
    }

    public function createJenisBerkas(array $data)
    {
        return $this->jenisBerkasRepository->create($data);
    }

    public function updateJenisBerkas($id, array $data)
    {
        return $this->jenisBerkasRepository->update($id, $data);
    }

    public function deleteJenisBerkas($id)
    {
        return $this->jenisBerkasRepository->delete($id);
    }
}
