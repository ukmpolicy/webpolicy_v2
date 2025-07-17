import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";

import AppHeader from "@/components/homepage/app-header";
import AppHero from "@/components/homepage/app-hero";
import AppLoading from "@/components/homepage/app-loading";
import AppFooter from "@/components/homepage/app-footer";
import AppVisiMisi from "@/components/homepage/app-visi-misi";
import AppLabel from "@/components/homepage/app-label";
import AppBidang from "@/components/homepage/app-bidang";
import AppStruktural from "@/components/homepage/app-struktural";

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
      <main className="pt-18 bg-black">
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
