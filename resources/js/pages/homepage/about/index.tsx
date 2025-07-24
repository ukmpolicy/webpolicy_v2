import AboutLogo from '@/components/about/app-about-logo';
import AboutHistory from '@/components/about/app-history';
import AboutIntro from '@/components/about/app-intro';
import SectionLabel from '@/components/about/app-label';
import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import AppLoading from '@/components/homepage/app-loading';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

const AboutPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <AppLoading />;
    return (
        <>
            <Head title="About - UKM POLICY" />
            <AppHeader />
            <main className="bg-black pt-18 text-white">
                <SectionLabel />
                <AboutIntro />
                <AboutHistory />
                <AboutLogo />
                {/* <AboutTeam /> */}
            </main>
            <AppFooter />
        </>
    );
};

export default AboutPage;
