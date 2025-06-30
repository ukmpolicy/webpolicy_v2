import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

    // Buka dropdown jika salah satu child aktif
    useEffect(() => {
        const newOpenMenus: { [key: string]: boolean } = {};
        items.forEach((item) => {
            if (item.children && item.children.some((c) => c.href === page.url)) {
                newOpenMenus[item.title] = true;
            }
        });
        setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
    }, [page.url, items]);

    const toggleMenu = (title: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.children ? (
                            <>
                                <SidebarMenuButton
                                    asChild={false}
                                    isActive={item.children.some((c) => c.href === page.url)}
                                    tooltip={{ children: item.title }}
                                    onClick={(e) => toggleMenu(item.title, e)}
                                    className={`flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-2 transition-colors ${
                                        openMenus[item.title] ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </span>
                                    <span>{openMenus[item.title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
                                </SidebarMenuButton>
                                {openMenus[item.title] && (
                                    <SidebarMenu className="mt-1 ml-6 border-l border-gray-200 dark:border-gray-700">
                                        {item.children.map((child) => (
                                            <SidebarMenuItem key={child.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={child.href === page.url}
                                                    tooltip={{ children: child.title }}
                                                    className="flex items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                                                >
                                                    <Link href={child.href} prefetch>
                                                        {child.icon && <child.icon className="opacity-60" />}
                                                        <span>{child.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                )}
                            </>
                        ) : (
                            <SidebarMenuButton
                                asChild
                                isActive={item.href === page.url}
                                tooltip={{ children: item.title }}
                                className="flex items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
