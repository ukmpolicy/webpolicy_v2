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
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default function AppStruktural({ strukturalList }: { strukturalList: Struktur[] }) {
  return (
    <section className="py-20 px-6 bg-black text-white">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-bold italic mb-12 relative">
          Struktural
          <div className="absolute w-28 h-[2px] bg-red-600 left-1/2 -translate-x-1/2 -bottom-2" />
        </h2>

        {strukturalList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strukturalList.slice(0, 3).map((person) => (
              <div
                key={person.id}
                className="w-full bg-[#111111] rounded-xl p-4 text-center border border-zinc-800 
                           hover:border-red-600 transition-all duration-300"
              >
                <div className="w-full aspect-[3/4] overflow-hidden rounded-lg shadow-lg mb-6">
                  <img
                    src={person.picture ?? "/images/default-profile.png"}
                    alt={`Foto ${person.name}`}
                    title={person.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 leading-snug">
                  {toTitleCase(person.name)}
                </h3>
                <p className="text-red-500 text-lg font-semibold">
                  {toTitleCase(person.position)}
                </p>
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
