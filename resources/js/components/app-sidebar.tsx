import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavGroup, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Building2, Album, CalendarRange, Layers, LayoutGrid, UserCog, Users, ClipboardList, DotIcon, User2, BookOpenText } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavGroup[] = [
    {
        title: "Platform",
        items: [
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
        ]
    }, {
        title: "Kepengurusan",
        items: [
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
            {
                title: 'Structure',
                href: '/structures',
                icon: Building2,
            },
        ]
    }, {
        title: "Media",
        items: [
            {
                title: 'Galery',
                href: '/gallery-album',
                icon: Album,
            },
            {
                title: 'Blog',
                href: '/gallery-album',
                icon: BookOpenText,
                children: [
                    {
                        title: 'Category',
                        href: '/category-articles',
                        icon: DotIcon,
                    },
                ],
            },
        ]
    }
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
                {mainNavItems.map((data, i) => (
                    <NavMain key={i} items={data.items} title={data.title} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
