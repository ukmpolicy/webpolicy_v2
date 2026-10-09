# Panduan Kontribusi Web POLICY

## Alur Kerja (Workflow)

1. Buat branch fitur dari branch `development`.
2. Lakukan perubahan sesuai kebutuhan.
3. Buat commit menggunakan format yang telah ditentukan.
4. Pull pembaruan terbaru dari branch `development` untuk memastikan branch tetap sinkron.
5. Push branch fitur ke remote repository.
6. Buat Pull Request (PR) dari branch fitur ke `main`.
7. Setelah PR disetujui, lakukan merge ke `main`.

---

## Penamaan Branch

Gunakan format:

```text
feature/<nama-perubahan>
````

**Contoh:**

* `feature/update-excel-dependencies`
* `feature/fix-navigation`
* `feature/update-policy`

---

## Aturan Commit

Gunakan salah satu prefix berikut pada pesan commit Anda:

* `feat:` Perubahan yang menambahkan atau mengubah fungsionalitas.
* `refactor:` Perubahan pada struktur atau implementasi kode tanpa mengubah fungsionalitas.
* `chore:` Perubahan pemeliharaan yang tidak berkaitan langsung dengan fungsionalitas aplikasi.

**Contoh:**

```text
feat: add login page
refactor: simplify authentication service
chore: update excel dependencies
```

---

## Pull Request (PR)

Sebelum membuat Pull Request, pastikan:

* Branch fitur sudah disinkronkan dengan `development`.
* Perubahan telah diuji dengan baik.
* Tidak terdapat masalah yang diketahui akibat perubahan tersebut.
* Commit menggunakan prefix yang sesuai.
* Judul dan deskripsi PR menjelaskan perubahan yang dilakukan secara jelas.

**Target Pull Request:**

```text
feature/<nama-perubahan> → main
```

> **Catatan:** Usahakan setiap branch dan Pull Request hanya berisi perubahan yang berkaitan dengan satu tujuan kontribusi spesifik.

