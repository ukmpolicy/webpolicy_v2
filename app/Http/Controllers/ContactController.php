<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail; // <-- 1. Import the Mailable class
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Menangani pengiriman form kontak.
     */
    public function send(Request $request)
    {
        // 1. Validasi data yang masuk dari form
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        try {
            // 2. Ambil email tujuan dari file .env
            $recipientEmail = env('MAIL_TO_ADDRESS');

            if (!$recipientEmail) {
                // Catat error jika variabel .env belum diatur
                Log::error('MAIL_TO_ADDRESS tidak diatur di file .env.');
                throw new \Exception('Konfigurasi email tujuan tidak ditemukan.');
            }

            // --- 3. PERUBAHAN UTAMA: Kirim email menggunakan Mailable yang pintar ---
            // Ini akan mengirim email di background (antrean) dan menggunakan 'replyTo'
            Mail::to($recipientEmail)->send(new ContactFormMail($validated));

            // 4. Kembalikan respons sukses (ini akan langsung terjadi, tidak menunggu email terkirim)
            return back()->with('success', 'Pesan Anda telah berhasil terkirim!');

        } catch (\Exception $e) {
            // Jika gagal, catat error dan kembalikan pesan error
            Log::error('Gagal mengirim email kontak: ' . $e->getMessage());

            return back()->with('error', 'Gagal mengirim pesan. Silakan coba lagi nanti.');
        }
    }
}
