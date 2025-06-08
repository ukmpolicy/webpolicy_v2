import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Toaster } from '@/components/ui/sonner';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { user } = usePage().props.auth as { user: any };

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />

                {user && user.email_verified_at == null && (
                    <div className="px-3">
                        <div className="rounded-lg border border-blue-500 bg-blue-500/10 p-4">
                            <p>
                                Please verify your email address.{' '}
                                <a href="/verify-email" className="text-green-500 underline hover:text-green-700">
                                    verify email here
                                </a>
                            </p>
                        </div>
                    </div>
                )}

                {children}
            </AppContent>

            <Toaster />
        </AppShell>
    );
}
