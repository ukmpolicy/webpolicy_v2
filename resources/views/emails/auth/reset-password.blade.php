<x-mail::message>
    {{-- Header dengan Logo dan Nama Aplikasi (Sama seperti verify-email.blade.php) --}}
    <x-slot:header>
        <div style="text-align: center;">
            <a href="{{ url('/') }}" style="text-decoration: none; color: inherit;">
                <img src="https://drive.google.com/uc?export=view&id=1TmrTqGBfdLCgkC7FSlm5plhyA8E1oXTB" alt="UKM-POLICY Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto 10px;" />
                <span style="font-size: 24px; font-weight: bold; color: #DC2626; display: block; margin-top: 5px;">UKM-POLICY</span>
            </a>
        </div>
    </x-slot:header>

# Notifikasi Reset Password

Halo, {{ $user->name }}!

Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.

Silakan klik tombol di bawah ini untuk mereset password Anda:

<x-mail::button :url="route('password.reset', ['token' => $token, 'email' => $user->email])" color="red">
Reset Password
</x-mail::button>

Tautan reset password ini akan kedaluwarsa dalam waktu {{ config('auth.passwords.users.expire') }} menit.

Jika Anda tidak meminta reset password, tidak ada tindakan lebih lanjut yang diperlukan.

Salam hormat,<br>
Tim {{ $app_name }}

    {{-- Footer Email (Sama seperti verify-email.blade.php) --}}
    <x-slot:footer>
        <x-mail::footer>
            © {{ date('Y') }} UKM-POLICY. Hak cipta dilindungi.
        </x-mail::footer>
    </x-slot:footer>
</x-mail::message>
