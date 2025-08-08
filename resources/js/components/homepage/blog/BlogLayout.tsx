import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import { Head } from '@inertiajs/react';
import React from 'react';
import { Toaster } from 'sonner';

interface BlogLayoutProps {
    children: React.ReactNode;
    title: string;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, title }) => {
    return (
        <>
            <Head title={title} />
            <AppHeader />
            <main className="min-h-screen bg-black pt-0 text-white">{children}</main>
            <AppFooter />
            <Toaster />
        </>
    );
};

export default BlogLayout;
