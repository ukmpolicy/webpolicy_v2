// index.tsx
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

// Tambahkan prop isBirthday di interface
interface HomePageProps {
    divisions: Division[];
    structureMembers: StructureMember[];
    isBirthday: boolean;
}

// Tambahkan isBirthday sebagai parameter props
const HomePage: React.FC<HomePageProps> = ({ divisions, structureMembers, isBirthday }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Tambahkan useEffect untuk mengontrol kelas pada <body>
    useEffect(() => {
        // Saat komponen dimuat, tambahkan kelas 'public-theme'
        document.body.classList.add('public-theme');

        // Saat komponen tidak lagi digunakan, hapus kelasnya
        return () => {
            document.body.classList.remove('public-theme');
        };
    }, []); // Array kosong memastikan efek ini hanya berjalan sekali saat mount dan unmount

    if (isLoading) return <AppLoading />;

    return (
        <>
            <Head title="UKM POLICY - KBMPNL" />
            {/* Teruskan prop isBirthday ke komponen AppHeader */}
            <AppHeader isBirthday={isBirthday} />
            {/* Hapus 'pt-18' agar tidak ada ruang kosong di atas hero */}
            <main className="bg-black">
                <AppHero />
                <div className="border-t border-neutral-800">
                    <AppLabel />
                </div>
                <div className="border-t border-neutral-800">
                    <AppVisiMisi />
                </div>
                <div className="border-t border-neutral-800">
                    <AppLabel />
                </div>
                <div className="border-t border-neutral-800">
                    <AppBidang divisions={divisions} />
                </div>
                <div className="border-t border-neutral-800">
                    <AppStruktural strukturalList={structureMembers} />
                </div>
            </main>
            <AppFooter />
        </>
    );
};

export default HomePage;
