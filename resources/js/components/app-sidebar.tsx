import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Building2, Album, CalendarRange, Images, Layers, LayoutGrid, UserCog, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: UserCog,
    },
    {
        title: 'Permission',
        href: '/permissions',
        icon: UserCog,
    },
    {
        title: 'Periode',
        href: '/periods',
        icon: CalendarRange,
    },
    {
        title: 'Members',
        href: '/members',
        icon: Users,
    },
    {
        title: 'Structures',
        icon: Building2,
        children: [
            {
                title: 'Structure',
                href: '/structures',
                icon: Building2,
            },
        ],
    },
    {
        title: 'Divisions',
        icon: Layers,
        children: [
            {
                title: 'Division',
                href: '/divisions',
                icon: Layers,
            },
            {
                title: 'Division Plans',
                href: '/division-plans',
                icon: Layers,
            },
        ],
    },

    {
        title: 'Gallery',
        icon: Images,
        children: [
            // {
            //     title: 'Media',
            //     href: '/gallery-media',
            //     icon: Image,
            // },
            {
                title: 'Album',
                href: '/gallery-album',
                icon: Album,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
