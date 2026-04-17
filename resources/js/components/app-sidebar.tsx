import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { NavGroup } from '@/types';
import { usePage } from '@inertiajs/react';
import { Album, BookOpenText, Building2, CalendarRange, ClipboardCheck, ClipboardList, FileText, Folder, Layers, LayoutGrid, User2, UserCog } from 'lucide-react';
import AppSidebarBranding from './app-sidebar-branding';

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
        title: 'Open Recruitment',
        items: [
            {
                title: 'Pendaftaran',
                href: '/pendaftaran',
                icon: ClipboardCheck,
                permission: 'dashboard',
            },
            {
                title: 'Kuisioner',
                href: '/kuisioner',
                icon: FileText,
                permission: 'dashboard',
            },
            {
                title: 'Dokumen Berkas',
                href: '/dokumen-berkas',
                icon: Folder,
                permission: 'dashboard',
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
};

export function AppSidebar() {
    const { auth } = usePage().props as { auth?: AuthProps };
    const permissions = auth?.permissions || [];

    const hasPermission = (permissionKey: string) => {
        return permissions.includes(permissionKey);
    };

    const filteredNavItems = mainNavItems
        .map((group) => {
            const filteredItems = group.items.filter((item) => {
                if (item.children) {
                    const filteredChildren = item.children.filter((child) => hasPermission(child.permission));
                    return filteredChildren.length > 0;
                }
                return hasPermission(item.permission);
            });

            if (filteredItems.length === 0) {
                return null;
            }

            return {
                ...group,
                items: filteredItems.map((item) => {
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
        .filter((group) => group !== null);

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* Mengganti header lama dengan komponen baru */}
            <AppSidebarBranding />

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
