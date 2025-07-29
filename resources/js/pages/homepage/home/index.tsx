import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import AppBidang from '@/components/homepage/app-bidang';
import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import AppHero from '@/components/homepage/app-hero';
import AppLabel from '@/components/homepage/app-label';
import AppLoading from '@/components/homepage/app-loading';
import AppStruktural from '@/components/homepage/app-struktural';
import AppVisiMisi from '@/components/homepage/app-visi-misi';
import { toast } from 'sonner';


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
}

const HomePage: React.FC<HomePageProps> = ({ divisions, structureMembers }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <AppLoading />;

    return (
        <>
            <Head title="Home - UKM POLICY" />
            <AppHeader />
            <main className="bg-black pt-18">
                <AppHero />
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
