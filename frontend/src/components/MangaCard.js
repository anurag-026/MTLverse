import Image from 'next/image';

export default function MangaCard({ manga }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[3/4] relative">
        <Image
          src={manga.coverImage || '/images/placeholder-manga.jpg'}
          alt={manga.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{manga.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{manga.author}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{manga.status}</span>
          <span className="text-sm text-gray-500">{manga.chapterCount} chapters</span>
        </div>
      </div>
    </div>
  );
}
