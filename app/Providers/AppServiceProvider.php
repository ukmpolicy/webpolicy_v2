<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword; // Import Notifikasi ResetPassword bawaan
use App\Mail\CustomResetPassword; // Import Mailable ResetPassword kustom Anda
use Illuminate\Auth\Notifications\VerifyEmail; // Import Notifikasi VerifyEmail bawaan (jika Anda ingin memindahkannya ke sini juga)
use App\Mail\CustomVerifyEmail;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Kustomisasi email verifikasi
        VerifyEmail::toMailUsing(function ($notifiable, $url) {
            // Cukup kembalikan instance Mailable
            return new CustomVerifyEmail($notifiable);
        });

        // Kustomisasi email reset password
        ResetPassword::toMailUsing(function ($notifiable, $token) {
            // Cukup kembalikan instance Mailable
            return new CustomResetPassword($token, $notifiable);
        });
    }
}
