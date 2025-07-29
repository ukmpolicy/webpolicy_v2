type Struktur = {
  id: number;
  name: string;
  position: string;
  picture?: string | null;
};

export default function AppStruktural({ strukturalList }: { strukturalList: Struktur[] }) {
  return (
    <section className="py-20 px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-bold italic mb-12 relative">
          Struktural
          <div className="absolute w-28 h-[2px] bg-red-600 left-1/2 -translate-x-1/2 -bottom-2" />
        </h2>

        {strukturalList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {strukturalList.map((person) => (
              <div
                key={person.id}
                className="group flex flex-col items-center text-center bg-[#111111] rounded-2xl p-6
                           border border-zinc-800 hover:border-red-500 transition-all duration-300
                           hover:shadow-lg hover:shadow-red-500/20"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg ring-2 ring-red-600 mb-4">
                  <img
                    src={person.picture ?? "/images/default-profile.png"}
                    alt={`Foto ${person.name}`}
                    title={person.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-red-500 font-bold text-base md:text-lg mb-1">
                  {person.position}
                </p>
                <h3 className="text-white text-lg md:text-xl font-semibold">{person.name}</h3>
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
