export default function ChapterReader({ params }) {
  const { mangaId, chapterId } = params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chapter Reader</h1>
      <p>Manga: {mangaId}</p>
      <p>Chapter: {chapterId}</p>
      <p>Chapter reader content will go here</p>
    </div>
  );
}
