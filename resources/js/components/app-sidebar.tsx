// resources/js/Components/AppSidebar.jsx (atau .tsx)
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react'; // Tambahkan usePage
import { Album, BookOpenText, Building2, CalendarRange, ClipboardList, FileText, Folder, Layers, LayoutGrid, User2, UserCog } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavGroup[] = [
    {
        title: 'Platform',
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
                permission: 'dashboard',
            },
            {
                title: 'Roles',
                href: '/roles',
                icon: UserCog,
                permission: 'roles',
            },
            {
                title: 'Permission',
                href: '/permissions',
                icon: ClipboardList,
                permission: 'permissions',
            },
        ],
    },
    {
        title: 'Kepengurusan',
        items: [
            {
                title: 'Periode',
                href: '/periods',
                icon: CalendarRange,
                permission: 'periods',
            },
            {
                title: 'Division',
                href: '/divisions',
                icon: Layers,
                permission: 'divisions',
            },
            {
                title: 'Members',
                href: '/members',
                icon: User2,
                permission: 'members',
            },
            {
                title: 'Structure',
                href: '/structures',
                icon: Building2,
                permission: 'structures',
            },
        ],
    },
    {
        title: 'Media',
        items: [
            {
                title: 'Galery',
                href: '/gallery-album',
                icon: Album,
                permission: 'gallery-album',
            },
            {
                title: 'Blog',
                href: '/articles',
                icon: BookOpenText,
                permission: 'articles',
                children: [
                    {
                        title: 'Category',
                        href: '/category-articles',
                        icon: Folder,
                        permission: 'category-articles',
                    },
                    {
                        title: 'Articles',
                        href: '/articles',
                        icon: FileText,
                        permission: 'articles',
                    },
                ],
            },
        ],
    },
];

type AuthProps = {
    permissions: string[];
    // tambahkan properti lain jika diperlukan
};

export function AppSidebar() {
    const { auth } = usePage().props as { auth?: AuthProps };
    const permissions = auth?.permissions || [];

    // Fungsi untuk memeriksa apakah user memiliki permission yang dibutuhkan
    const hasPermission = (permissionKey: string) => {
        return permissions.includes(permissionKey);
    };

    // Filter mainNavItems berdasarkan permission
    const filteredNavItems = mainNavItems
        .map((group) => {
            const filteredItems = group.items.filter((item) => {
                // Jika item memiliki children, cek permission untuk setiap child
                if (item.children) {
                    // Filter children yang memiliki permission
                    const filteredChildren = item.children.filter((child) => hasPermission(child.permission));
                    // Jika setidaknya satu child memiliki permission, item parent tetap ditampilkan
                    return filteredChildren.length > 0;
                }
                // Jika tidak ada children, cek permission untuk item itu sendiri
                return hasPermission(item.permission);
            });

            // Hapus group jika tidak ada item yang lolos filter
            if (filteredItems.length === 0) {
                return null;
            }

            return {
                ...group,
                items: filteredItems.map((item) => {
                    // Untuk item parent dengan children, pastikan children juga difilter
                    if (item.children) {
                        return {
                            ...item,
                            children: item.children.filter((child) => hasPermission(child.permission)),
                        };
                    }
                    return item;
                }),
            };
        })
        .filter((group) => group !== null); // Hapus group yang kosong

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
                {filteredNavItems.map((data, i) => (
                    <NavMain key={i} items={data.items} title={data.title} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
