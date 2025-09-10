export default function ChapterList({ chapters = [] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold mb-4">Chapters</h3>
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div>
            <span className="font-medium">Chapter {chapter.number}</span>
            {chapter.title && (
              <span className="text-gray-600 ml-2">- {chapter.title}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{chapter.releaseDate}</span>
            <a
              href={`/manga/${chapter.mangaId}/chapter/${chapter.id}`}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Read
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
