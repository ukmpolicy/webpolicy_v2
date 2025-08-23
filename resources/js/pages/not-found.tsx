import { Head, Link } from '@inertiajs/react';

export default function NotFoundPage() {
    return (
        <>
            <Head title="Halaman Tidak Ditemukan" />
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12 text-white sm:px-6 lg:px-8">
                {/* Background Layer 1: Radial Gradient */}
                <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 opacity-80"></div>

                {/* Background Layer 2: Grid/Dots Pattern */}
                <div className="pointer-events-none absolute inset-0 z-0 [background-size:10px_10px] opacity-50 [background:repeating-radial-gradient(circle_at_center,_transparent_0,_#27272a_1px,_transparent_2px,_transparent_10px)]"></div>

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-xl text-center">
                    <h1 className="mb-4 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-8xl font-extrabold tracking-tight text-transparent md:text-9xl lg:text-[10rem]">
                        404
                    </h1>
                    <div className="relative z-10 inline-block rounded-md bg-zinc-800/80 px-3 py-1.5 text-sm font-medium tracking-wider text-white uppercase backdrop-blur-sm md:text-base">
                        Halaman Tidak Ditemukan
                    </div>
                    <p className="my-8 text-lg text-white/70 md:text-xl">
                        Maaf, halaman yang Anda cari tidak ada. Mungkin URL telah salah diketik atau halaman telah dipindahkan.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center rounded-lg border border-red-600 bg-red-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:border-red-700 hover:bg-red-700 hover:shadow-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:outline-none"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </>
    );
}
