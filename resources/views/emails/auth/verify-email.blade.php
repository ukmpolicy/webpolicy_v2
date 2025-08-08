<x-mail::message>
    {{-- Pindahkan konten logo dan nama aplikasi ke slot header --}}
    <x-slot:header>
        <div style="text-align: center;">
            <a href="{{ url('/') }}" style="text-decoration: none; color: inherit;">
                <img src="https://drive.google.com/uc?export=view&id=1TmrTqGBfdLCgkC7FSlm5plhyA8E1oXTB" alt="UKM-POLICY Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto 10px;" />
                <span style="font-size: 24px; font-weight: bold; color: #DC2626; display: block; margin-top: 5px;">UKM-POLICY</span>
            </a>
        </div>
    </x-slot:header>

# Selamat Datang di {{ $app_name }}!

Halo, {{ $user->name }}!

Terima kasih telah mendaftar di **{{ $app_name }}**. Kami sangat senang Anda bergabung!

Untuk menyelesaikan pendaftaran Anda dan mulai mengakses semua fitur keren yang kami tawarkan, mohon klik tombol di bawah ini untuk memverifikasi alamat email Anda:

<x-mail::button :url="$url" color="red">
Verifikasi Email Saya
</x-mail::button>

Jika Anda merasa tidak melakukan pendaftaran ini, atau jika Anda menerima email ini secara tidak sengaja, Anda tidak perlu melakukan tindakan lebih lanjut. Anda dapat dengan aman mengabaikan email ini.

Salam hormat,<br>
Tim {{ $app_name }}

    {{-- Pindahkan footer ke slot footer --}}
    <x-slot:footer>
        <x-mail::footer>
            © {{ date('Y') }} {{ config('app.name') }}. {{ __('All rights reserved.') }}
        </x-mail::footer>
    </x-slot:footer>
</x-mail::message>
