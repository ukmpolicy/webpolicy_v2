<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Models\User;
use App\Models\Member; // Import model Member
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon; // Import Carbon untuk manipulasi tanggal

class ProfileUserController extends Controller
{
    /**
     * Menampilkan halaman profil user.
     */
    public function index()
    {
        $user = auth()->user();

        // Cari data member yang sesuai dengan email user
        $member = Member::where('email', $user->email)->first();

        // Siapkan variabel untuk notifikasi ulang tahun
        $isBirthday = false;
        $memberName = $user->name;

        // Periksa jika member ditemukan dan memiliki tanggal lahir
        if ($member && $member->birth_date_at) {
            $memberBirthDate = Carbon::parse($member->birth_date_at);
            // Periksa apakah bulan dan hari cocok dengan tanggal hari ini
            if ($memberBirthDate->format('m-d') === Carbon::now()->format('m-d')) {
                $isBirthday = true;
            }
            $memberName = $member->name; // Gunakan nama dari tabel members
        }

        return Inertia::render('homepage/profile-user/index', [
            'user' => $user->only('name', 'email', 'picture', 'bio', 'created_at', 'updated_at'),
            'isBirthday' => $isBirthday, // Mengirim flag ke frontend
            'memberName' => $memberName,   // Mengirim nama member ke frontend
        ]);
    }

    /**
     * Memperbarui informasi profil user.
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        // Validasi data yang diterima dari request
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'picture' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
        ]);

        // Jika ada gambar baru diunggah
        if ($request->hasFile('picture')) {
            // Hapus gambar lama jika ada
            if ($user->picture) {
                Storage::disk('public')->delete($user->picture);
            }
            // Simpan gambar baru
            $user->picture = $request->file('picture')->store('profile-pictures', 'public');
        }

        // Perbarui data user (nama dan bio)
        $user->name = $validatedData['name'];
        $user->bio = $validatedData['bio'];

        $user->save();

        return Redirect::back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Menghapus akun user.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
