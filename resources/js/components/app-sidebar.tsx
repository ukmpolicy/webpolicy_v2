import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Album, BookOpenText, CalendarRange, ClipboardList, Images, Layers, LayoutGrid, User2, UserCog, Users } from 'lucide-react';
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
        icon: ClipboardList,
    },
    {
        title: 'Kepengurusan',
        icon: Users,
        children: [
            {
                title: 'Periode',
                href: '/periods',
                icon: CalendarRange,
            },

            {
                title: 'Division',
                href: '/divisions',
                icon: Layers,
            },
            {
                title: 'Members',
                href: '/members',
                icon: User2,
            },
        ],
    },
    {
        title: 'Media',
        icon: Images,
        children: [
            {
                title: 'Album',
                href: '/gallery-album',
                icon: Album,
                children: [
                    {
                        title: 'Media',
                        href: '/gallery-media',
                        icon: Images,
                    },
                ],
            },
            {
                title: 'Categories',
                href: '/category-articles',
                icon: BookOpenText,
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
