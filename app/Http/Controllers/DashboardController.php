<?php

namespace App\Http\Controllers;

use App\Services\AlbumService;
use App\Services\BlogArticleService;
use App\Services\MediaService;
use App\Services\MemberService;
use App\Services\PeriodService;
use App\Services\PendaftaranService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $memberService;
    protected $periodService;
    protected $articleService;
    protected $mediaService;
    protected $albumService;
    protected $pendaftaranService;

    // Tambahkan service ke constructor
    public function __construct(
        MemberService $memberService, 
        PeriodService $periodService, 
        BlogArticleService $articleService, 
        AlbumService $albumService, 
        MediaService $mediaService,
        PendaftaranService $pendaftaranService
    ) {
        $this->memberService = $memberService;
        $this->periodService = $periodService;
        $this->articleService = $articleService;
        $this->albumService = $albumService;
        $this->mediaService = $mediaService;
        $this->pendaftaranService = $pendaftaranService;
    }
    public function index()
    {
        // Data Member
        $totalMembersCount = $this->memberService->getTotalMembersCount();
        $activePeriod = $this->periodService->getActivePeriod();
        $activeMembersCount = 0;
        $activePeriodName = 'Tidak Ada';

        if ($activePeriod) {
            $activeMembersCount = $this->memberService->getMembersCountByPeriod($activePeriod->id);
            $activePeriodName = $activePeriod->name;
        }

        // Data Artikel: Total, Published, dan Draft
        $totalArticlesCount = $this->articleService->getAllArticlesCount();
        $publishedArticlesCount = $this->articleService->getPublishedArticlesCount();
        $draftArticlesCount = $this->articleService->getDraftArticlesCount();

        // Data Dokumentasi & Album
        $totalMediaCount = $this->mediaService->getTotalMediaCount();
        $totalAlbumsCount = $this->albumService->getTotalAlbumsCount();
        $publicAlbumsCount = $this->albumService->getPublicAlbumsCount();
        $privateAlbumsCount = $this->albumService->getPrivateAlbumsCount();

        // Data Ulang Tahun: Ambil dan kelompokkan berdasarkan 'MM-DD'
        $membersWithBirthdays = $this->memberService->getAllMembersBirthdays();
        $birthdaysByDate = [];
        foreach ($membersWithBirthdays as $member) {
            if ($member->birth_date_at) {
                // Gunakan format 'MM-DD' sebagai kunci
                $dateKey = Carbon::parse($member->birth_date_at)->format('m-d');
                if (!isset($birthdaysByDate[$dateKey])) {
                    $birthdaysByDate[$dateKey] = [];
                }
                $birthdaysByDate[$dateKey][] = $member->name;
            }
        }

         // Mengambil 3 artikel terpopuler untuk dashboard
        $popularArticles = $this->articleService->getPopularArticles(3);

        // Recruitment Timeline - baca dari periode aktif (bukan settings table)
        $recruitmentTeaserDate = $activePeriod?->recruitment_teaser_at?->toIso8601String();
        $recruitmentStartDate  = $activePeriod?->recruitment_started_at?->toIso8601String();
        $recruitmentEndDate    = $activePeriod?->recruitment_ended_at?->toIso8601String();

        // Recruitment Data
        $totalApplicantsCount = $this->pendaftaranService->getTotalApplicantsCount($activePeriod ? $activePeriod->id : null);
        $pendingApplicantsCount = $this->pendaftaranService->getPendingApplicantsCount($activePeriod ? $activePeriod->id : null);

        return Inertia::render('dashboard', [
            'totalMembersCount' => $totalMembersCount,
            'activeMembersCount' => $activeMembersCount,
            'activePeriodName' => $activePeriodName,
            'totalArticlesCount' => $totalArticlesCount,
            'publishedArticlesCount' => $publishedArticlesCount,
            'draftArticlesCount' => $draftArticlesCount,
            'totalMediaCount' => $totalMediaCount,
            'totalAlbumsCount' => $totalAlbumsCount,
            'publicAlbumsCount' => $publicAlbumsCount,
            'privateAlbumsCount' => $privateAlbumsCount,
            'birthdays' => $birthdaysByDate,
            'popularArticles' => $popularArticles,
            'recruitmentTeaser' => $recruitmentTeaserDate,
            'recruitmentStart' => $recruitmentStartDate,
            'recruitmentEnd' => $recruitmentEndDate,
            'totalApplicantsCount' => $totalApplicantsCount,
            'pendingApplicantsCount' => $pendingApplicantsCount,
            'serverTime' => now()->toIso8601String(),
        ]);
    }
}
