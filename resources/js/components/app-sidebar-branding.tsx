import { SidebarHeader, SidebarMenuButton } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';
import AppearanceToggleTab from './appearance-tabs';

export default function AppSidebarBranding() {
    return (
        <SidebarHeader className="flex w-full flex-col gap-4 p-4">
            <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard" prefetch>
                    <div className="flex w-full items-center">
                        <div className="text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-md">
                            <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                        </div>
                        <div className="ml-2 grid flex-1 text-left text-sm">
                            <span className="mb-0.5 truncate leading-none font-semibold">Manager UKM-POLICY</span>
                        </div>
                    </div>
                </Link>
            </SidebarMenuButton>
            <div className="flex w-full justify-start">
                <AppearanceToggleTab />
            </div>
        </SidebarHeader>
    );
}
