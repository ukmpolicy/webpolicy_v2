import { Head } from '@inertiajs/react';
import FormHeader from '@/components/open-recruitment/FormHeader';
import OpenRecruitmentForm from '@/components/open-recruitment/OpenRecruitmentForm';
import type { OpenRecruitmentPageProps } from '@/components/open-recruitment/types';

export default function Create({ period }: OpenRecruitmentPageProps) {
    return (
        <>
            <Head title="Open Recruitment" />

            <main className="min-h-screen bg-background">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                    <FormHeader period={period} />
                    <OpenRecruitmentForm period={period} />
                </div>
            </main>
        </>
    );
}