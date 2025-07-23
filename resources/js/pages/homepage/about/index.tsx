import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AppHeader from "@/components/homepage/app-header";
import AppFooter from "@/components/homepage/app-footer";
import AboutIntro from "@/components/about/app-intro";
import AppLoading from "@/components/homepage/app-loading";
import AboutLogo from "@/components/about/app-about-logo";
import AboutHistory from "@/components/about/app-history";
import SectionLabel from "@/components/about/app-label";

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
      <main className="pt-18 bg-black text-white">
        <SectionLabel/>
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
