<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use App\Mail\CustomResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use App\Mail\CustomVerifyEmail;
use Inertia\Inertia;
use App\Services\BlogArticleService;

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
            return new CustomVerifyEmail($notifiable);
        });

        // Kustomisasi email reset password
        ResetPassword::toMailUsing(function ($notifiable, $token) {
            return new CustomResetPassword($token, $notifiable);
        });

        // 🔹 Share berita terbaru ke semua halaman Inertia
        Inertia::share('latestArticles', function () {
            return app(BlogArticleService::class)->getLatestRecommendedArticles(5);
        });
    }
}
