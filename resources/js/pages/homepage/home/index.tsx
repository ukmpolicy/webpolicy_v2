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

interface HomePageProps {
    divisions: Division[];
    structureMembers: StructureMember[];
    isBirthday: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ divisions, structureMembers, isBirthday }) => {
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

    return (
        <>
            <Head title="UKM POLICY - KBMPNL" />

            <AppHeader isBirthday={isBirthday} />

            <main className="bg-black pt-18">
                <section className="relative">
                    <AppHero />
                    <HeroCountdownOverlay
                        openAt="2026-04-18 08:00:00"
                        closeAt="2026-05-05 23:59:59"
                        href="/open-recruitment"
                    />
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