import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import AppBidang from '@/components/homepage/app-bidang';
import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import AppHero from '@/components/homepage/app-hero';
import AppLabel from '@/components/homepage/app-label';
import AppLoading from '@/components/homepage/app-loading';
import HeroCountdownOverlay from '@/components/homepage/open-recruitment/HeroCountdownOverlay';
import AppStruktural from '@/components/homepage/app-struktural';
import AppVisiMisi from '@/components/homepage/app-visi-misi';

interface Division {
    id: number;
    name: string;
    description?: string;
}

interface StructureMember {
    id: number;
    name: string;
    position: string;
    picture?: string | null;
}

interface Period {
    id: number;
    name: string;
    is_active: boolean;
    is_open_recruitment: boolean;
    recruitment_announcement_at?: string;
    recruitment_started_at?: string;
    recruitment_ended_at?: string;
}

interface HomePageProps {
    divisions: Division[];
    structureMembers: StructureMember[];
    isBirthday: boolean;
    period?: Period;
}

const HomePage: React.FC<HomePageProps> = ({ divisions, structureMembers, isBirthday, period }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        document.body.classList.add('public-theme');

        return () => {
            document.body.classList.remove('public-theme');
        };
    }, []);

    if (isLoading) return <AppLoading />;

    // Cek apakah open recruitment disetujui untuk ditampilkan berdasarkan periode berjalan
    const now = new Date();
    const announcementDate = period?.recruitment_announcement_at ? new Date(period.recruitment_announcement_at) : null;
    const isPastAnnouncement = announcementDate ? now >= announcementDate : true; // Jika tidak ada announcement_at, tampilkan saja
    const showRecruitment = period?.is_open_recruitment && period?.recruitment_started_at && isPastAnnouncement;

    return (
        <>
            <Head title="UKM POLICY - KBMPNL" />

            <AppHeader isBirthday={isBirthday} />

            <main className="bg-black pt-18">
                <section className="relative">
                    <AppHero showRecruitment={showRecruitment} period={period} />
                </section>

                <AppLabel />
                <AppVisiMisi />
                <AppLabel />

                <AppBidang divisions={divisions} />
                <AppStruktural strukturalList={structureMembers} />
            </main>

            <AppFooter />
        </>
    );
};

export default HomePage;