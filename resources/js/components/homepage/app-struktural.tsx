type Struktur = {
    id: number;
    name: string;
    position: string;
    picture?: string | null;
};

// Fungsi bantu untuk menjadikan huruf kapital di setiap awal kata
const toTitleCase = (text: string) =>
    text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export default function AppStruktural({ strukturalList }: { strukturalList: Struktur[] }) {
    return (
        <section className="bg-black px-6 py-20 text-white">
            <div className="mx-auto max-w-[1200px]">
                <h2 className="relative mb-12 text-center text-3xl font-bold italic md:text-4xl">
                    Struktural
                    <div className="absolute -bottom-2 left-1/2 h-[2px] w-28 -translate-x-1/2 bg-red-600" />
                </h2>

                {strukturalList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {strukturalList.slice(0, 3).map((person) => (
                            <div
                                key={person.id}
                                className="w-full rounded-xl border border-zinc-800 bg-[#111111] p-4 text-center transition-all duration-300 hover:border-red-600"
                            >
                                <div className="mb-6 aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
                                    <img
                                        src={person.picture ?? '/images/default-profile.png'}
                                        alt={`Foto ${person.name}`}
                                        title={person.name}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <h3 className="mb-2 text-2xl leading-snug font-bold text-white">{toTitleCase(person.name)}</h3>
                                <p className="text-lg font-semibold text-red-500">{toTitleCase(person.position)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400">Tidak ada anggota struktural yang tersedia.</p>
                )}
            </div>
        </section>
    );
}
