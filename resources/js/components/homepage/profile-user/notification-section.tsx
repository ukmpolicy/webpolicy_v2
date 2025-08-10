export default function NotificationSection({ isBirthday, memberName }) {
    return (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors duration-300 hover:border-red-500 sm:p-8">
            <header className="mb-4 text-center">
                <h2 className="text-3xl font-bold text-white md:text-4xl">Notifikasi</h2>
            </header>
            <div className="text-center text-zinc-400">
                {/* Tampilkan notifikasi ulang tahun jika isBirthday bernilai true */}
                {isBirthday ? (
                    <div className="text-white">
                        <div className="mx-auto text-center">
                            <p className="text-lg font-bold">🎉 Selamat Ulang Tahun, {memberName}!</p>
                            <p className="mt-2 text-sm">Semoga panjang umur dan sehat selalu.</p>
                        </div>
                    </div>
                ) : (
                    <p>Belum ada notifikasi baru untuk saat ini.</p>
                )}
            </div>
        </section>
    );
}
